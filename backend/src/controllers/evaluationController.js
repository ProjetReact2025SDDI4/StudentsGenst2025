import Evaluation from '../models/Evaluation.js';
import Formateur from '../models/Formateur.js';
import { sendEmail } from '../config/email.js';

/**
 * @desc    Créer une évaluation
 * @route   POST /api/evaluations
 * @access  Public (participant)
 */
export const create = async (req, res) => {
    try {
        const evaluation = await Evaluation.create(req.body);

        await evaluation.populate([
            { path: 'formationId', select: 'titre' },
            { path: 'formateurId', populate: { path: 'userId', select: 'nom prenom email' } }
        ]);

        const formationTitre = evaluation.formationId?.titre || 'Votre formation';
        const formateurNom = evaluation.formateurId?.userId
            ? `${evaluation.formateurId.userId.prenom} ${evaluation.formateurId.userId.nom}`
            : 'le formateur';
        const formateurEmail = evaluation.formateurId?.userId?.email;
        const participantEmail = evaluation.participantEmail;

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const moyenne =
            ((evaluation.notePedagogie + evaluation.rythme + evaluation.support + evaluation.maitriseSujet) / 4).toFixed(2);

        try {
            if (participantEmail) {
                await sendEmail({
                    to: participantEmail,
                    subject: `Merci pour votre évaluation - ${formationTitre}`,
                    text:
                        `Bonjour,\n\n` +
                        `Nous vous remercions d'avoir pris le temps d'évaluer la formation "${formationTitre}" animée par ${formateurNom}.\n\n` +
                        `Récapitulatif de votre évaluation :\n` +
                        `- Pédagogie : ${evaluation.notePedagogie}/5\n` +
                        `- Rythme : ${evaluation.rythme}/5\n` +
                        `- Support : ${evaluation.support}/5\n` +
                        `- Maîtrise du sujet : ${evaluation.maitriseSujet}/5\n` +
                        `- Moyenne globale : ${moyenne}/5\n` +
                        `${evaluation.commentaire ? `\nVotre commentaire :\n${evaluation.commentaire}\n\n` : '\n'}` +
                        `Vous pouvez découvrir d'autres formations sur : ${frontendUrl}/formations\n\n` +
                        `Vos retours nous aident à améliorer en continu la qualité de nos formations.\n\n` +
                        `Cordialement,\nL'équipe FormationsGest`
                });
            }

            if (formateurEmail) {
                await sendEmail({
                    to: formateurEmail,
                    subject: `Nouvelle évaluation reçue - ${formationTitre}`,
                    text:
                        `Bonjour ${formateurNom},\n\n` +
                        `Vous avez reçu une nouvelle évaluation pour la formation "${formationTitre}".\n\n` +
                        `Notes :\n` +
                        `- Pédagogie : ${evaluation.notePedagogie}/5\n` +
                        `- Rythme : ${evaluation.rythme}/5\n` +
                        `- Support : ${evaluation.support}/5\n` +
                        `- Maîtrise du sujet : ${evaluation.maitriseSujet}/5\n` +
                        `- Moyenne globale : ${moyenne}/5\n` +
                        `${evaluation.commentaire ? `\nCommentaire du participant :\n${evaluation.commentaire}\n\n` : '\n'}` +
                        `Consultez vos évaluations détaillées dans votre espace : ${frontendUrl}/formateur/evaluations\n\n` +
                        `Cordialement,\nL'équipe FormationsGest`
                });
            }

            const adminEmail = process.env.ADMIN_EMAIL || 'admin@formationsgest.com';
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `Nouvelle évaluation reçue - ${formationTitre}`,
                    text:
                        `Une nouvelle évaluation vient d'être soumise pour la formation "${formationTitre}".\n\n` +
                        `Formateur : ${formateurNom}\n` +
                        `Notes :\n` +
                        `- Pédagogie : ${evaluation.notePedagogie}/5\n` +
                        `- Rythme : ${evaluation.rythme}/5\n` +
                        `- Support : ${evaluation.support}/5\n` +
                        `- Maîtrise du sujet : ${evaluation.maitriseSujet}/5\n` +
                        `- Moyenne globale : ${moyenne}/5\n` +
                        `${evaluation.commentaire ? `\nCommentaire du participant :\n${evaluation.commentaire}\n\n` : '\n'}` +
                        `Consulter l'ensemble des évaluations : ${frontendUrl}/admin/evaluations\n`
                });
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi des emails d\'évaluation:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Merci pour votre évaluation !',
            data: evaluation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'évaluation.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les évaluations
 *          - Admin / Assistant : toutes les évaluations (avec filtres optionnels)
 *          - Formateur : uniquement ses propres évaluations
 * @route   GET /api/evaluations
 * @access  Privé (ADMIN, ASSISTANT, FORMATEUR)
 */
export const getAll = async (req, res) => {
    try {
        const { formationId, formateurId } = req.query;

        let filters = {};

        // Cas Formateur : ne voir que ses propres évaluations
        if (req.user?.role === 'FORMATEUR') {
            const formateur = await Formateur.findOne({ userId: req.user._id });

            if (!formateur) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    data: []
                });
            }

            filters.formateurId = formateur._id;

            if (formationId) {
                filters.formationId = formationId;
            }
        } else {
            // Cas Admin / Assistant : filtres libres
            if (formationId) filters.formationId = formationId;
            if (formateurId) filters.formateurId = formateurId;
        }

        const evaluations = await Evaluation.find(filters).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: evaluations.length,
            data: evaluations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des évaluations.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer une évaluation par ID
 * @route   GET /api/evaluations/:id
 * @access  Admin
 */
export const getById = async (req, res) => {
    try {
        const evaluation = await Evaluation.findById(req.params.id);

        if (!evaluation) {
            return res.status(404).json({
                success: false,
                message: 'Évaluation non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            data: evaluation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'évaluation.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les statistiques d'évaluation d'un formateur
 * @route   GET /api/evaluations/formateur/:formateurId/stats
 * @access  Admin
 */
export const getStatsByFormateur = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({
            formateurId: req.params.formateurId
        });

        if (evaluations.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    count: 0,
                    moyennes: null
                }
            });
        }

        // Calculer les moyennes
        const stats = {
            count: evaluations.length,
            moyennes: {
                pedagogie: 0,
                rythme: 0,
                support: 0,
                maitriseSujet: 0,
                generale: 0
            }
        };

        evaluations.forEach(e => {
            stats.moyennes.pedagogie += e.notePedagogie;
            stats.moyennes.rythme += e.rythme;
            stats.moyennes.support += e.support;
            stats.moyennes.maitriseSujet += e.maitriseSujet;
        });

        const count = evaluations.length;
        stats.moyennes.pedagogie = (stats.moyennes.pedagogie / count).toFixed(2);
        stats.moyennes.rythme = (stats.moyennes.rythme / count).toFixed(2);
        stats.moyennes.support = (stats.moyennes.support / count).toFixed(2);
        stats.moyennes.maitriseSujet = (stats.moyennes.maitriseSujet / count).toFixed(2);
        stats.moyennes.generale = (
            (parseFloat(stats.moyennes.pedagogie) +
                parseFloat(stats.moyennes.rythme) +
                parseFloat(stats.moyennes.support) +
                parseFloat(stats.moyennes.maitriseSujet)) / 4
        ).toFixed(2);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul des statistiques.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les statistiques d'évaluation d'une formation
 * @route   GET /api/evaluations/formation/:formationId/stats
 * @access  Admin
 */
export const getStatsByFormation = async (req, res) => {
    try {
        const evaluations = await Evaluation.find({
            formationId: req.params.formationId
        });

        if (evaluations.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    count: 0,
                    moyennes: null
                }
            });
        }

        const stats = {
            count: evaluations.length,
            moyennes: {
                pedagogie: 0,
                rythme: 0,
                support: 0,
                maitriseSujet: 0,
                generale: 0
            }
        };

        evaluations.forEach(e => {
            stats.moyennes.pedagogie += e.notePedagogie;
            stats.moyennes.rythme += e.rythme;
            stats.moyennes.support += e.support;
            stats.moyennes.maitriseSujet += e.maitriseSujet;
        });

        const count = evaluations.length;
        stats.moyennes.pedagogie = (stats.moyennes.pedagogie / count).toFixed(2);
        stats.moyennes.rythme = (stats.moyennes.rythme / count).toFixed(2);
        stats.moyennes.support = (stats.moyennes.support / count).toFixed(2);
        stats.moyennes.maitriseSujet = (stats.moyennes.maitriseSujet / count).toFixed(2);
        stats.moyennes.generale = (
            (parseFloat(stats.moyennes.pedagogie) +
                parseFloat(stats.moyennes.rythme) +
                parseFloat(stats.moyennes.support) +
                parseFloat(stats.moyennes.maitriseSujet)) / 4
        ).toFixed(2);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors du calcul des statistiques.',
            error: error.message
        });
    }
};

export default { create, getAll, getById, getStatsByFormateur, getStatsByFormation };
