import Formateur from '../models/Formateur.js';
import User from '../models/User.js';

/**
 * @desc    Récupérer tous les formateurs
 * @route   GET /api/formateurs
 * @access  Admin
 */
export const getAll = async (req, res) => {
    try {
        const { search, motsCles } = req.query;

        let filters = { isActive: true };

        if (motsCles) {
            filters.motsCles = { $in: motsCles.split(',') };
        }

        let formateurs = await Formateur.find(filters);

        // Filtrer par recherche sur nom/prénom
        if (search) {
            formateurs = formateurs.filter(f =>
                f.userId && (
                    f.userId.nom.toLowerCase().includes(search.toLowerCase()) ||
                    f.userId.prenom.toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        res.status(200).json({
            success: true,
            count: formateurs.length,
            data: formateurs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des formateurs.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer un formateur par ID
 * @route   GET /api/formateurs/:id
 * @access  Admin
 */
export const getById = async (req, res) => {
    try {
        const formateur = await Formateur.findById(req.params.id)
            .populate('plannings')
            .populate('evaluations');

        if (!formateur) {
            return res.status(404).json({
                success: false,
                message: 'Formateur non trouvé.'
            });
        }

        res.status(200).json({
            success: true,
            data: formateur
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du formateur.',
            error: error.message
        });
    }
};

/**
 * @desc    Créer un formateur
 * @route   POST /api/formateurs
 * @access  Admin
 */
export const create = async (req, res) => {
    try {
        const { userId, motsCles, remarques, specialites, experience } = req.body;

        // Vérifier que l'utilisateur existe et a le rôle FORMATEUR
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }

        // Vérifier qu'un formateur n'existe pas déjà pour cet utilisateur
        const existingFormateur = await Formateur.findOne({ userId });
        if (existingFormateur) {
            return res.status(400).json({
                success: false,
                message: 'Ce formateur existe déjà.'
            });
        }

        // Mettre à jour le rôle de l'utilisateur si nécessaire
        if (user.role !== 'FORMATEUR') {
            user.role = 'FORMATEUR';
            await user.save();
        }

        const formateur = await Formateur.create({
            userId,
            motsCles: motsCles || [],
            remarques,
            specialites: specialites || [],
            experience: experience || 0
        });

        await formateur.populate('userId', 'nom prenom email');

        res.status(201).json({
            success: true,
            message: 'Formateur créé avec succès.',
            data: formateur
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création du formateur.',
            error: error.message
        });
    }
};

/**
 * @desc    Mettre à jour un formateur
 * @route   PUT /api/formateurs/:id
 * @access  Admin
 */
export const update = async (req, res) => {
    try {
        const formateur = await Formateur.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!formateur) {
            return res.status(404).json({
                success: false,
                message: 'Formateur non trouvé.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Formateur mis à jour avec succès.',
            data: formateur
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du formateur.',
            error: error.message
        });
    }
};

/**
 * @desc    Désactiver un formateur
 * @route   DELETE /api/formateurs/:id
 * @access  Admin
 */
export const remove = async (req, res) => {
    try {
        const formateur = await Formateur.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!formateur) {
            return res.status(404).json({
                success: false,
                message: 'Formateur non trouvé.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Formateur désactivé avec succès.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la désactivation du formateur.',
            error: error.message
        });
    }
};

export default { getAll, getById, create, update, remove };
