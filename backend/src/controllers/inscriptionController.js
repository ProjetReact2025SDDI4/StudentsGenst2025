import Inscription from '../models/Inscription.js';
import Formation from '../models/Formation.js';
import { sendEmail } from '../config/email.js';

/**
 * @desc    Créer une inscription (public)
 * @route   POST /api/inscriptions
 * @access  Public
 */
export const create = async (req, res) => {
    try {
        const { formationId, typeCandidat, entreprise, fonction } = req.body;

        // Vérifier que la formation existe
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({
                success: false,
                message: 'Formation non trouvée.'
            });
        }

        // Logique de validation selon le type de formation
        if (formation.type === 'INDIVIDU' && typeCandidat === 'ENTREPRISE') {
            return res.status(400).json({
                success: false,
                message: 'Cette formation est réservée aux particuliers.'
            });
        }

        if (formation.type === 'ENTREPRISE' && typeCandidat === 'PARTICULIER') {
            return res.status(400).json({
                success: false,
                message: 'Cette formation est réservée aux entreprises.'
            });
        }

        // Si c'est une entreprise, le nom de l'entreprise est requis
        if (typeCandidat === 'ENTREPRISE' && !entreprise) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de l\'entreprise est requis pour une inscription entreprise.'
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

        const inscriptionData = { ...req.body };
        
        // Gérer les documents si présents
        if (req.files && req.files.length > 0) {
            inscriptionData.documents = req.files.map(file => file.path);
        }

        const inscription = await Inscription.create(inscriptionData);

        await inscription.populate('formationId', 'titre categorie ville cout type');

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const formationUrl = `${frontendUrl}/formations/${formationId}`;

        // Personnalisation de l'email selon le type
        let emailText = `Bonjour ${inscription.prenom} ${inscription.nom},\n\n`;
        
        if (typeCandidat === 'ENTREPRISE') {
            emailText += `Votre inscription dans le cadre de l'entreprise "${entreprise}" à la formation professionnelle "${formation.titre}" a bien été enregistrée.\n\n`;
            emailText += `Poste occupé : ${fonction || 'Non précisé'}\n`;
        } else {
            emailText += `Votre inscription à la formation "${formation.titre}" a bien été enregistrée.\n\n`;
        }

        emailText += `Détails de la formation :\n`;
        emailText += `- Catégorie : ${formation.categorie}\n`;
        emailText += `- Type : ${formation.type === 'ENTREPRISE' ? 'Formation Intra-Entreprise' : 'Formation Inter-Particuliers'}\n`;
        emailText += `- Ville : ${formation.ville}\n`;
        
        if (formation.cout > 0) {
            emailText += `- Coût : ${formation.cout} DH\n`;
        }

        emailText += `\nVous pouvez consulter la fiche de la formation ici : ${formationUrl}\n\n`;
        emailText += `Notre équipe pédagogique va étudier votre demande et vous contactera prochainement pour valider les modalités de prise en charge.\n\n`;
        emailText += `Cordialement,\nL'équipe FormationsGest`;

        try {
            await sendEmail({
                to: inscription.email,
                subject: `Confirmation d'inscription : ${formation.titre} (${typeCandidat === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'})`,
                text: emailText
            });

            // Email optionnel pour l'admin
            await sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@formationsgest.com',
                subject: `Nouvelle Inscription : ${formation.titre}`,
                text: `Une nouvelle inscription a été reçue.\n\nCandidat : ${inscription.prenom} ${inscription.nom}\nType : ${typeCandidat}\n${typeCandidat === 'ENTREPRISE' ? `Entreprise : ${entreprise}` : ''}\nFormation : ${formation.titre}\nEmail : ${inscription.email}`
            });
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi des emails:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Inscription enregistrée avec succès. Un email de confirmation vous a été envoyé.',
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

export const getEvolutionStats = async (req, res) => {
    try {
        const months = parseInt(req.query.months, 10) || 6;

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

        const results = await Inscription.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        statut: '$statut'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);

        const statsByMonth = {};

        results.forEach(item => {
            const year = item._id.year;
            const month = item._id.month;
            const statut = item._id.statut;
            const key = `${year}-${String(month).padStart(2, '0')}`;

            if (!statsByMonth[key]) {
                statsByMonth[key] = {
                    period: key,
                    year,
                    month,
                    total: 0,
                    EN_ATTENTE: 0,
                    CONFIRMEE: 0,
                    ANNULEE: 0,
                    TERMINEE: 0
                };
            }

            if (statsByMonth[key][statut] !== undefined) {
                statsByMonth[key][statut] += item.count;
            }
            statsByMonth[key].total += item.count;
        });

        const periods = Object.values(statsByMonth).sort((a, b) => {
            if (a.year === b.year) {
                return a.month - b.month;
            }
            return a.year - b.year;
        });

        res.status(200).json({
            success: true,
            count: periods.length,
            data: periods
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques des inscriptions.',
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

export default { create, getAll, getEvolutionStats, getById, update, getByFormation };
