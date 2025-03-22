import React, { useState, useEffect } from 'react';
import mockData from './sensorMockData';
import './realTimeMonitoring.css'; 
import Tile from './tile'; 
import { Link } from 'react-router-dom';
import { getThresholds } from '../utils/thresholds';
import LoginModal from './loginModal'; 

const RealTimeMonitoring = () => {
  const [data, setData] = useState({
    temperatureSensor: { timestamp: '', value: '', unit: '' },
    soilMoistureSensor: { value: '', unit: '' },
    airHumiditySensor: { value: '', unit: '' }
  });
  const [menuActive, setMenuActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const airHumidityThresholds = getThresholds('airHumidity');

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        console.log('Fetching data...');
        // Zde API volání, zatím používáme mockData
        setData(mockData);
        console.log('Data fetched:', mockData);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <img src="/images/logo-iBotaniQ.JPG" alt="Logo" className="logo" />
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
          {!isAuthenticated ? (
            <button className="login-button" onClick={handleLogin}>Přihlášení</button>
          ) : (
            <button className="login-button" onClick={handleLogout}>Odhlásit</button>
          )}
        </div>
      </header>
        <section className="status">
        <div className="status-item">
        
        <img src="/images/GreenHouse.JPG" alt="Plant" className="greenHouse-image" />
        <div className="current-status-container">
      <div>Aktuálně :</div>
      <p>{isAuthenticated ? 'Vše v normě' : 'Aktuální údaje získáte po přihlášení'}</p>
    </div>
        <div className="measurement-container">
        <img src="/images/plant-image.JPG" alt="Plant" className="plant-image" />
      <div>Poslední měření :</div>
      <p>{isAuthenticated ? new Date(data.temperatureSensor.timestamp).toLocaleDateString() : '?'}</p>
    </div>
  </div>
        </section>
        <section className="tiles">
          <Tile
            title="Teplota"
            value={isAuthenticated ? data.temperatureSensor.value : "?"}
            unit={isAuthenticated ? data.temperatureSensor.unit : ""}
            status={isAuthenticated && data.temperatureSensor.value < 10 ? 'warning' : 'normal'}
            imageSrc="/images/thermometer.JPG"
          />
          <Tile
            title="Vlhkost půdy"
            value={isAuthenticated ? data.soilMoistureSensor.value : "?"}
            unit={isAuthenticated ? data.soilMoistureSensor.unit : ""}
            status={isAuthenticated && data.soilMoistureSensor.value < 10 ? 'warning' : 'normal'}
            imageSrc="/images/thermometer.JPG"
            minThreshold={airHumidityThresholds.min}
            maxThreshold={airHumidityThresholds.max}
          />
          <Tile
            title="Vlhkost"
            value={isAuthenticated ? data.airHumiditySensor.value : "?"}
            unit={isAuthenticated ? data.airHumiditySensor.unit : ""}
            status={isAuthenticated && data.airHumiditySensor.value < 30 ? 'warning' : 'normal'}
            imageSrc="/images/leaf.JPG"
          />
          <Tile
           title="Světlo"
           value={isAuthenticated ? "DENNÍ" : "?"}
           unit=""
           status="normal"
           imageSrc="/images/sun.JPG"
           />
        </section>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
    );
};

export default RealTimeMonitoring;
