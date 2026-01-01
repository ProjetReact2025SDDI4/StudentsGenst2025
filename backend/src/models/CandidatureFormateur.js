import mongoose from 'mongoose';

const candidatureFormateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    telephone: {
        type: String,
        trim: true
    },
    motsCles: [{
        type: String,
        trim: true
    }],
    specialites: [{
        type: String,
        trim: true
    }],
    experience: {
        type: Number,
        default: 0,
        min: [0, 'L\'expérience doit être positive']
    },
    remarques: {
        type: String,
        trim: true,
        maxlength: [2000, 'Les remarques ne peuvent pas dépasser 2000 caractères']
    },
    cv: {
        type: String, // URL ou chemin du fichier CV
        trim: true
    },
    documents: [{
        url: String,
        name: String,
        type: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    statut: {
        type: String,
        enum: {
            values: ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'],
            message: 'Le statut doit être EN_ATTENTE, ACCEPTEE ou REFUSEE'
        },
        default: 'EN_ATTENTE'
    },
    dateTraitement: {
        type: Date
    },
    commentaireAdmin: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuel pour le nom complet
candidatureFormateurSchema.virtual('nomComplet').get(function () {
    return `${this.prenom} ${this.nom}`;
});

const CandidatureFormateur = mongoose.model('CandidatureFormateur', candidatureFormateurSchema);

export default CandidatureFormateur;
