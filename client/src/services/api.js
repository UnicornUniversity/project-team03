// api.js
const API_URL = process.env.REACT_APP_API_URL || 'https://ibotaniq.cloudfunctions.net/api';

export const fetchData = async () => {
  try {
    const response = await fetch(`${API_URL}/sensors`); // Pokud chcete volat endpoint /sensors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};