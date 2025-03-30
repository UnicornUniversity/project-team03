const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soil_moisture: Number,   // nepovinné, není v každém záznamu
  light_level: Number,
  timestamp: String        // v MongoDB jsou jako stringy
});

module.exports = mongoose.model('Sensor', sensorSchema, 'sensorLog');
