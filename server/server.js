express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');  // Přidání CORS middleware
require('dotenv').config();
const { getMockTemperatureData } = require('./mockData');
const Sensor = require('./models/Sensor')
mongoose.set('debug', true);

//Načtení routes
const sensorRoutes = require('./routes/sensors');

const app = express();
const port = config.port;

// Použití CORS middleware
app.use(cors());

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

// Připojení k MongoDB
const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/iot';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB připojeno');
  })
  .catch(err => {
    console.error('❌ MongoDB chyba:', err);
  });

// Použití routes
// Teplotní data už nejsou oddělená, ale jsou součástí obecného Sensor modelu.
// API endpoint /api/temperature se změnil na /api/sensors, protože řeší více senzorů než jen teplotu.
app.use('/api/sensors', sensorRoutes);

app.get('/', (req, res) => {
    res.send('🌿 iBotaniQ backend běží!');
});

app.listen(port, () => {
    console.log(`🚀 Server běží na http://localhost:${port}`);
});