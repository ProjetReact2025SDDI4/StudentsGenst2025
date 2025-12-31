import Inscription from '../models/Inscription.js';
import Formation from '../models/Formation.js';

/**
 * @desc    Créer une inscription (public)
 * @route   POST /api/inscriptions
 * @access  Public
 */
export const create = async (req, res) => {
    try {
        const { formationId } = req.body;

        // Vérifier que la formation existe et est de type INDIVIDU
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({
                success: false,
                message: 'Formation non trouvée.'
            });
        }

        if (formation.type !== 'INDIVIDU') {
            return res.status(400).json({
                success: false,
                message: 'Cette formation n\'accepte pas les inscriptions individuelles.'
            });
        }

        // Vérifier si l'email n'est pas déjà inscrit à cette formation
        const existingInscription = await Inscription.findOne({
            formationId,
            email: req.body.email,
            statut: { $ne: 'ANNULEE' }
        });

        if (existingInscription) {
            return res.status(400).json({
                success: false,
                message: 'Vous êtes déjà inscrit à cette formation.'
            });
        }

        const inscription = await Inscription.create(req.body);

        await inscription.populate('formationId', 'titre categorie ville cout');

        res.status(201).json({
            success: true,
            message: 'Inscription enregistrée avec succès. Vous recevrez une confirmation.',
            data: inscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'inscription.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer toutes les inscriptions
 * @route   GET /api/inscriptions
 * @access  Admin, Assistant
 */
export const getAll = async (req, res) => {
    try {
        const { formationId, statut, search } = req.query;

        let filters = {};

        if (formationId) filters.formationId = formationId;
        if (statut) filters.statut = statut;
        if (search) {
            filters.$or = [
                { nom: { $regex: search, $options: 'i' } },
                { prenom: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const inscriptions = await Inscription.find(filters).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inscriptions.length,
            data: inscriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des inscriptions.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer une inscription par ID
 * @route   GET /api/inscriptions/:id
 * @access  Admin, Assistant
 */
export const getById = async (req, res) => {
    try {
        const inscription = await Inscription.findById(req.params.id);

        if (!inscription) {
            return res.status(404).json({
                success: false,
                message: 'Inscription non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            data: inscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'inscription.',
            error: error.message
        });
    }
};

/**
 * @desc    Mettre à jour le statut d'une inscription
 * @route   PUT /api/inscriptions/:id
 * @access  Admin, Assistant
 */
export const update = async (req, res) => {
    try {
        const inscription = await Inscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!inscription) {
            return res.status(404).json({
                success: false,
                message: 'Inscription non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Inscription mise à jour avec succès.',
            data: inscription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'inscription.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les inscriptions par formation
 * @route   GET /api/inscriptions/formation/:formationId
 * @access  Admin, Assistant
 */
export const getByFormation = async (req, res) => {
    try {
        const inscriptions = await Inscription.find({
            formationId: req.params.formationId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inscriptions.length,
            data: inscriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des inscriptions.',
            error: error.message
        });
    }
};

export default { create, getAll, getById, update, getByFormation };
