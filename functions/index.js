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

app.use('/', sensorRoutes); 
app.use('/thresholds', thresholdRoutes);



// Použití CORS middleware
app.use(cors());

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
