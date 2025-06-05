const express = require('express');
const router = express.Router();
const Threshold = require('../models/Threshold');
const { verifyFirebaseToken } = require('../middleware/verifyFirebaseToken');

// Endpoint pro získání limitů pro konkrétní skleník
router.get('/:greenhouseId', async (req, res) => {
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
router.post('/:greenhouseId', async (req, res) => {
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

module.exports = router;
