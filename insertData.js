const mongoose = require('mongoose');



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
      greenhouseId: 1,
      temperature: 20,
      humidity: 35,
      soil_moisture: 35,
      light_level: 30,
      timestamp: new Date('2025-06-08T07:00:00Z')
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
