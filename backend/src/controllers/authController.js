import User from '../models/User.js';
import Formateur from '../models/Formateur.js';
import { generateToken } from '../config/jwt.js';

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Admin
 */
export const register = async (req, res) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Cet email est déjà utilisé.'
            });
        }

        // Créer l'utilisateur
        const user = await User.create({
            nom,
            prenom,
            email,
            password,
            role: role || 'FORMATEUR'
        });

        // Si le rôle est FORMATEUR, créer automatiquement l'entrée Formateur
        if (user.role === 'FORMATEUR') {
            await Formateur.create({
                userId: user._id,
                motsCles: [],
                remarques: ''
            });
        }

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès.',
            data: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la création de l\'utilisateur.',
            error: error.message
        });
    }
};

/**
 * @desc    Connexion utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation des champs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis.'
            });
        }

        // Trouver l'utilisateur avec le mot de passe
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects.'
            });
        }

        // Vérifier le mot de passe
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Identifiants incorrects.'
            });
        }

        // Générer le token JWT
        const token = generateToken({
            id: user._id,
            role: user.role
        });

        res.status(200).json({
            success: true,
            message: 'Connexion réussie.',
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer les infos de l'utilisateur connecté
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        let profile = null;
        if (user.role === 'FORMATEUR') {
            profile = await Formateur.findOne({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            data: user,
            profile: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du profil.',
            error: error.message
        });
    }
};

/**
 * @desc    Mettre à jour le profil utilisateur
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { nom, prenom, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { nom, prenom, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profil mis à jour avec succès.',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du profil.',
            error: error.message
        });
    }
};

/**
 * @desc    Changer le mot de passe
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        // Vérifier l'ancien mot de passe
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Mot de passe actuel incorrect.'
            });
        }

        // Mettre à jour le mot de passe
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mot de passe modifié avec succès.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors du changement de mot de passe.',
            error: error.message
        });
    }
};

/**
 * @desc    Récupérer tous les utilisateurs
 * @route   GET /api/auth/users
 * @access  Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des utilisateurs.',
            error: error.message
        });
    }
};

export default { register, login, getMe, updateProfile, changePassword, getAllUsers };
