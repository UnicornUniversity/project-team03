const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sensor = require('../models/Sensor'); // Ujistěte se, že cesta k modelu je správná
const { getMockTemperatureData } = require('../mockData'); // Ujistěte se, že cesta k mock datům je správná

const sensorSchema = Joi.object({
  temperature: Joi.number().required(),
  humidity: Joi.number().optional(),
  soilMoisture: Joi.number().optional(),
  lightIntensity: Joi.number().optional(),
  accelerometer: Joi.object({
    x: Joi.number().optional(),
    y: Joi.number().optional(),
    z: Joi.number().optional()
  }).optional(),
  timestamp: Joi.date().optional()
});

// Získání posledních měření
router.get('/', async (req, res) => {
  try {
    if (Sensor.db.readyState !== 1) { // 1 znamená připojeno k MongoDB
      console.warn("⚠️ Použití mockovaných dat, protože MongoDB není dostupná.");
      return res.json(getMockTemperatureData());
    }
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
    console.log('Data fetched from MongoDB:', data); // Přidání logování
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err); // Přidání logování chyby
    res.status(500).json({ error: err.message });
  }
});

// Přidání nového senzoru
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