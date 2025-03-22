import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import sensorMockData from './sensorMockData.json'; 
import LoginModal from './loginModal'; 
import './statistics.css'; 
import IBotaniQLogo from './iBotaniQLogo';
import { AuthContext } from '../authContext';

const Statistics = () => {
  const [data, setData] = useState([]);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        // Simulate fetching data
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Transform data to a format suitable for the chart
        const transformedData = sensorMockData.map(entry => ({
          timestamp: entry.temperatureSensor.timestamp,
          temperature: entry.temperatureSensor.value,
          soilMoisture: entry.soilMoistureSensor.value,
          airHumidity: entry.airHumiditySensor.value
        }));
        setData(transformedData);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLoginSubmit = (user) => {
    console.log('User logged in:', user);
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  return (
    <div className="statistics-container">
      <div className="header">
     < IBotaniQLogo/>
        <Link to="/">
          <button className="back-button">Zpět na hlavní stránku</button>
        </Link>
        {isAuthenticated ? (
          <button className="login-button" onClick={handleLogout}>Odhlásit</button>
        ) : (
          <button className="login-button" onClick={handleLogin}>Přihlášení</button>
        )}
      </div>
      <h2>Hodnoty naměřené za poslední období
      </h2>
      <div className="chart-container">
        {isAuthenticated ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
              <Line type="monotone" dataKey="soilMoisture" stroke="#82ca9d" />
              <Line type="monotone" dataKey="airHumidity" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Aktuální údaje získáte po přihlášení</p>
        )}
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
  );
};

export default Statistics;