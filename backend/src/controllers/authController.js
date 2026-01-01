import crypto from 'crypto';
import User from '../models/User.js';
import Formateur from '../models/Formateur.js';
import { generateToken } from '../config/jwt.js';
import { sendEmail } from '../config/email.js';

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

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const loginUrl = `${frontendUrl}/login`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Votre accès FormationsGest',
                text: `Bonjour ${user.prenom} ${user.nom},\n\nUn compte vient d'être créé pour vous sur la plateforme FormationsGest.\n\nVoici vos informations de connexion :\n\nEmail : ${user.email}\nMot de passe : ${password}\n\nConnectez-vous dès maintenant sur : ${loginUrl}\n\nPour des raisons de sécurité, pensez à modifier votre mot de passe après votre première connexion.\n\nCordialement,\nL'équipe FormationsGest`
            });

            await sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@formationsgest.com',
                subject: 'Nouvel utilisateur créé sur FormationsGest',
                text: `Un nouvel utilisateur a été créé.\n\nNom : ${user.prenom} ${user.nom}\nEmail : ${user.email}\nRôle : ${user.role}`
            });
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi des emails de création d\'utilisateur:', emailError);
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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email requis.'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'Si un compte existe avec cet email, un lien a été envoyé.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        if (process.env.NODE_ENV === 'development') {
            console.log('Lien de réinitialisation généré pour', user.email, ':', resetUrl);
        }

        const message = `Vous avez demandé à réinitialiser votre mot de passe.\n\nCliquez sur le lien suivant ou copiez-le dans votre navigateur pour choisir un nouveau mot de passe :\n\n${resetUrl}\n\nCe lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Réinitialisation de votre mot de passe',
                text: message
            });
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', emailError);
        }

        return res.status(200).json({
            success: true,
            message: 'Si un compte existe avec cet email, un lien a été envoyé.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la demande de réinitialisation de mot de passe.',
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token et nouveau mot de passe requis.'
            });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Lien de réinitialisation invalide ou expiré.'
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de la réinitialisation du mot de passe.',
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

export default { register, login, getMe, updateProfile, changePassword, getAllUsers, forgotPassword, resetPassword };
