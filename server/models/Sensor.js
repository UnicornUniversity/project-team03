//Mongoose model pro data ze senzorů (nahrazuje sensorSchema.js), obsahuje více senzorových údajů

const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: false },
    soilMoisture: { type: Number, required: false },
    lightIntensity: { type: Number, required: false },
    accelerometer: {
        x: { type: Number, required: false },
        y: { type: Number, required: false },
        z: { type: Number, required: false }
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sensor', sensorSchema);