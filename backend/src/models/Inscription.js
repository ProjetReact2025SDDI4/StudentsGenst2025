import mongoose from 'mongoose';

const inscriptionSchema = new mongoose.Schema({
    formationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formation',
        required: [true, 'La formation est requise']
    },
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
    dateNaissance: {
        type: Date
    },
    ville: {
        type: String,
        trim: true
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
    motivation: {
        type: String,
        trim: true
    },
    statut: {
        type: String,
        enum: ['EN_ATTENTE', 'CONFIRMEE', 'ANNULEE', 'TERMINEE'],
        default: 'EN_ATTENTE'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Populate automatique de la formation
inscriptionSchema.pre(/^find/, function (next) {
    this.populate('formationId', 'titre categorie ville cout');
    next();
});

// Virtuel pour le nom complet
inscriptionSchema.virtual('nomComplet').get(function () {
    return `${this.prenom} ${this.nom}`;
});

const Inscription = mongoose.model('Inscription', inscriptionSchema);

export default Inscription;
