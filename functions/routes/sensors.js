const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sensor = require('../models/Sensor'); 
const { getMockTemperatureData } = require('../mockData'); 
const Threshold = require('../models/Threshold'); // Načtení modelu Threshold
const authApiKey = require('../middleware/authApiKey');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

// Validace dat pro POST
const sensorSchema = Joi.object({
  greenhouseId: Joi.number().valid(1, 2).required(),
  temperature: Joi.number().required(),
  humidity: Joi.number().required(),
  soil_moisture: Joi.number().required(),
  light_level: Joi.number().required(),
  timestamp: Joi.date().iso().required()
});

// Simulovaná data pro skleník 2
const simulatedData = [
  {
    greenhouseId: 2,
    temperature: 18.5,
    humidity: 60,
    soil_moisture: 40,
    light_level: 25,
    timestamp: new Date()
  }
];

router.get('/latest', verifyFirebaseToken, async (req, res) => {
  const greenhouseId = parseInt(req.query.greenhouseId) || 1; // Výchozí skleník 1
  try {
    // Pokud je vybrán skleník 2, vrátí simulovaná data
    if (greenhouseId === 2) {
      console.log("Simulovaná data pro skleník 2:", simulatedData);
      return res.json(simulatedData);
    }

    // Dotaz na MongoDB pro vybraný skleník
    const latestData = await Sensor.find({ greenhouseId })
      .sort({ timestamp: -1 })
      .limit(1);
    console.log('Data fetched from MongoDB:', latestData); // Přidání logování
    res.json(latestData); // Použití správné proměnné
  } catch (err) {
    console.error('Error fetching data:', err); // Přidání logování chyby
    res.status(500).json({ error: err.message });
  }
});

router.get('/', verifyFirebaseToken, async (req, res) => {
  const greenhouseId = parseInt(req.query.greenhouseId) || 1;
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;

  try {
    if (!from || !to || isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    const data = await Sensor.find({
      greenhouseId,
      timestamp: { $gte: from, $lte: to }
    }).sort({ timestamp: -1 });

    res.json(data);
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pro získání limitů pro konkrétní skleník
router.get('/thresholds/:greenhouseId', async (req, res) => {
  const greenhouseId = parseInt(req.params.greenhouseId);

  try {
    const threshold = await Threshold.findOne({ greenhouseId });
    if (!threshold) {
      return res.status(404).json({ error: 'Limity pro tento skleník nebyly nalezeny.' });
    }
    res.json(threshold);
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    res.status(500).json({ error: 'Chyba při načítání limitů.' });
  }
});

// Endpoint pro uložení nebo aktualizaci limitů pro konkrétní skleník
router.post('/thresholds/:greenhouseId', async (req, res) => {
  const greenhouseId = parseInt(req.params.greenhouseId);
  const { temperature, soilMoisture, airHumidity, light } = req.body;

  try {
    // Validace vstupních dat
    if (!temperature || !soilMoisture || !airHumidity || !light) {
      return res.status(400).json({ error: 'Všechna pole jsou povinná.' });
    }

    // Kontrola, že každé pole má min a max hodnotu
    const validateMinMax = (field, name) => {
      if (!field.min || !field.max) {
        throw new Error(`${name} musí mít definované minimální a maximální hodnoty`);
      }
    };

    validateMinMax(temperature, 'Teplota');
    validateMinMax(soilMoisture, 'Vlhkost půdy');
    validateMinMax(airHumidity, 'Vlhkost vzduchu');
    validateMinMax(light, 'Světlo');

    // Uložení nebo aktualizace limitů
    const threshold = await Threshold.findOneAndUpdate(
      { greenhouseId },
      {
        greenhouseId,
        temperature,
        soilMoisture,
        airHumidity,
        light
      },
      { upsert: true, new: true }
    );

    res.json(threshold);
  } catch (error) {
    console.error('Error saving thresholds:', error);
    res.status(500).json({ error: 'Chyba při ukládání limitů.' });
  }
});

//Endpoint pro nahrani dat do monga
router.post('/mongo-upload', authApiKey, async (req, res) => {
  console.log('▶️ req.body =', JSON.stringify(req.body, null, 2));
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch (err) {
      console.warn('Could not JSON.parse req.body:', err.message);
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }
  try {
    const {
      greenhouseId,
      sensor,
      temperature,
      humidity,
      soil_moisture,
      light_level,
      timestamp
    } = req.body;

    const missing = [];
    if (greenhouseId   == null) missing.push('greenhouseId');
    if (sensor         == null) missing.push('sensor');
    if (temperature    == null) missing.push('temperature');
    if (humidity       == null) missing.push('humidity');
    if (soil_moisture  == null) missing.push('soil_moisture');
    if (light_level    == null) missing.push('light_level');

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required field(s): ${missing.join(', ')}`,
        received: { greenhouseId, sensor, temperature, humidity, soil_moisture, light_level, timestamp }
      });
    }

    const reading = new Sensor({
      timestamp: timestamp ? new Date(timestamp) : undefined,
      greenhouseId,
      sensor,
      temperature,
      humidity,
      light_level,
      soil_moisture
    });

    const saved = await reading.save();
    //console.log('▶️ saved to mongo =', saved);
    res.status(201);
  } catch (err) {
    console.error('Error saving sensor:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
