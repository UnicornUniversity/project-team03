// api.js
const API_URL = process.env.REACT_APP_API_URL || 'https://us-central1-ibotaniq.cloudfunctions.net/api';
const USE_DATABASE = process.env.REACT_APP_USE_DATABASE === 'true'; // Přepínač pro použití databáze

export const fetchData = async (greenhouseId) => {
  try {
    const endpoint = `http://localhost:5000/routes/sensors?greenhouseId=${greenhouseId}`;
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