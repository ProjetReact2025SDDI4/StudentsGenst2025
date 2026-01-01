import dotenv from 'dotenv';
import User from './models/User.js';
import Formation from './models/Formation.js';
import Formateur from './models/Formateur.js';
import Entreprise from './models/Entreprise.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Suppression des données existantes...');
        await User.deleteMany({});
        await Formation.deleteMany({});
        await Formateur.deleteMany({});
        await Entreprise.deleteMany({});

        console.log('👤 Création des utilisateurs...');

        // Créer l'admin
        await User.create({
            nom: 'Admin',
            prenom: 'Super',
            email: 'admin@formationsgest.com',
            password: 'admin123',
            role: 'ADMIN'
        });

        // Créer un assistant
        await User.create({
            nom: 'Martin',
            prenom: 'Sophie',
            email: 'assistant@formationsgest.com',
            password: 'assistant123',
            role: 'ASSISTANT'
        });

        // Créer des formateurs
        const formateurUser1 = await User.create({
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean.dupont@formationsgest.com',
            password: 'formateur123',
            role: 'FORMATEUR'
        });

        const formateurUser2 = await User.create({
            nom: 'Bernard',
            prenom: 'Marie',
            email: 'marie.bernard@formationsgest.com',
            password: 'formateur123',
            role: 'FORMATEUR'
        });

        console.log(' Création des profils formateurs...');

        await Formateur.create({
            userId: formateurUser1._id,
            motsCles: ['JavaScript', 'React', 'Node.js', 'Web'],
            specialites: ['Développement Frontend', 'Développement Backend'],
            remarques: 'Expert React avec 10 ans d\'expérience',
            experience: 10
        });

        await Formateur.create({
            userId: formateurUser2._id,
            motsCles: ['Python', 'Data Science', 'Machine Learning', 'IA'],
            specialites: ['Intelligence Artificielle', 'Analyse de données'],
            remarques: 'Docteur en IA, ancienne Google',
            experience: 8
        });

        console.log(' Création des formations...');

        const formations = await Formation.insertMany([
            {
                titre: 'Formation React.js Avancée',
                categorie: 'Développement Web',
                ville: 'Paris',
                nombreHeures: 35,
                cout: 2500,
                objectifs: 'Maîtriser React.js et son écosystème. Développer des applications web modernes et performantes.',
                programme: '1. React Hooks avancés\n2. State Management avec Redux/Zustand\n3. React Query\n4. Tests unitaires\n5. Performance et optimisation',
                type: 'INDIVIDU'
            },
            {
                titre: 'Node.js et Express pour le Backend',
                categorie: 'Développement Web',
                ville: 'Lyon',
                nombreHeures: 28,
                cout: 2000,
                objectifs: 'Créer des APIs RESTful robustes avec Node.js et Express.',
                programme: '1. Fondamentaux Node.js\n2. Express.js\n3. MongoDB et Mongoose\n4. Authentification JWT\n5. Déploiement',
                type: 'INDIVIDU'
            },
            {
                titre: 'Python pour la Data Science',
                categorie: 'Data Science',
                ville: 'Paris',
                nombreHeures: 40,
                cout: 3000,
                objectifs: 'Analyser des données et créer des modèles prédictifs avec Python.',
                programme: '1. Python avancé\n2. NumPy et Pandas\n3. Visualisation avec Matplotlib\n4. Machine Learning avec Scikit-learn\n5. Projet pratique',
                type: 'ENTREPRISE'
            },
            {
                titre: 'Formation Management d\'équipe',
                categorie: 'Management',
                ville: 'Bordeaux',
                nombreHeures: 14,
                cout: 1200,
                objectifs: 'Développer ses compétences en leadership et gestion d\'équipe.',
                programme: '1. Communication\n2. Motivation d\'équipe\n3. Gestion des conflits\n4. Coaching\n5. Délégation efficace',
                type: 'ENTREPRISE'
            },
            {
                titre: 'Introduction à l\'Intelligence Artificielle',
                categorie: 'Intelligence Artificielle',
                ville: 'Marseille',
                nombreHeures: 21,
                cout: 1800,
                objectifs: 'Comprendre les fondamentaux de l\'IA et ses applications.',
                programme: '1. Histoire et concepts\n2. Machine Learning\n3. Deep Learning\n4. NLP\n5. Vision par ordinateur',
                type: 'INDIVIDU'
            }
        ]);

        console.log('🏢 Création des entreprises...');

        await Entreprise.insertMany([
            {
                nom: 'TechCorp Solutions',
                adresse: '123 Avenue de la Tech',
                ville: 'Paris',
                codePostal: '75001',
                telephone: '01 23 45 67 89',
                email: 'contact@techcorp.fr',
                url: 'https://www.techcorp.fr',
                secteurActivite: 'Informatique',
                contactPrincipal: {
                    nom: 'Leroy',
                    prenom: 'Thomas',
                    fonction: 'DRH',
                    telephone: '01 23 45 67 90',
                    email: 'thomas.leroy@techcorp.fr'
                }
            },
            {
                nom: 'DataVision',
                adresse: '45 Rue de l\'Innovation',
                ville: 'Lyon',
                codePostal: '69002',
                telephone: '04 56 78 90 12',
                email: 'info@datavision.fr',
                url: 'https://www.datavision.fr',
                secteurActivite: 'Data & Analytics',
                contactPrincipal: {
                    nom: 'Moreau',
                    prenom: 'Claire',
                    fonction: 'Responsable Formation',
                    telephone: '04 56 78 90 13',
                    email: 'claire.moreau@datavision.fr'
                }
            },
            {
                nom: 'StartupFactory',
                adresse: '8 Boulevard de l\'Entrepreneuriat',
                ville: 'Bordeaux',
                codePostal: '33000',
                telephone: '05 67 89 01 23',
                email: 'hello@startupfactory.fr',
                url: 'https://www.startupfactory.fr',
                secteurActivite: 'Incubateur',
                contactPrincipal: {
                    nom: 'Garcia',
                    prenom: 'Lucas',
                    fonction: 'CEO',
                    telephone: '05 67 89 01 24',
                    email: 'lucas.garcia@startupfactory.fr'
                }
            }
        ]);

        console.log(`
╔═══════════════════════════════════════════════════╗
║   ✅ Base de données initialisée avec succès !   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║   Utilisateurs créés :                            ║
║   • Admin: admin@formationsgest.com / admin123   ║
║   • Assistant: assistant@formationsgest.com      ║
║   • Formateur: jean.dupont@formationsgest.com    ║
║                                                   ║
║   ${formations.length} formations créées                        ║
║   3 entreprises créées                            ║
║   2 formateurs créés                              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        process.exit(1);
    }
};

seedData();
