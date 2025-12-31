import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
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
    participantEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    notePedagogie: {
        type: Number,
        required: [true, 'La note de pédagogie est requise'],
        min: [1, 'La note minimum est 1'],
        max: [5, 'La note maximum est 5']
    },
    rythme: {
        type: Number,
        required: [true, 'La note de rythme est requise'],
        min: [1, 'La note minimum est 1'],
        max: [5, 'La note maximum est 5']
    },
    support: {
        type: Number,
        required: [true, 'La note de support est requise'],
        min: [1, 'La note minimum est 1'],
        max: [5, 'La note maximum est 5']
    },
    maitriseSujet: {
        type: Number,
        required: [true, 'La note de maîtrise du sujet est requise'],
        min: [1, 'La note minimum est 1'],
        max: [5, 'La note maximum est 5']
    },
    commentaire: {
        type: String,
        trim: true,
        maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    anonymous: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuel pour la moyenne
evaluationSchema.virtual('moyenne').get(function () {
    return ((this.notePedagogie + this.rythme + this.support + this.maitriseSujet) / 4).toFixed(2);
});

// Populate automatique
evaluationSchema.pre(/^find/, function (next) {
    this.populate('formationId', 'titre categorie')
        .populate({
            path: 'formateurId',
            populate: { path: 'userId', select: 'nom prenom' }
        });
    next();
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
