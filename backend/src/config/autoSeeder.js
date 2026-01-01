import User from '../models/User.js';
import Formation from '../models/Formation.js';
import Formateur from '../models/Formateur.js';
import Entreprise from '../models/Entreprise.js';
import Planning from '../models/Planning.js';
import Inscription from '../models/Inscription.js';
import Evaluation from '../models/Evaluation.js';

import CandidatureFormateur from '../models/CandidatureFormateur.js';

export const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('ℹ️ Base de données déjà initialisée, saut du seeding.');
            return;
        }

        console.log('🌱 Initialisation des données par défaut...');

        // 1. Créer l'Admin
        await User.create({
            nom: 'Admin',
            prenom: 'Super',
            email: 'admin@formationsgest.com',
            password: 'admin123',
            role: 'ADMIN'
        });

        // 2. Créer un Formateur
        const formateurUser = await User.create({
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean.dupont@formationsgest.com',
            password: 'formateur123',
            role: 'FORMATEUR'
        });

        const formateur = await Formateur.create({
            userId: formateurUser._id,
            motsCles: ['React', 'Node.js', 'JavaScript'],
            specialites: ['Web Development'],
            experience: 5
        });

        // 3. Créer une entreprise
        const entreprise = await Entreprise.create({
            nom: 'TechCorp Solutions',
            ville: 'Paris',
            email: 'contact@techcorp.fr',
            telephone: '0123456789',
            secteurActivite: 'IT'
        });

        // 4. Créer des formations
        const formations = await Formation.insertMany([
            {
                titre: 'Devenir un Expert React.js',
                categorie: 'Développement Web',
                ville: 'Paris',
                nombreHeures: 35,
                cout: 1500,
                objectifs: 'Maîtriser React et Hooks',
                programme: 'Chapitre 1: Introduction...',
                type: 'INDIVIDU'
            },
            {
                titre: 'Node.js Backend Architecture',
                categorie: 'Backend',
                ville: 'Lyon',
                nombreHeures: 28,
                cout: 1200,
                objectifs: 'Créer des APIs robustes',
                programme: 'Chapitre 1: Architecture...',
                type: 'ENTREPRISE'
            }
        ]);

        // 5. Créer un planning
        const dateDebut = new Date();
        dateDebut.setDate(dateDebut.getDate() + 7);
        const dateFin = new Date(dateDebut);
        dateFin.setDate(dateFin.getDate() + 5);

        await Planning.create({
            formationId: formations[0]._id,
            formateurId: formateur._id,
            entrepriseId: entreprise._id,
            dateDebut,
            dateFin,
            lieu: 'Paris - Centre'
        });

        // 6. Créer des candidatures
        await CandidatureFormateur.create({
            nom: 'Martin',
            prenom: 'Sophie',
            email: 'sophie.martin@expert.com',
            telephone: '0612345678',
            experience: 8,
            motsCles: ['Design Patterns', 'Architecture', 'Java'],
            cv: 'https://res.cloudinary.com/demo/image/upload/v123456789/sample.pdf',
            remarques: 'Profil senior très intéressant.'
        });

        await CandidatureFormateur.create({
            nom: 'Bernard',
            prenom: 'Luc',
            email: 'luc.bernard@dev.fr',
            telephone: '0788990011',
            experience: 3,
            motsCles: ['Vue.js', 'Firebase'],
            cv: 'https://res.cloudinary.com/demo/image/upload/v123456789/sample.pdf',
            remarques: 'Développeur passionné.'
        });

        console.log('✅ Données de démonstration chargées avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors du seeding automatique:', error);
    }
};
