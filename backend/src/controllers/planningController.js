import Planning from '../models/Planning.js';

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
        const { formationId, formateurId, dateDebut, dateFin } = req.body;
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

        res.status(200).json({
            success: true,
            message: 'Planning mis à jour avec succès.',
            data: planning
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
