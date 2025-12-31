import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        console.log('Tentative de connexion à:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion RÉUSSIE !');
        process.exit(0);
    } catch (err) {
        console.error('❌ ÉCHEC de connexion:', err.message);
        process.exit(1);
    }
};

test();
