const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const config = require('./config');
const sensorRoutes = require('./routes/sensors');
const { getMockTemperatureData } = require('./mockData');
const Sensor = require('./models/Sensor');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Připojení k MongoDB
mongoose.connect(config.dbUri)
  .then(() => console.log('✅ MongoDB připojeno'))
  .catch(err => console.error('❌ MongoDB chyba:', err));

// Endpointy
app.use('/api/data', sensorRoutes); // POST i GET na /api/data

app.get('/', (req, res) => {
  res.send('🌿 Backend iBotaniQ běží.');
});

// Server start
const port = config.port || 5000;
app.listen(port, () => {
  console.log(`🚀 Server běží na http://localhost:${port}`);
});