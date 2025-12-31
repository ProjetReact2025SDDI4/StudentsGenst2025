import Evaluation from '../models/Evaluation.js';

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
            { path: 'formateurId', populate: { path: 'userId', select: 'nom prenom' } }
        ]);

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
 * @desc    Récupérer toutes les évaluations
 * @route   GET /api/evaluations
 * @access  Admin
 */
export const getAll = async (req, res) => {
    try {
        const { formationId, formateurId } = req.query;

        let filters = {};

        if (formationId) filters.formationId = formationId;
        if (formateurId) filters.formateurId = formateurId;

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
