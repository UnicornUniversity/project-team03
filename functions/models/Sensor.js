const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  timestamp:    { type: Date,   default: Date.now },
  greenhouseId: { type: Number, required: true },
  sensor:       { type: Number, required: true },   
  temperature_air: { type: Number, required: true },
  humidity_air:    { type: Number, required: true },
  light:           { type: Number, required: true },
  soil_moisture:   { type: Number, required: true }
}, {
  collection: 'sensor1' 
});

module.exports = mongoose.model('Sensor1', sensorSchema);
