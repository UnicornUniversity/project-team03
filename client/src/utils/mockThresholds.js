const thresholds = {
    temperature: { min: 18, max: 26 },
    soilMoisture: { min: 10, max: 50 },
    airHumidity: { min: 30, max: 70 },
    light: { min: 200, max: 500 }
};

export const getThresholds = (type) => {
    return thresholds[type] || {};
};