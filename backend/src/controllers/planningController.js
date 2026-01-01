import Planning from '../models/Planning.js';
import { sendEmail } from '../config/email.js';

/**
 * @desc    Récupérer tous les plannings
 * @route   GET /api/plannings
 * @access  Admin, Assistant
 */
export const getAll = async (req, res) => {
    try {
        const { formationId, formateurId, entrepriseId, statut, dateDebut, dateFin } = req.query;

        let filters = {};

        if (formationId) filters.formationId = formationId;
        if (formateurId) filters.formateurId = formateurId;
        if (entrepriseId) filters.entrepriseId = entrepriseId;
        if (statut) filters.statut = statut;

        // Filtrer par plage de dates
        if (dateDebut || dateFin) {
            filters.dateDebut = {};
            if (dateDebut) filters.dateDebut.$gte = new Date(dateDebut);
            if (dateFin) filters.dateDebut.$lte = new Date(dateFin);
        }

        const plannings = await Planning.find(filters).sort({ dateDebut: -1 });

        res.status(200).json({
            success: true,
            count: plannings.length,
            data: plannings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des plannings.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer un planning par ID
 * @route   GET /api/plannings/:id
 * @access  Admin, Assistant
 */
export const getById = async (req, res) => {
    try {
        const planning = await Planning.findById(req.params.id);

        if (!planning) {
            return res.status(404).json({
                success: false,
                message: 'Planning non trouvé.'
            });
        }

        res.status(200).json({
            success: true,
            data: planning
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du planning.',
            error: error.message
        });
    }
};

/**
 * @desc    Créer un planning
 * @route   POST /api/plannings
 * @access  Admin, Assistant
 */
export const create = async (req, res) => {
    try {
        const { formateurId, dateDebut, dateFin } = req.body;
        const dDebut = new Date(dateDebut);
        const dFin = new Date(dateFin);

        // Vérifier les conflits de dates pour le formateur
        // Un formateur ne peut pas avoir une session qui chevauche une autre
        const conflits = await Planning.find({
            formateurId,
            statut: { $ne: 'ANNULE' },
            $or: [
                { dateDebut: { $lte: dFin }, dateFin: { $gte: dDebut } }
            ]
        });

        if (conflits.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Le formateur est déjà planifié sur cette période.',
                conflits: conflits.map(c => ({
                    formation: c.formationId?.titre,
                    du: c.dateDebut,
                    au: c.dateFin
                }))
            });
        }

        const planning = await Planning.create(req.body);

        // Récupérer avec les relations
        const populatedPlanning = await Planning.findById(planning._id);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const formationTitre = populatedPlanning.formationId?.titre || 'Session de formation';
        const formateurNom = populatedPlanning.formateurId?.userId
            ? `${populatedPlanning.formateurId.userId.prenom} ${populatedPlanning.formateurId.userId.nom}`
            : 'Votre formateur';
        const formateurEmail = populatedPlanning.formateurId?.userId?.email;
        const entrepriseNom = populatedPlanning.entrepriseId?.nom || 'Session ouverte au public';
        const entrepriseEmail = populatedPlanning.entrepriseId?.email;

        const dateDebutStr = populatedPlanning.dateDebut
            ? new Date(populatedPlanning.dateDebut).toLocaleDateString('fr-FR')
            : '';
        const dateFinStr = populatedPlanning.dateFin
            ? new Date(populatedPlanning.dateFin).toLocaleDateString('fr-FR')
            : '';

        const heureDebut = populatedPlanning.heureDebut || '09:00';
        const heureFin = populatedPlanning.heureFin || '17:00';
        const lieu = populatedPlanning.lieu || 'À préciser';

        try {
            if (formateurEmail) {
                await sendEmail({
                    to: formateurEmail,
                    subject: `Nouvelle session planifiée : ${formationTitre}`,
                    text:
                        `Bonjour ${formateurNom},\n\n` +
                        `Une nouvelle session de formation vous a été planifiée.\n\n` +
                        `Détails de la session :\n` +
                        `- Formation : ${formationTitre}\n` +
                        `- Client : ${entrepriseNom}\n` +
                        `- Période : du ${dateDebutStr} au ${dateFinStr}\n` +
                        `- Horaires : ${heureDebut} - ${heureFin}\n` +
                        `- Lieu : ${lieu}\n\n` +
                        `Consultez vos sessions depuis votre espace : ${frontendUrl}/formateur/sessions\n\n` +
                        `Cordialement,\nL'équipe FormationsGest`
                });
            }

            if (entrepriseEmail) {
                await sendEmail({
                    to: entrepriseEmail,
                    subject: `Confirmation de session de formation : ${formationTitre}`,
                    text:
                        `Bonjour,\n\n` +
                        `Une session de formation a été planifiée pour votre entreprise.\n\n` +
                        `Détails de la session :\n` +
                        `- Formation : ${formationTitre}\n` +
                        `- Formateur : ${formateurNom}\n` +
                        `- Période : du ${dateDebutStr} au ${dateFinStr}\n` +
                        `- Horaires : ${heureDebut} - ${heureFin}\n` +
                        `- Lieu : ${lieu}\n\n` +
                        `Pour suivre vos formations, rendez-vous sur : ${frontendUrl}\n\n` +
                        `Cordialement,\nL'équipe FormationsGest`
                });
            }

            const adminEmail = process.env.ADMIN_EMAIL || 'admin@formationsgest.com';
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `Nouveau planning créé : ${formationTitre}`,
                    text:
                        `Un nouveau planning de session vient d'être créé.\n\n` +
                        `- Formation : ${formationTitre}\n` +
                        `- Formateur : ${formateurNom}\n` +
                        `- Client : ${entrepriseNom}\n` +
                        `- Période : du ${dateDebutStr} au ${dateFinStr}\n` +
                        `- Horaires : ${heureDebut} - ${heureFin}\n` +
                        `- Lieu : ${lieu}\n\n` +
                        `Consulter le planning complet : ${frontendUrl}/admin/plannings\n`
                });
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi des emails de création de planning:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Planning créé avec succès.',
            data: populatedPlanning
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du planning.',
            error: error.message
        });
    }
};

/**
 * @desc    Mettre à jour un planning
 * @route   PUT /api/plannings/:id
 * @access  Admin, Assistant
 */
export const update = async (req, res) => {
    try {
        const planning = await Planning.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!planning) {
            return res.status(404).json({
                success: false,
                message: 'Planning non trouvé.'
            });
        }

        const populatedPlanning = await Planning.findById(planning._id);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const formationTitre = populatedPlanning.formationId?.titre || 'Session de formation';
        const formateurNom = populatedPlanning.formateurId?.userId
            ? `${populatedPlanning.formateurId.userId.prenom} ${populatedPlanning.formateurId.userId.nom}`
            : 'Votre formateur';
        const formateurEmail = populatedPlanning.formateurId?.userId?.email;
        const entrepriseNom = populatedPlanning.entrepriseId?.nom || 'Session ouverte au public';
        const entrepriseEmail = populatedPlanning.entrepriseId?.email;

        const dateDebutStr = populatedPlanning.dateDebut
            ? new Date(populatedPlanning.dateDebut).toLocaleDateString('fr-FR')
            : '';
        const dateFinStr = populatedPlanning.dateFin
            ? new Date(populatedPlanning.dateFin).toLocaleDateString('fr-FR')
            : '';

        const heureDebut = populatedPlanning.heureDebut || '09:00';
        const heureFin = populatedPlanning.heureFin || '17:00';
        const lieu = populatedPlanning.lieu || 'À préciser';

        try {
            if (formateurEmail) {
                await sendEmail({
                    to: formateurEmail,
                    subject: `Mise à jour de votre session : ${formationTitre}`,
                    text:
                        `Bonjour ${formateurNom},\n\n` +
                        `Une session de formation planifiée pour vous vient d'être mise à jour.\n\n` +
                        `Nouveaux détails de la session :\n` +
                        `- Formation : ${formationTitre}\n` +
                        `- Client : ${entrepriseNom}\n` +
                        `- Période : du ${dateDebutStr} au ${dateFinStr}\n` +
                        `- Horaires : ${heureDebut} - ${heureFin}\n` +
                        `- Lieu : ${lieu}\n\n` +
                        `Consultez vos sessions depuis votre espace : ${frontendUrl}/formateur/sessions\n\n` +
                        `Cordialement,\nL'équipe FormationsGest`
                });
            }

            if (entrepriseEmail) {
                await sendEmail({
                    to: entrepriseEmail,
                    subject: `Mise à jour de la session de formation : ${formationTitre}`,
                    text:
                        `Bonjour,\n\n` +
                        `Une session de formation planifiée pour votre entreprise vient d'être mise à jour.\n\n` +
                        `Nouveaux détails de la session :\n` +
                        `- Formation : ${formationTitre}\n` +
                        `- Formateur : ${formateurNom}\n` +
                        `- Période : du ${dateDebutStr} au ${dateFinStr}\n` +
                        `- Horaires : ${heureDebut} - ${heureFin}\n` +
                        `- Lieu : ${lieu}\n\n` +
                        `Pour suivre vos formations, rendez-vous sur : ${frontendUrl}\n\n` +
                        `Cordialement,\nL'équipe FormationsGest`
                });
            }

            const adminEmail = process.env.ADMIN_EMAIL || 'admin@formationsgest.com';
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `Planning mis à jour : ${formationTitre}`,
                    text:
                        `Un planning de session vient d'être mis à jour.\n\n` +
                        `- Formation : ${formationTitre}\n` +
                        `- Formateur : ${formateurNom}\n` +
                        `- Client : ${entrepriseNom}\n` +
                        `- Période : du ${dateDebutStr} au ${dateFinStr}\n` +
                        `- Horaires : ${heureDebut} - ${heureFin}\n` +
                        `- Lieu : ${lieu}\n\n` +
                        `Consulter le planning complet : ${frontendUrl}/admin/plannings\n`
                });
            }
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi des emails de mise à jour de planning:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Planning mis à jour avec succès.',
            data: populatedPlanning
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du planning.',
            error: error.message
        });
    }
};

/**
 * @desc    Supprimer un planning
 * @route   DELETE /api/plannings/:id
 * @access  Admin
 */
export const remove = async (req, res) => {
    try {
        const planning = await Planning.findByIdAndDelete(req.params.id);

        if (!planning) {
            return res.status(404).json({
                success: false,
                message: 'Planning non trouvé.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Planning supprimé avec succès.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du planning.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer le planning d'un formateur
 * @route   GET /api/plannings/formateur/:formateurId
 * @access  Admin, Formateur concerné
 */
export const getByFormateur = async (req, res) => {
    try {
        const plannings = await Planning.find({
            formateurId: req.params.formateurId,
            statut: { $ne: 'ANNULE' }
        }).sort({ dateDebut: 1 });

        res.status(200).json({
            success: true,
            count: plannings.length,
            data: plannings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du planning du formateur.',
            error: error.message
        });
    }
};

export default { getAll, getById, create, update, remove, getByFormateur };
