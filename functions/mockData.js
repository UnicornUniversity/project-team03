// server mock data
const getMockTemperatureData = () => {
  return [
    {
      _id: 'mock1',
      temperature: 20,
      humidity: 60,
      soil_moisture: 30,
      light_level: 200,
      accelerometer: { x: 0.1, y: 0.2, z: 0.3 },
      timestamp: new Date('2025-03-22T15:08:19')
    },
    {
      _id: 'mock2',
      temperature: 22,
      humidity: 55,
      soil_moisture: 35,
      light_level: 250,
      accelerometer: { x: 0.2, y: 0.1, z: 0.4 },
      timestamp: new Date('2025-03-23T10:15:00')
    },
    {
      _id: 'mock3',
      temperature: 18,
      humidity: 65,
      soil_moisture: 40,
      light_level: 300,
      accelerometer: { x: 0.3, y: 0.4, z: 0.2 },
      timestamp: new Date('2025-03-24T08:30:00')
    }
  ];
};

module.exports = getMockTemperatureData;
