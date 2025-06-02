const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  timestamp:    { type: Date,   default: Date.now },
  greenhouseId: { type: Number, required: true },
  sensor:       { type: Number, required: true },   
  temperature: { type: Number, required: true },
  humidity:    { type: Number, required: true },
  light_level:           { type: Number, required: true },
  soil_moisture:   { type: Number, required: true }
}, {
  collection: 'sensor1' 
});

module.exports = mongoose.model('Sensor1', sensorSchema);
