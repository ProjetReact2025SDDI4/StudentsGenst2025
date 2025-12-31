import Entreprise from '../models/Entreprise.js';

/**
 * @desc    Récupérer toutes les entreprises
 * @route   GET /api/entreprises
 * @access  Admin, Assistant
 */
export const getAll = async (req, res) => {
    try {
        const { search, ville, secteur } = req.query;

        let filters = { isActive: true };

        if (ville) filters.ville = ville;
        if (secteur) filters.secteurActivite = secteur;
        if (search) {
            filters.$or = [
                { nom: { $regex: search, $options: 'i' } },
                { ville: { $regex: search, $options: 'i' } }
            ];
        }

        const entreprises = await Entreprise.find(filters).sort({ nom: 1 });

        res.status(200).json({
            success: true,
            count: entreprises.length,
            data: entreprises
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des entreprises.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer une entreprise par ID
 * @route   GET /api/entreprises/:id
 * @access  Admin, Assistant
 */
export const getById = async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.params.id)
            .populate('plannings');

        if (!entreprise) {
            return res.status(404).json({
                success: false,
                message: 'Entreprise non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            data: entreprise
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'entreprise.',
            error: error.message
        });
    }
};

/**
 * @desc    Créer une entreprise
 * @route   POST /api/entreprises
 * @access  Admin, Assistant
 */
export const create = async (req, res) => {
    try {
        const entreprise = await Entreprise.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Entreprise créée avec succès.',
            data: entreprise
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'entreprise.',
            error: error.message
        });
    }
};

/**
 * @desc    Mettre à jour une entreprise
 * @route   PUT /api/entreprises/:id
 * @access  Admin, Assistant
 */
export const update = async (req, res) => {
    try {
        const entreprise = await Entreprise.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!entreprise) {
            return res.status(404).json({
                success: false,
                message: 'Entreprise non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Entreprise mise à jour avec succès.',
            data: entreprise
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour de l\'entreprise.',
            error: error.message
        });
    }
};

/**
 * @desc    Supprimer une entreprise
 * @route   DELETE /api/entreprises/:id
 * @access  Admin
 */
export const remove = async (req, res) => {
    try {
        const entreprise = await Entreprise.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!entreprise) {
            return res.status(404).json({
                success: false,
                message: 'Entreprise non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Entreprise supprimée avec succès.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de l\'entreprise.',
            error: error.message
        });
    }
};

export default { getAll, getById, create, update, remove };
