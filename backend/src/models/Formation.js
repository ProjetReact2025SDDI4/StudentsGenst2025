import mongoose from 'mongoose';

const formationSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, 'Le titre de la formation est requis'],
        trim: true,
        maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    categorie: {
        type: String,
        required: [true, 'La catégorie est requise'],
        trim: true
    },
    ville: {
        type: String,
        required: [true, 'La ville est requise'],
        trim: true
    },
    nombreHeures: {
        type: Number,
        required: [true, 'Le nombre d\'heures est requis'],
        min: [1, 'Le nombre d\'heures doit être positif']
    },
    cout: {
        type: Number,
        required: [true, 'Le coût est requis'],
        min: [0, 'Le coût doit être positif ou nul']
    },
    objectifs: {
        type: String,
        required: [true, 'Les objectifs sont requis']
    },
    programme: {
        type: String,
        required: [true, 'Le programme est requis']
    },
    type: {
        type: String,
        enum: {
            values: ['ENTREPRISE', 'INDIVIDU'],
            message: 'Le type doit être ENTREPRISE ou INDIVIDU'
        },
        required: [true, 'Le type de formation est requis']
    },
    image: {
        type: String,
        default: null
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

// Index pour la recherche
formationSchema.index({ titre: 'text', categorie: 'text', objectifs: 'text' });

// Virtuel pour le nombre d'inscriptions
formationSchema.virtual('inscriptions', {
    ref: 'Inscription',
    localField: '_id',
    foreignField: 'formationId',
    count: true
});

const Formation = mongoose.model('Formation', formationSchema);

export default Formation;
