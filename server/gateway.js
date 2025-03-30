const mongoose = require('mongoose');
const config = require('./config');
const Sensor = require('./models/Sensor');

mongoose.connect(config.dbUri)
  .then(() => console.log('✅ Připojeno k MongoDB Atlas'))
  .catch(err => console.error('❌ Chyba při připojení k MongoDB:', err));

const INTERVAL_MINUTES = 5;
const STORAGE_DURATION_HOURS = 24;

// Funkce pro získání posledního záznamu z 'sensor1'
async function fetchSensorData() {
  const count = await Sensor.countDocuments();
  console.log('📦 Počet dokumentů v sensor1:', count);
  const documents = await Sensor.find();
  console.log(documents);

  const last = await Sensor.findOne().sort({ _id: -1 });
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

// Funkce pro uložení záznamu do 'sensorLog'
async function storeData() {
  const data = await fetchSensorData();
  const entry = new Sensor(data);
  await entry.save();
  console.log(`💾 Uloženo do sensorLog: ${data.timestamp.toISOString()}`);
}

// Čištění starých záznamů
async function cleanupData() {
  const cutoff = new Date(Date.now() - STORAGE_DURATION_HOURS * 60 * 60 * 1000);
  const oldRecords = await Sensor.find({ timestamp: { $lt: cutoff } }).sort({ timestamp: 1 });

  if (oldRecords.length <= 2) return;

  const toDelete = oldRecords.slice(1, -1);
  const ids = toDelete.map(doc => doc._id);
  await Sensor.deleteMany({ _id: { $in: ids } });
  console.log(`🧹 Vymazáno ${ids.length} záznamů ze sensorLog`);
}

// Hlavní cyklus
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