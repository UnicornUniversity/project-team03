const express = require('express');
const Sensor = require('../models/Sensor');
const { getMockTemperatureData } = require('../mockData');
const Joi = require('joi');
const router = express.Router();

// JOI validace pro příchozí data
const sensorSchema = Joi.object({
  temperature: Joi.number().required(),
  humidity: Joi.number().required(),
  soilMoisture: Joi.number().required(),
  lightIntensity: Joi.number().required(),
  timestamp: Joi.date().iso().required()
});

// POST - přijímání dat ze senzoru (např. Raspberry Pi přes Node-RED)
router.post('/', async (req, res) => {
  const { error, value } = sensorSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const sensorData = new Sensor(value);
    await sensorData.save();
    res.status(201).json({ message: 'Data byla úspěšně uložena.' });
  } catch (err) {
    res.status(500).json({ error: 'Chyba při ukládání do databáze.' });
  }
});

// GET - získání posledních X měření (defaultně 10)
router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Chyba při načítání dat z databáze.' });
  }
});

module.exports = router;