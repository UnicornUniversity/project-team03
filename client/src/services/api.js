// api.js
const API_URL = process.env.REACT_APP_API_URL || 'https://api-lbnc42etuq-uc.a.run.app'; // URL pro produkční prostředí

//Data pro RealTimeMonitoring a Statistics - aktuální data
export const fetchLatestData = async (greenhouseId) => {
  try {
    const endpoint = `${API_URL}/routes/sensors/latest?greenhouseId=${greenhouseId}`;
    console.log(`Fetching latest data from: ${endpoint}`);
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched latest data from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching latest data:', error);
    throw error;
  }
};
//Data pro Statistics -grafy
export const fetchHistoricalData = async (greenhouseId, from, to) => {
  try {
    const endpoint = `${API_URL}/routes/sensors?greenhouseId=${greenhouseId}&from=${from}&to=${to}`;
    console.log(`Fetching historical data from: ${endpoint}`);
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched historical data from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

//Data pro Settings - nastavení limitů
export const fetchThresholds = async (greenhouseId) => {
  try {
    const endpoint = `${API_URL}/routes/sensors/thresholds/${greenhouseId}`;
    console.log(`Fetching thresholds from: ${endpoint}`);
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched thresholds from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    throw error;
  }
};
//Data pro Settings - uložení limitů
export const saveThresholds = async (greenhouseId, thresholds) => {
  try {
    const endpoint = `${API_URL}/routes/sensors/thresholds/${greenhouseId}`;
    console.log(`Saving thresholds to: ${endpoint}`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thresholds),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Saved thresholds to API:', data);
    return data;
  } catch (error) {
    console.error('Error saving thresholds:', error);
    throw error;
  }
};