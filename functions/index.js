const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Přidání CORS middleware
require('dotenv').config();
const { getMockTemperatureData } = require('./mockData');
const Sensor = require('./models/Sensor');
mongoose.set('debug', true);
const config = require('./config');

// Nastavení globálních možností pro Firebase Functions v2
setGlobalOptions({
  region: 'us-central1', 
  memory: '256MB', 
  timeoutSeconds: 60, 
  cpu: 1, 
  concurrency: 80 
});

// Načtení routes
const sensorRoutes = require('./routes/sensors');

const app = express();

// Použití CORS middleware
app.use(cors());

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Připojení k MongoDB
mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Použití routes
app.use('/', sensorRoutes);

app.get('/', (req, res) => {
  res.send('Hello from IoT Backend!');
});

// Export Express aplikace jako Firebase Function (GCF gen 2)
exports.api = onRequest(app);