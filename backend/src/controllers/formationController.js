import Formation from '../models/Formation.js';

/**
 * @desc    Récupérer toutes les formations
 * @route   GET /api/formations
 * @access  Public
 */
export const getAll = async (req, res) => {
    try {
        const { categorie, ville, type, search, page = 1, limit = 10 } = req.query;

        // Construire les filtres
        const filters = { isActive: true };

        if (categorie) filters.categorie = categorie;
        if (ville) filters.ville = ville;
        if (type) filters.type = type;
        if (search) {
            filters.$or = [
                { titre: { $regex: search, $options: 'i' } },
                { categorie: { $regex: search, $options: 'i' } },
                { objectifs: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const formations = await Formation.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Formation.countDocuments(filters);

        res.status(200).json({
            success: true,
            count: formations.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: formations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des formations.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer une formation par ID
 * @route   GET /api/formations/:id
 * @access  Public
 */
export const getById = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);

        if (!formation) {
            return res.status(404).json({
                success: false,
                message: 'Formation non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            data: formation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la formation.',
            error: error.message
        });
    }
};

/**
 * @desc    Créer une formation
 * @route   POST /api/formations
 * @access  Admin
 */
export const create = async (req, res) => {
    try {
        const formationData = { ...req.body };

        if (typeof formationData.objectifs === 'string') {
            formationData.objectifs = formationData.objectifs
                .split('\n')
                .map(o => o.trim())
                .filter(o => o.length > 0)
                .join('\n');
        }

        // Si une image a été uploadée
        if (req.file) {
            formationData.image = req.file.path;
        }

        const formation = await Formation.create(formationData);

        res.status(201).json({
            success: true,
            message: 'Formation créée avec succès.',
            data: formation
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(e => e.message).join(' ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la création de la formation.'
        });
    }
};

/**
 * @desc    Mettre à jour une formation
 * @route   PUT /api/formations/:id
 * @access  Admin
 */
export const update = async (req, res) => {
    try {
        const formationData = { ...req.body };

        if (typeof formationData.objectifs === 'string') {
            formationData.objectifs = formationData.objectifs
                .split('\n')
                .map(o => o.trim())
                .filter(o => o.length > 0)
                .join('\n');
        }

        // Si une nouvelle image a été uploadée
        if (req.file) {
            formationData.image = req.file.path;
        }

        const formation = await Formation.findByIdAndUpdate(
            req.params.id,
            formationData,
            { new: true, runValidators: true }
        );

        if (!formation) {
            return res.status(404).json({
                success: false,
                message: 'Formation non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Formation mise à jour avec succès.',
            data: formation
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(e => e.message).join(' ')
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de la formation.'
        });
    }
};

/**
 * @desc    Supprimer une formation
 * @route   DELETE /api/formations/:id
 * @access  Admin
 */
export const remove = async (req, res) => {
    try {
        const formation = await Formation.findByIdAndDelete(req.params.id);

        if (!formation) {
            return res.status(404).json({
                success: false,
                message: 'Formation non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Formation supprimée avec succès.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression de la formation.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les catégories uniques
 * @route   GET /api/formations/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
    try {
        const categories = await Formation.distinct('categorie', { isActive: true });

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des catégories.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les villes uniques
 * @route   GET /api/formations/villes
 * @access  Public
 */
export const getVilles = async (req, res) => {
    try {
        const villes = await Formation.distinct('ville', { isActive: true });

        res.status(200).json({
            success: true,
            data: villes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des villes.',
            error: error.message
        });
    }
};

export default { getAll, getById, create, update, remove, getCategories, getVilles };
