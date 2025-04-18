const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema({
  greenhouseId: { type: Number, required: true, unique: true }, // ID skleníku (např. 1 = Skleník 1, 2 = Skleník 2)
  temperature: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  soilMoisture: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  airHumidity: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  light: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Threshold', thresholdSchema, 'thresholds');