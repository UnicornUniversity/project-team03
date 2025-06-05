const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { getMockTemperatureData } = require('./mockData');
const Sensor = require('./models/Sensor');
const Threshold = require('./models/Threshold');
mongoose.set('debug', true);
const config = require('./config');

const app = express();

// Povolení CORS pro všechny origins v development prostředí
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Import routes
const sensorsRouter = require('./routes/sensors');
const thresholdRoutes = require('./routes/thresholds');

// Use routes
app.use('/api/sensors', sensorsRouter);
app.use('/api/thresholds', thresholdRoutes);

const dbUri = process.env.MONGODB_URI || 'mongodb+srv://pavlasplichal:novy22projekt@cluster0.dplz2.mongodb.net/malina?retryWrites=true&w=majority';
console.log('MongoDB URI:', dbUri);

// Připojení k MongoDB
mongoose.connect(dbUri)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello from IoT Backend!');
});

// Start server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
