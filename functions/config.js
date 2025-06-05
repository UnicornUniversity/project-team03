require('dotenv').config(); // Načtení .env souboru pro lokální vývoj
const functions = require('firebase-functions'); // Pro přístup k Firebase environmentálním proměnným



module.exports = {
    port: process.env.APP_PORT || 8080, // Port pro lokální vývoj
    dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/malina', // Připojovací řetězec MongoDB
    svcAcc: process.env.SERVICE_ACC || null,
    apiKey: process.env.API_KEY || null,
};