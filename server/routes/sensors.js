const express = require('express');
const Sensor = require('../models/Sensor');
const Joi = require('joi');
const router = express.Router();

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
  const greenhouseId = parseInt(req.query.greenhouseId) || 1;

  try {
    if (greenhouseId === 2) {
      return res.json(simulatedData);
    }

    const data = await Sensor.find({ greenhouseId })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(data);
  } catch (err) {
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
    await newSensor.save();
    res.status(201).json({ message: 'Data uložena.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;