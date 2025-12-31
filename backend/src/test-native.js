import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        console.log('Tentative de connexion (MongoDB Driver) à:', uri.replace(/:([^:@]+)@/, ':****@'));
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Ping réussi ! Vous êtes connecté à MongoDB.");
    } catch (err) {
        console.error('❌ Échec (MongoDB Driver):', err.message);
    } finally {
        await client.close();
    }
}
run();
