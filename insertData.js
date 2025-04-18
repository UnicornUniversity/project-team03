const mongoose = require('mongoose');

// Připojovací řetězec MongoDB
const dbUri = 'mongodb+srv://pavlasplichal:novy22projekt@cluster0.dplz2.mongodb.net/malina?retryWrites=true&w=majority';

// Schéma a model
const sensorSchema = new mongoose.Schema({
    greenhouseId: Number,
    temperature: Number,
    humidity: Number,
    soil_moisture: Number,
    light_level: Number,
    timestamp: Date
  });
  
  const Sensor = mongoose.model('Sensor1', sensorSchema);
  
  // Připojení k MongoDB a vložení dat
mongoose.connect(dbUri)
.then(async () => {
  console.log('MongoDB connected');

  // Data, která chcete vložit
  const data = [
    {      
      greenhouseId: 2,
      temperature: 20,
      humidity: 70,
      soil_moisture: 35,
      light_level: 2,
      timestamp: new Date('2025-04-17T10:00:00Z')
    },

  ];

  // Vložení dat do kolekce
  const result = await Sensor.insertMany(data);
  console.log('Data inserted:', result);

  // Odpojení od MongoDB
  mongoose.disconnect();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});