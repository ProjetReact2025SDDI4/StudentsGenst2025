import mongoose from 'mongoose';

const planningSchema = new mongoose.Schema({
    formationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formation',
        required: [true, 'La formation est requise']
    },
    formateurId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formateur',
        required: [true, 'Le formateur est requis']
    },
    entrepriseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entreprise',
        required: [true, 'L\'entreprise est requise']
    },
    dateDebut: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    dateFin: {
        type: Date,
        required: [true, 'La date de fin est requise']
    },
    heureDebut: {
        type: String,
        default: '09:00'
    },
    heureFin: {
        type: String,
        default: '17:00'
    },
    lieu: {
        type: String,
        trim: true
    },
    statut: {
        type: String,
        enum: ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'],
        default: 'PLANIFIE'
    },
    notes: {
        type: String,
        trim: true
    },
    nombreParticipants: {
        type: Number,
        default: 0,
        min: [0, 'Le nombre de participants doit être positif']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Populate automatique des références
planningSchema.pre(/^find/, function (next) {
    this.populate('formationId', 'titre categorie nombreHeures cout')
        .populate({
            path: 'formateurId',
            populate: { path: 'userId', select: 'nom prenom email' }
        })
        .populate('entrepriseId', 'nom ville email telephone');
    next();
});

// Index pour les recherches par date
planningSchema.index({ formateurId: 1, dateDebut: 1, dateFin: 1 });

const Planning = mongoose.model('Planning', planningSchema);

export default Planning;
