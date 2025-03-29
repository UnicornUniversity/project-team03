//Route pro API (GET s validací)

const express = require('express');
const Sensor = require('../models/Sensor');
const { getMockTemperatureData } = require('../mockData');
const Joi = require('joi');
const router = express.Router();

// Joi validace pro query parametry 
const querySchema = Joi.object({
  from: Joi.date().optional(),
  to: Joi.date().optional()
});

// Joi validace dat (default hodnoty, když něco chybí)
const sensorSchema = Joi.object({
  temperature: Joi.number().default(0),
  humidity: Joi.number().default(0),
  soilMoisture: Joi.number().default(0),
  lightIntensity: Joi.number().default(0),
  timestamp: Joi.date().default(() => new Date(), 'aktuální čas')
});

router.get('/', async (req, res) => {
  // Validace query parametrů
  const { error, value } = querySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Připrav filtrační podmínky (např. z rozsahu dat)
  const filter = {};
  if (value.from || value.to) {
    filter.timestamp = {};
    if (value.from) filter.timestamp.$gte = new Date(value.from);
    if (value.to) filter.timestamp.$lte = new Date(value.to);
  }

  try {
    if (Sensor.db.readyState !== 1) {
      console.warn("⚠️ Použití mockovaných dat, protože MongoDB není dostupná.");
      return res.json(getMockTemperatureData());
    }

    const data = await Sensor.find(filter).sort({ timestamp: -1 }).limit(10);

    // Volitelně: validace výsledných dat přes Joi (každý záznam)
    const validated = data.map(item => {
      const { error, value } = sensorSchema.validate(item.toObject());
      if (error) console.warn("⚠️ Chyba ve validaci uložených dat:", error.message);
      return value;
    });

    res.json(validated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;