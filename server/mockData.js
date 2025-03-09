// server/mockData.js

const getMockTemperatureData = () => {
    return [
      { timestamp: '2023-10-01T10:00:00Z', temperature: 22.5 },
      { timestamp: '2023-10-01T11:00:00Z', temperature: 23.0 },
      { timestamp: '2023-10-01T12:00:00Z', temperature: 23.5 },
      { timestamp: '2023-10-01T13:00:00Z', temperature: 24.0 },
      { timestamp: '2023-10-01T14:00:00Z', temperature: 24.5 },
    ];
  };
  
  module.exports = { getMockTemperatureData };