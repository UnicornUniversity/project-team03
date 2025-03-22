//API endpointy pro senzory

const express = require('express');
const Sensor = require('../models/Sensor');
const router = express.Router();
const { getMockTemperatureData } = require('../mockData');
const Joi = require('joi'); // Přidání Joi

// Schéma validace
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
        res.json(data);
    } catch (err) {
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
    res.status(201).json(savedSensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;