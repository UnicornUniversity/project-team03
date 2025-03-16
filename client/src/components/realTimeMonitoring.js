import React, { useState, useEffect } from 'react';
import mockData from './sensorMockData';
import './realTimeMonitoring.css'; 
import Tile from './tile'; // Import komponenty Tile
import { Link } from 'react-router-dom';
import { getThresholds } from '../utils/thresholds';


const RealTimeMonitoring = () => {
  const [data, setData] = useState({
    temperatureSensor: { timestamp: '', value: '', unit: '' },
    soilMoistureSensor: { value: '', unit: '' },
    airHumiditySensor: { value: '', unit: '' }
  });
  const [menuActive, setMenuActive] = useState(false);
  const airHumidityThresholds = getThresholds('airHumidity');

  useEffect(() => {
    const fetchData = async () => {
      // Zde by bylo API volání, zatím používáme mockData
      setData(mockData);
    };

    fetchData();
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src="/images/logo-iBotaniQ.jpg" alt="Logo" className="logo" />
        </div>
         <div className={`hamburger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
         <div></div>
          <div></div>
          <div></div>
        </div> 
        <nav className={`nav-links ${menuActive ? 'active' : ''}`}>
          <Link to="/current-situation">Aktuální situace</Link>
          <Link to="/statistics">Statistiky</Link>
          <Link to="/settings">Nastavení</Link>
        </nav>
        <div className="login-button-container">
          <Link to="/login">
            <button className="login-button">Přihlášení</button>
          </Link>
        </div>
      </header>
        <section className="status">
        <div className="status-item">
        
        <img src="/images/greenHouse.jpg" alt="Plant" className="greenHouse-image" />
        <div className="current-status-container">
      <div>Aktuálně :</div>
      <p>Vše v normě</p>
    </div>
        <div className="measurement-container">
        <img src="/images/plant-image.jpg" alt="Plant" className="plant-image" />
      <div>Poslední měření :</div>
      <p>{new Date(data.temperatureSensor.timestamp).toLocaleDateString()}</p>
    </div>
  </div>
        </section>
        <section className="tiles">
          <Tile
            title="Teplota"
            value={data.temperatureSensor.value}
            unit={data.temperatureSensor.unit}
            status={data.temperatureSensor.value < 10 ? 'warning' : 'normal'}
            imageSrc="images/thermometer.jpg"
          />
           <Tile
            title="Vlhkost půdy"
            value={data.soilMoistureSensor.value}
            unit={data.soilMoistureSensor.unit}
            status={data.soilMoistureSensor.value < 10 ? 'warning' : 'normal'}
            imageSrc="images/thermometer.jpg"
            minThreshold={airHumidityThresholds.min}
            maxThreshold={airHumidityThresholds.max}
          />
          <Tile
            title="Vlhkost vzd."
            value={data.airHumiditySensor.value}
            unit={data.airHumiditySensor.unit}
            status={data.airHumiditySensor.value < 30 ? 'warning' : 'normal'}
            imageSrc="images/leaf.jpg"
          />
          <Tile
            title="Světlo"
            value="DENNÍ"
            unit=""
            status="normal"
            imageSrc="images/sun.jpg"
          />
        </section>
      
    </div>
    );
    
};

export default RealTimeMonitoring;