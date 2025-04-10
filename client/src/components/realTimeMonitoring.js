import React, { useState, useEffect, useContext } from 'react';
import './realTimeMonitoring.css'; 
import Tile from './tile'; 
import { Link } from 'react-router-dom';
import LoginModal from './loginModal'; 
import SunIcon from './sunIcon';
import Thermomether from './thermometer';
import IBotaniQLogo from './iBotaniQLogo';
import SoilMoistureIcon from './soilMoistureIcon';
import { AuthContext } from '../authContext';
import { fetchData } from '../services/api'; 


const RealTimeMonitoring = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState('Skleník 1'); // Výchozí skleník
  const [data, setData] = useState({
    temperature: '',
    humidity: '',
    soil_moisture: '',
    light_level: '',
    timestamp: ''
  });

  const [thresholds, setThresholds] = useState({
    temperature: { min: 0, max: 0 },
    soilMoisture: { min: 0, max: 0 },
    airHumidity: { min: 0, max: 0 },
    light: { min: 0, max: 0 },
  });

  const [menuActive, setMenuActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Načtení limitů z backendu
 useEffect(() => {
  const fetchThresholds = async () => {
    try {
      const response = await fetch(`/routes/thresholds/${selectedGreenhouse}`);
      if (!response.ok) {
        throw new Error(`Chyba při načítání limitů: ${response.statusText}`);
      }
      const data = await response.json();
      setThresholds(data);
    } catch (error) {
      console.error('Chyba při načítání limitů:', error);
   // Nastavení výchozích hodnot při chybě
   setThresholds({
    temperature: { min: 18, max: 26 },
    soilMoisture: { min: 10, max: 50 },
    airHumidity: { min: 30, max: 70 },
    light: { min: 200, max: 500 },
  });
}
};
  fetchThresholds();
}, [selectedGreenhouse]);

// Načtení dat ze skleníku
useEffect(() => {
  const fetchDataFromApi = async () => {
    if (isAuthenticated) {
      try {
        console.log(`Fetching data for ${selectedGreenhouse}...`);
        // selectedGreenhouse na odpovídající greenhouseId
        const greenhouseId = selectedGreenhouse === 'Skleník 1' ? 1 : 2;
        const fetchedData = await fetchData(greenhouseId); //  číselný greenhouseId
        console.log('Fetched data:', fetchedData);
        if (fetchedData && fetchedData.length > 0) {
          const latestData = fetchedData[0];
          setData({
            temperature: latestData.temperature || '',
            humidity: latestData.humidity || '',
            soil_moisture: latestData.soil_moisture || '60',
            light_level: latestData.light_level || 'Denní',
            timestamp: latestData.timestamp || ''
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };
  fetchDataFromApi();
}, [isAuthenticated, selectedGreenhouse]);
  
const isTemperatureNormal = data.temperature >= thresholds.temperature.min && data.temperature <= thresholds.temperature.max;
const isSoilMoistureNormal = data.soil_moisture >= thresholds.soilMoisture.min && data.soil_moisture <= thresholds.soilMoisture.max;
const isAirHumidityNormal = data.humidity >= thresholds.airHumidity.min && data.humidity <= thresholds.airHumidity.max;
const isLightNormal = data.light_level >= thresholds.light.min && data.light_level <= thresholds.light.max;
  
const currentStatus = isTemperatureNormal && isSoilMoistureNormal && isAirHumidityNormal && isLightNormal
  ? 'Vše v normě' : 'Některé hodnoty jsou mimo normu !';

  const getStatusStyle = (isNormal) => ({
    color: isNormal ? 'black' : 'red'
  });

 
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
      <IBotaniQLogo />
        </div>
         <div className={`hamburger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
         <div></div>
          <div></div>
          <div></div>
        </div> 
        <nav className={`nav-links ${menuActive ? 'active' : ''}`}><div className="dropdown">
          <button className="dropdown-link">
            Situace {selectedGreenhouse}
          </button>
          <div className="dropdown-content">
            <button
              className={`dropdown-item ${selectedGreenhouse === 'Skleník 1' ? 'active' : ''}`}
              onClick={() => setSelectedGreenhouse('Skleník 1')}
            >
              Situace Skleník 1
            </button>
            <button
              className={`dropdown-item ${selectedGreenhouse === 'Skleník 2' ? 'active' : ''}`}
              onClick={() => setSelectedGreenhouse('Skleník 2')}
            >
              Situace Skleník 2
            </button>
          </div>
        </div>
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
        
        <img src="/images/plant-image.JPG" alt="Plant" className="plant-image" />
        <div className="current-status-container">
      <div>Aktuálně :</div>
      <p className={ currentStatus === 'Některé hodnoty jsou mimo normu !' ? 'warning-text' : '' }>
      {isAuthenticated ? currentStatus : 'Aktuální údaje získáte po přihlášení'}
      </p>
      </div>
        <div className="measurement-container">
        <div>Poslední měření :</div>
        <p>{isAuthenticated ? new Date(data.timestamp).toLocaleString() : '?'}</p>
    </div>
  </div>
        </section>
        <section className="tiles">
        <Tile
    title="Teplota"
    value={
      isAuthenticated 
      ? <><Thermomether /> <span style={getStatusStyle(isTemperatureNormal)}>{data.temperature !== undefined ? data.temperature : 'N/A'}</span></> 
      : <><Thermomether /> ?</>
    }
    unit={isAuthenticated && data.temperature !== undefined ? '°C' : ""}
    status={
      isAuthenticated && data.temperature !== undefined 
      ? data.temperature < thresholds.temperature.min
      ? 'low' 
      : data.temperature > thresholds.temperature.max
        ? 'high' 
        : 'normal'
    : 'normal'
    }
    minThreshold={thresholds.temperature.min}
    maxThreshold={thresholds.temperature.max}
  />
          <Tile
            title="Vlhkost půdy"
            value={
              isAuthenticated 
                ? <><SoilMoistureIcon /> <span style={getStatusStyle(isSoilMoistureNormal)}>{data.soil_moisture !== undefined ? data.soil_moisture : 60}</span></> 
                : <><SoilMoistureIcon /> ?</>
            }
            unit={isAuthenticated ? '%' : ""}
            status={
              isAuthenticated && data.soil_moisture !== undefined 
                ? data.soil_moisture < thresholds.soilMoisture.min 
                  ? 'low' 
                  : data.soil_moisture > thresholds.soilMoisture.max 
                    ? 'high' 
                    : 'normal'
                : 'normal'
            }
            minThreshold={thresholds.soilMoisture.min}
            maxThreshold={thresholds.soilMoisture.max }
          />
          <Tile
            title="Vlhkost"
            value={isAuthenticated ? <span style={getStatusStyle(isAirHumidityNormal)}>{data.humidity !== undefined ? data.humidity : 'N/A'}</span> 
             : "?"}
            unit={isAuthenticated ? '%' : ""}
            status={
              isAuthenticated && data.humidity !== undefined 
                ? data.humidity < thresholds.airHumidity.min 
                  ? 'low' 
                  : data.humidity > thresholds.airHumidity.max 
                    ? 'high' 
                    : 'normal'
                : 'normal'
            }
            imageSrc="./images/leaf.JPG"
            minThreshold={thresholds.airHumidity.min}
            maxThreshold={thresholds.airHumidity.max}
          />
          <Tile
           title="Světlo"
           value={
            isAuthenticated 
              ? <><SunIcon /> <span style={getStatusStyle(isLightNormal)}>{data.light_level !== undefined ? data.light_level : 'N/A'}</span> </>
              : <><SunIcon /> ?</>
          }
          unit={isAuthenticated && data.light_level !== undefined ? 'lx' : ""}
          status={
            isAuthenticated && data.light_level !== undefined 
              ? data.light_level < thresholds.light.min 
                ? 'low' 
                : data.light_level > thresholds.light.max 
                  ? 'high' 
                  : 'normal'
              : 'normal'
          }    
          minThreshold={thresholds.light.min}
          maxThreshold={thresholds.light.max}       
           />
        </section>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
    );
};
export default RealTimeMonitoring;
