const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    soilMoisture: Number,
    lightIntensity: Number,
    timestamp: { type: Date, default: Date.now }
  });  

// používáme model Sensor, ale data ukládáme do kolekce sensorLog
module.exports = mongoose.model('Sensor', sensorSchema, 'sensorLog');