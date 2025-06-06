const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const functions = require('firebase-functions');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Přidání CORS middleware
require('dotenv').config(); 
const { getMockTemperatureData } = require('./mockData');
const Sensor = require('./models/Sensor');
const Threshold = require('./models/Threshold');
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
const thresholdRoutes = require('./routes/thresholds');

const app = express();

// Použití CORS middleware
app.use(cors({
  origin: 'https://ibotaniq.web.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/sensors', sensorRoutes); 
app.use('/api/thresholds', thresholdRoutes);

const dbUri = process.env.MONGODB_URI;
console.log('MongoDB URI:', dbUri);
// Připojení k MongoDB
mongoose.connect(dbUri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello from IoT Backend!');
});

exports.api = onRequest(app);
