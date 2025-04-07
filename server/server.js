const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const sensorRoutes = require('./routes/sensors');

const app = express();
app.use(cors());
app.use(express.json());

// Připojení k MongoDB
mongoose.connect(config.dbUri)
  .then(() => console.log('✅ MongoDB připojeno'))
  .catch(err => console.error('❌ MongoDB chyba:', err));

// API routes
app.use('/api/sensors', sensorRoutes);

app.get('/', (req, res) => {
  res.send('🌿 iBotaniQ backend běží!');
});

app.listen(config.port, () => {
  console.log(`🚀 Server běží na http://localhost:${config.port}`);
});