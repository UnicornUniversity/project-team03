const mongoose = require('mongoose');
const config = require('./config');
const Sensor = require('./models/Sensor'); // zapisuje do sensorLog

// Připojení k MongoDB Atlas
mongoose.connect(config.dbUri)
  .then(() => console.log('✅ Připojeno k MongoDB Atlas'))
  .catch(err => console.error('❌ Chyba při připojení k MongoDB:', err));

// Model pro čtení z kolekce 'sensor1'
const sensor1Schema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  soil_moisture: Number,
  light_level: Number,
  timestamp: String
});
const Sensor1 = mongoose.model('Sensor1', sensor1Schema, 'sensor1');

const INTERVAL_MINUTES = 5;
const STORAGE_DURATION_HOURS = 24;

// Získání posledního záznamu ze sensor1
async function fetchSensorData() {
  const count = await Sensor1.countDocuments(); 
  console.log('📦 Počet dokumentů v sensor1:', count);

  const last = await Sensor1.findOne().sort({ _id: -1 });
  console.log('📄 Poslední dokument:', last);

  if (!last) throw new Error('⚠️ Žádná data v kolekci sensor1');

  const data = last.toObject();

  return {
    temperature: data.temperature ?? 0,
    humidity: data.humidity ?? 0,
    soilMoisture: data.soil_moisture ?? 0,
    lightIntensity: data.light_level ?? 0,
    timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
  };
}

// Uložení dat do sensorLog
async function storeData() {
  const data = await fetchSensorData();
  const entry = new Sensor(data);
  await entry.save();
  console.log(`💾 Uloženo do sensorLog: ${data.timestamp.toISOString()}`);
}

// Smazání starých záznamů v sensorLog
async function cleanupData() {
  const cutoff = new Date(Date.now() - STORAGE_DURATION_HOURS * 60 * 60 * 1000);
  const oldRecords = await Sensor.find({ timestamp: { $lt: cutoff } }).sort({ timestamp: 1 });

  if (oldRecords.length <= 2) return;

  const toDelete = oldRecords.slice(1, -1);
  const ids = toDelete.map(doc => doc._id);
  await Sensor.deleteMany({ _id: { $in: ids } });
  console.log(`🧹 Vymazáno ${ids.length} záznamů ze sensorLog`);
}

// Spuštění hlavního cyklu
async function runGatewayCycle() {
  try {
    await storeData();
    await cleanupData();
  } catch (err) {
    console.error('❌ Chyba v gateway:', err.message);
  }
}

runGatewayCycle();
setInterval(runGatewayCycle, INTERVAL_MINUTES * 60 * 1000);