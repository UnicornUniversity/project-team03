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

// Načtení routes
const sensorRoutes = require('./routes/sensors');

// Nastavení globálních možností pro všechny funkce
setGlobalOptions({
  region: "us-central1",  // Nastavte region globálně
  memory: "256MB",  // Nastavte paměť
  timeoutSeconds: 60,  // Nastavte timeout
  concurrency: 80  // Povinné pro GCF gen 2
});

const app = express();

// Použití CORS middleware
app.use(cors());

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Načtení MongoDB URI z Firebase environmentálních proměnných

const dbUri = process.env.DB_URI || functions.config().mongodb.uri || 'mongodb://localhost:27017/malina';

// Připojení k MongoDB
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
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

exports.api = onRequest(app);
// const port = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });