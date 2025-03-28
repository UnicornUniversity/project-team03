require('dotenv').config();

module.exports = {
    port: process.env.APP_PORT || 5000,
    dbUri: process.env.DB_URI || 'mongodb://localhost:27017/malina'
};