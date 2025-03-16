const thresholds = {
    temperature: { min: 0, max: 30 },
    soilMoisture: { min: 10, max: 60 },
    airHumidity: { min: 30, max: 70 },
    light: { min: 100, max: 1000 }
};

export const getThresholds = (type) => {
    return thresholds[type] || {};
};