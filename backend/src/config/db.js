import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from './autoSeeder.js';

dotenv.config();

let mongoServer;

const connectDB = async () => {
    try {
        // Tentative de connexion à Atlas
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000 // On n'attend pas indéfiniment (5s)
        });

        console.log(`✅ MongoDB Atlas connecté: ${conn.connection.host}`);
        await seedDatabase();
        return conn;
    } catch (error) {
        console.warn(`⚠️ Échec de connexion Atlas: ${error.message}`);

        // Si Atlas échoue (souvent à cause de la Whitelist IP ou réseau restreint)
        // On bascule sur le serveur en mémoire pour ne pas bloquer le développement
        console.log('🚀 Démarrage du serveur MongoDB local (In-Memory)...');
        try {
            mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();

            const conn = await mongoose.connect(mongoUri);
            console.log(`✅ MongoDB Local (Mémoire) prêt: ${conn.connection.host}`);
            console.log('💡 Note: Les données seront perdues au redémarrage du serveur.');
            await seedDatabase();
            return conn;
        } catch (memError) {
            console.error(`❌ Échec fatal des serveurs MongoDB: ${memError.message}`);
            process.exit(1);
        }
    }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB déconnecté');
});

export default connectDB;
