import mongoose from 'mongoose';

const entrepriseSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom de l\'entreprise est requis'],
        trim: true,
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    adresse: {
        type: String,
        trim: true
    },
    ville: {
        type: String,
        trim: true
    },
    codePostal: {
        type: String,
        trim: true
    },
    telephone: {
        type: String,
        trim: true,
        match: [/^[0-9+\s()-]+$/, 'Numéro de téléphone invalide']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    url: {
        type: String,
        trim: true
    },
    secteurActivite: {
        type: String,
        trim: true
    },
    contactPrincipal: {
        nom: String,
        prenom: String,
        fonction: String,
        telephone: String,
        email: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuel pour les plannings de l'entreprise
entrepriseSchema.virtual('plannings', {
    ref: 'Planning',
    localField: '_id',
    foreignField: 'entrepriseId'
});

const Entreprise = mongoose.model('Entreprise', entrepriseSchema);

export default Entreprise;
