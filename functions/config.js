require('dotenv').config(); // Načtení .env souboru pro lokální vývoj

// Konfigurace pro aplikaci
const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://pavlasplichal:novy22projekt@cluster0.dplz2.mongodb.net/malina?retryWrites=true&w=majority'
  }
};

module.exports = config;