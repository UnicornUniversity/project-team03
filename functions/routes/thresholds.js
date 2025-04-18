const express = require('express');
const router = express.Router();
const Threshold = require('../models/Threshold');

// Endpoint pro získání limitů pro konkrétní skleník
router.get('/:greenhouseId', async (req, res) => {
  const greenhouseId = parseInt(req.params.greenhouseId);

  try {
    const thresholds = await Threshold.findOne({ greenhouseId });
    if (!thresholds) {
      return res.status(404).json({ error: 'Thresholds not found for the given greenhouseId' });
    }
    res.json(thresholds);
  } catch (err) {
    console.error('Error fetching thresholds:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint pro uložení nebo aktualizaci limitů pro konkrétní skleník
router.post('/:greenhouseId', async (req, res) => {
  const greenhouseId = parseInt(req.params.greenhouseId);
  const { temperature, soilMoisture, airHumidity, light } = req.body;

  try {
    if (!temperature || !soilMoisture || !airHumidity || !light) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const updatedThreshold = await Threshold.findOneAndUpdate(
      { greenhouseId },
      { temperature, soilMoisture, airHumidity, light },
      { new: true, upsert: true }
    );

    res.json(updatedThreshold);
  } catch (err) {
    console.error('Error saving thresholds:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
