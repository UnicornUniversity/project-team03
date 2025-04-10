const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sensor = require('../models/Sensor'); 
const { getMockTemperatureData } = require('../mockData'); 

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

// GET endpoint pro získání posledních 10 záznamů
router.get('/', async (req, res) => {
  const greenhouseId = parseInt(req.query.greenhouseId) || 1; // Výchozí skleník 1
  try {
    // Pokud je vybrán skleník 2, vrátí simulovaná data
    if (greenhouseId === 2) {
      console.log("Simulovaná data pro skleník 2:", simulatedData);
      return res.json(simulatedData);
    }

    // Pokud MongoDB není připojena, vrátí mockovaná data
    if (Sensor.db.readyState !== 1) { // 1 znamená připojeno k MongoDB
      console.warn("⚠️ Použití mockovaných dat, protože MongoDB není dostupná.");
      return res.json(getMockTemperatureData());
    }

    // Dotaz na MongoDB pro vybraný skleník
    const data = await Sensor.find({ greenhouseId })
    .sort({ timestamp: -1 })
    .limit(10);
    console.log('Data fetched from MongoDB:', data); // Přidání logování
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err); // Přidání logování chyby
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint pro ukládání dat z maliny (skleník 1)
router.post('/', async (req, res) => {
  const { error, value } = sensorSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const newSensor = new Sensor(value);
    const savedSensor = await newSensor.save();
    console.log('New sensor data saved:', savedSensor); // Přidání logování
    res.status(201).json(savedSensor);
  } catch (err) {
    console.error('Error saving new sensor data:', err); // Přidání logování chyby
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;