const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  soil_moisture: { type: Number, required: true },
  light_level: { type: Number, required: true },
  timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Sensor', sensorSchema, 'sensor1');
