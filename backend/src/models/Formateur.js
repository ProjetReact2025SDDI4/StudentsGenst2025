import mongoose from 'mongoose';

const formateurSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur associé est requis'],
        unique: true
    },
    motsCles: [{
        type: String,
        trim: true
    }],
    remarques: {
        type: String,
        trim: true,
        maxlength: [1000, 'Les remarques ne peuvent pas dépasser 1000 caractères']
    },
    specialites: [{
        type: String,
        trim: true
    }],
    experience: {
        type: Number,
        default: 0,
        min: [0, 'L\'expérience doit être positive']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    cv: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Populate automatique de l'utilisateur
formateurSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
        select: 'nom prenom email'
    });
    next();
});

// Virtuel pour les plannings du formateur
formateurSchema.virtual('plannings', {
    ref: 'Planning',
    localField: '_id',
    foreignField: 'formateurId'
});

// Virtuel pour les évaluations du formateur
formateurSchema.virtual('evaluations', {
    ref: 'Evaluation',
    localField: '_id',
    foreignField: 'formateurId'
});

const Formateur = mongoose.model('Formateur', formateurSchema);

export default Formateur;
