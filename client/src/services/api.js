// api.js
const API_URL = process.env.REACT_APP_API_URL || 'https://us-central1-ibotaniq.cloudfunctions.net/api'; // URL pro produkční prostředí

export const fetchData = async (greenhouseId) => {
  try {
    // Dynamický endpoint podle prostředí
    const endpoint = `${API_URL}/routes/sensors?greenhouseId=${greenhouseId}`;
    console.log(`Fetching data from: ${endpoint}`);
    const response = await fetch(endpoint);
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data from API:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};