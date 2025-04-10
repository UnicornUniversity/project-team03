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
const sensorRoutes = require('./routes/sensor');
const thresholdRoutes = require('./routes/thresholds');
const app = express();
const port = config.port;

// Použití CORS middleware
app.use(cors());

// Middleware pro zpracování JSON
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

// Připojení k MongoDB
const dbUri = process.env.MONGODB_URI || 'mongodb+srv://pavlasplichal:novy22projekt@cluster0.dplz2.mongodb.net/malina?retryWrites=true&w=majority';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Použití routes
app.use('/routes/sensors', sensorRoutes);

// Přidání route pro thresholds
app.use('/routes/thresholds', thresholdRoutes); 

app.get('/', (req, res) => {
    res.send('Hello from IoT Backend!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});