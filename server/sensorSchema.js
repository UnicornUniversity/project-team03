const sensorSchema = new mongoose.Schema({// ukládání dat ze senzorů
    temperature: Number,
    timestamp: { type: Date, default: Date.now }
  });
  
  const Sensor = mongoose.model('Sensor', sensorSchema);
