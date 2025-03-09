const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
require('dotenv').config();
const { getMockTemperatureData } = require('./mockData');

mongoose.set('debug', true);

const app = express();
const port = config.port;

// Middleware pro zpracování JSON
app.use(express.json());

// Připojení k MongoDB
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/iot';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Definice schématu a modelu
const temperatureSchema = new mongoose.Schema({
  timestamp: String,
  temperature: Number
});
const Temperature = mongoose.model('Temperature', temperatureSchema);

// Základní route pro testování
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Endpoint pro získání dat teploty
app.get('/api/temperature', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    // Pokud není připojení k MongoDB, použijí se mockovaná data
    const data = getMockTemperatureData();
    res.json(data);
  } else {
    try {
      const data = await Temperature.find({});
      res.json(data);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});