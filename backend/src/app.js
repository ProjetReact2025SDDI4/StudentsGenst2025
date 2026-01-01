import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import formationRoutes from './routes/formationRoutes.js';
import formateurRoutes from './routes/formateurRoutes.js';
import entrepriseRoutes from './routes/entrepriseRoutes.js';
import planningRoutes from './routes/planningRoutes.js';
import inscriptionRoutes from './routes/inscriptionRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import candidatureRoutes from './routes/candidatureRoutes.js';

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map(origin => origin.trim());

// Middlewares
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier pour les fichiers statiques (CV)
app.use('/uploads', express.static('uploads'));


// Log des requêtes en développement
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/formateurs', formateurRoutes);
app.use('/api/entreprises', entrepriseRoutes);
app.use('/api/plannings', planningRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/candidatures', candidatureRoutes);

// Route de test
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API FormationsGest en ligne !',
        timestamp: new Date().toISOString()
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} non trouvée`
    });
});

// Gestion globale des erreurs
app.use((err, req, res, _next) => {
    console.error('Erreur:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur interne',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Démarrage du serveur
const startServer = async () => {
    try {
        // Connexion à MongoDB
        const conn = await connectDB();
        const isMemory = conn.connection.host === '127.0.0.1';

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 FormationsGest API Server                    ║
║                                                   ║
║   ✅ Serveur démarré sur le port ${PORT}            ║
║   📦 MongoDB : ${isMemory ? 'Mode Mémoire (Local)' : 'Atlas (Cloud)'}  ║
║   🔐 JWT activé                                   ║
║                                                   ║
║   API: http://localhost:${PORT}/api                 ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage:', error);
        process.exit(1);
    }
};

startServer();

export default app;
