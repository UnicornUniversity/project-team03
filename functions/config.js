require('dotenv').config(); // Načtení .env souboru pro lokální vývoj
const functions = require('firebase-functions'); // Pro přístup k Firebase environmentálním proměnným

// Bezpečné načtení Firebase environmentálních proměnných
const firebaseConfig = functions.config().mongodb ? functions.config().mongodb.uri : null;

module.exports = {
    port: process.env.APP_PORT || 5000, // Port pro lokální vývoj
    dbUri: process.env.DB_URI || firebaseConfig || 'mongodb://localhost:27017/malina', // Připojovací řetězec MongoDB
};