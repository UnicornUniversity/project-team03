const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Sensor = require('../models/Sensor'); 
const Threshold = require('../models/Threshold'); // Načtení modelu Threshold
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

// Endpoint pro získání posledního záznamu
router.get('/latest', async (req, res) => {
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

    // Dotaz na MongoDB pro aktuální data
    const latestData = await Sensor.findOne({ greenhouseId })
    .sort({ timestamp: -1 });

  if (!latestData) {
    return res.status(404).json({ error: 'No data found for the given greenhouseId' });
  }

  console.log('Latest data fetched from MongoDB:', latestData);
  res.json(latestData);
} catch (err) {
  console.error('Error fetching latest data:', err);
  res.status(500).json({ error: err.message });
}
});

// Endpoint pro získání historických dat
router.get('/', async (req, res) => {
  const greenhouseId = parseInt(req.query.greenhouseId) || 1; // Výchozí skleník 1
  const from = new Date(req.query.from); // Počáteční datum
  const to = new Date(req.query.to); // Koncové datum
  const limit = parseInt(req.query.limit) || 10; // Výchozí limit 10
  const page = parseInt(req.query.page) || 1; // Výchozí stránka 1
  const skip = (page - 1) * limit; // Počet záznamů, které přeskočíme

  try {
    // Validace časového rozsahu
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ error: 'Invalid date range' });
    }

    // Dotaz na MongoDB s filtrováním a stránkováním
    const data = await Sensor.find({
      greenhouseId,
      timestamp: { $gte: from, $lte: to } // Filtrování podle časového rozsahu
    })
      .sort({ timestamp: -1 }) // Seřazení podle timestamp sestupně
      .skip(skip) // Přeskočení záznamů pro stránkování
      .limit(limit); // Omezení počtu záznamů na stránku

    console.log(`Fetched data for greenhouse ${greenhouseId} from ${from} to ${to}, page ${page}, limit ${limit}:`, data);
    res.json(data);
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).json({ error: err.message });
  }
});


// Endpoint pro získání limitů pro konkrétní skleník
router.get('/thresholds/:greenhouseId', async (req, res) => {
  const greenhouseId = parseInt(req.params.greenhouseId); // Získání ID skleníku z parametru

  try {
    // Vyhledání limitů v kolekci thresholds
    const thresholds = await Threshold.findOne({ greenhouseId });
    if (!thresholds) {
      return res.status(404).json({ error: 'Thresholds not found for the given greenhouseId' });
    }
    res.json(thresholds); // Vrácení nalezených dat
  } catch (err) {
    console.error('Error fetching thresholds:', err); // Logování chyby
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint pro uložení nebo aktualizaci limitů pro konkrétní skleník
router.post('/thresholds/:greenhouseId', async (req, res) => {
  const greenhouseId = parseInt(req.params.greenhouseId); // Získání ID skleníku z parametru
  const { temperature, soilMoisture, airHumidity, light } = req.body; // Data z požadavku

  try {
    // Validace vstupních dat
    if (!temperature || !soilMoisture || !airHumidity || !light) {
      return res.status(400).json({ error: 'Všechna pole jsou povinná.' });
    }

    // Najít a aktualizovat dokument, nebo vytvořit nový, pokud neexistuje
    const updatedThreshold = await Threshold.findOneAndUpdate(
      { greenhouseId }, // Podmínka pro vyhledání
      { temperature, soilMoisture, airHumidity, light }, // Data k aktualizaci
      { new: true, upsert: true } // Vytvořit nový dokument, pokud neexistuje
    );

    console.log(`Thresholds updated for greenhouse ${greenhouseId}:`, updatedThreshold);
    res.json(updatedThreshold); // Vrátit aktualizovaný dokument
  } catch (err) {
    console.error('Error saving thresholds:', err);
    res.status(500).json({ error: 'Chyba při ukládání limitů.' });
  }
});



module.exports = router;