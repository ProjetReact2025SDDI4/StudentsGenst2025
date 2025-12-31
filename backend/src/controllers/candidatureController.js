import CandidatureFormateur from '../models/CandidatureFormateur.js';
import User from '../models/User.js';
import Formateur from '../models/Formateur.js';

/**
 * @desc    Créer une candidature formateur (public)
 * @route   POST /api/candidatures
 * @access  Public
 */
export const create = async (req, res) => {
    try {
        const { email } = req.body;

        // Vérifier si une candidature existe déjà avec cet email
        const existingCandidature = await CandidatureFormateur.findOne({
            email,
            statut: 'EN_ATTENTE'
        });

        if (existingCandidature) {
            return res.status(400).json({
                success: false,
                message: 'Une candidature est déjà en cours avec cet email.'
            });
        }

        // Vérifier si l'email est déjà utilisé par un utilisateur
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà associé à un compte existant.'
            });
        }

        const candidatureData = { ...req.body };

        // Gérer le fichier CV si présent (URL Cloudinary)
        if (req.file) {
            candidatureData.cv = req.file.path;
        }

        // Convertir motsCles et specialites si reçus en chaînes (cas du FormData)
        if (typeof candidatureData.motsCles === 'string') {
            candidatureData.motsCles = candidatureData.motsCles.split(',').map(m => m.trim());
        }
        if (typeof candidatureData.specialites === 'string') {
            candidatureData.specialites = candidatureData.specialites.split(',').map(s => s.trim());
        }

        const candidature = await CandidatureFormateur.create(candidatureData);

        res.status(201).json({
            success: true,
            message: 'Votre candidature a été enregistrée. Nous vous contacterons prochainement.',
            data: candidature
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de la candidature.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer toutes les candidatures
 * @route   GET /api/candidatures
 * @access  Admin
 */
export const getAll = async (req, res) => {
    try {
        const { statut, search } = req.query;

        let filters = {};

        if (statut) filters.statut = statut;
        if (search) {
            filters.$or = [
                { nom: { $regex: search, $options: 'i' } },
                { prenom: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const candidatures = await CandidatureFormateur.find(filters).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: candidatures.length,
            data: candidatures
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des candidatures.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer une candidature par ID
 * @route   GET /api/candidatures/:id
 * @access  Admin
 */
export const getById = async (req, res) => {
    try {
        const candidature = await CandidatureFormateur.findById(req.params.id);

        if (!candidature) {
            return res.status(404).json({
                success: false,
                message: 'Candidature non trouvée.'
            });
        }

        res.status(200).json({
            success: true,
            data: candidature
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la candidature.',
            error: error.message
        });
    }
};

/**
 * @desc    Accepter une candidature
 * @route   PUT /api/candidatures/:id/accept
 * @access  Admin
 */
export const accept = async (req, res) => {
    try {
        const candidature = await CandidatureFormateur.findById(req.params.id);

        if (!candidature) {
            return res.status(404).json({
                success: false,
                message: 'Candidature non trouvée.'
            });
        }

        if (candidature.statut !== 'EN_ATTENTE') {
            return res.status(400).json({
                success: false,
                message: 'Cette candidature a déjà été traitée.'
            });
        }

        // Générer un mot de passe temporaire
        const tempPassword = Math.random().toString(36).slice(-8);

        // Créer le compte utilisateur
        const user = await User.create({
            nom: candidature.nom,
            prenom: candidature.prenom,
            email: candidature.email,
            password: tempPassword,
            role: 'FORMATEUR'
        });

        // Créer le profil formateur
        await Formateur.create({
            userId: user._id,
            motsCles: candidature.motsCles || [],
            specialites: candidature.specialites || [],
            remarques: candidature.remarques,
            experience: candidature.experience || 0,
            cv: candidature.cv
        });

        // Mettre à jour la candidature
        candidature.statut = 'ACCEPTEE';
        candidature.dateTraitement = new Date();
        candidature.commentaireAdmin = req.body.commentaire || 'Candidature acceptée';
        await candidature.save();

        res.status(200).json({
            success: true,
            message: 'Candidature acceptée. Le compte formateur a été créé.',
            data: {
                candidature,
                tempPassword // À envoyer par email en production
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'acceptation de la candidature.',
            error: error.message
        });
    }
};

/**
 * @desc    Refuser une candidature
 * @route   PUT /api/candidatures/:id/reject
 * @access  Admin
 */
export const reject = async (req, res) => {
    try {
        const candidature = await CandidatureFormateur.findById(req.params.id);

        if (!candidature) {
            return res.status(404).json({
                success: false,
                message: 'Candidature non trouvée.'
            });
        }

        if (candidature.statut !== 'EN_ATTENTE') {
            return res.status(400).json({
                success: false,
                message: 'Cette candidature a déjà été traitée.'
            });
        }

        candidature.statut = 'REFUSEE';
        candidature.dateTraitement = new Date();
        candidature.commentaireAdmin = req.body.commentaire || 'Candidature refusée';
        await candidature.save();

        res.status(200).json({
            success: true,
            message: 'Candidature refusée.',
            data: candidature
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors du refus de la candidature.',
            error: error.message
        });
    }
};

export default { create, getAll, getById, accept, reject };
