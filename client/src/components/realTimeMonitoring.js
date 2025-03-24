import React, { useState, useEffect, useContext } from 'react';
import './realTimeMonitoring.css'; 
import Tile from './tile'; 
import { Link } from 'react-router-dom';
import { getThresholds } from '../utils/thresholds';
import LoginModal from './loginModal'; 
import SunIcon from './sunIcon';
import Thermomether from './thermometer';
import IBotaniQLogo from './iBotaniQLogo';
import SoilMoistureIcon from './soilMoistureIcon';
import { AuthContext } from '../authContext';
import { fetchData } from '../services/api'; // Import funkce fetchData


const RealTimeMonitoring = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [data, setData] = useState({
    temperature: '',
    humidity: '',
    soilMoisture: '',
    lightIntensity: '',
    accelerometer: { x: '', y: '', z: '' },
    timestamp: ''
  });
  const [menuActive, setMenuActive] = useState(false);
 const [showLoginModal, setShowLoginModal] = useState(false);
  const soilMoistureThresholds = getThresholds('soilMoisture');
  const temperatureThresholds = getThresholds('temperature');
  const airHumidityThresholds = getThresholds('airHumidity');
  const lightThresholds = getThresholds('light');
  const isTemperatureNormal = data.temperature >= temperatureThresholds.min && data.temperature <= temperatureThresholds.max;
  const isSoilMoistureNormal = data.soilMoisture >= soilMoistureThresholds.min && data.soilMoisture <= soilMoistureThresholds.max;
  const isAirHumidityNormal = data.humidity >= airHumidityThresholds.min && data.humidity <= airHumidityThresholds.max;
  const isLightNormal = data.lightIntensity >= lightThresholds.min && data.lightIntensity <= lightThresholds.max;

  const currentStatus = isTemperatureNormal && isSoilMoistureNormal && isAirHumidityNormal && isLightNormal
  ? 'Vše v normě' : 'Některé hodnoty jsou mimo normu !';

  const getStatusStyle = (isNormal) => ({
    color: isNormal ? 'black' : 'red'
  });

  useEffect(() => {
    const fetchDataFromApi = async () => {
      if (isAuthenticated) {
        try {
          console.log('Fetching data...');
          const fetchedData = await fetchData();
          console.log('Fetched data:', fetchedData);
          if (fetchedData && fetchedData.length > 0) {
            const latestData = fetchedData[0];
            setData({
              temperature: latestData.temperature || '',
              humidity: latestData.humidity || '',
              soilMoisture: latestData.soilMoisture || '60',
              lightIntensity: latestData.lightIntensity || '200',
              accelerometer: {
                x: latestData.accelerometer?.x || '',
                y: latestData.accelerometer?.y || '',
                z: latestData.accelerometer?.z || ''
              },
              timestamp: latestData.timestamp || ''
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchDataFromApi();
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
      <IBotaniQLogo />
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
        ? data.temperature < temperatureThresholds.min 
          ? 'low' 
          : data.temperature > temperatureThresholds.max 
            ? 'high' 
            : 'normal'
        : 'normal'
    }minThreshold={temperatureThresholds.min}
    maxThreshold={temperatureThresholds.max}
  />
          <Tile
            title="Vlhkost půdy"
            value={
              isAuthenticated 
                ? <><SoilMoistureIcon /> <span style={getStatusStyle(isSoilMoistureNormal)}>{data.soilMoisture !== undefined ? data.soilMoisture : 60}</span></> 
                : <><SoilMoistureIcon /> ?</>
            }
            unit={isAuthenticated ? '%' : ""}
            status={
              isAuthenticated && data.soilMoisture !== undefined 
                ? data.soilMoisture < soilMoistureThresholds.min 
                  ? 'low' 
                  : data.soilMoisture > soilMoistureThresholds.max 
                    ? 'high' 
                    : 'normal'
                : 'normal'
            }
            minThreshold={soilMoistureThresholds.min}
            maxThreshold={soilMoistureThresholds.max}
          />
          <Tile
            title="Vlhkost"
            value={isAuthenticated ? <span style={getStatusStyle(isAirHumidityNormal)}>{data.humidity !== undefined ? data.humidity : 'N/A'}</span> 
             : "?"}
            unit={isAuthenticated ? '%' : ""}
            status={
              isAuthenticated && data.humidity !== undefined 
                ? data.humidity < airHumidityThresholds.min 
                  ? 'low' 
                  : data.humidity > airHumidityThresholds.max 
                    ? 'high' 
                    : 'normal'
                : 'normal'
            }
            imageSrc="./images/leaf.JPG"
            minThreshold={airHumidityThresholds.min}
            maxThreshold={airHumidityThresholds.max}
          />
          <Tile
           title="Světlo"
           value={
            isAuthenticated 
              ? <><SunIcon /> <span style={getStatusStyle(isLightNormal)}>{data.lightIntensity !== undefined ? data.lightIntensity : 'N/A'}</span> </>
              : <><SunIcon /> ?</>
          }
          unit={isAuthenticated && data.lightIntensity !== undefined ? 'lx' : ""}
          status={
            isAuthenticated && data.lightIntensity !== undefined 
              ? data.lightIntensity < lightThresholds.min 
                ? 'low' 
                : data.lightIntensity > lightThresholds.max 
                  ? 'high' 
                  : 'normal'
              : 'normal'
          }    
          minThreshold={lightThresholds.min}
          maxThreshold={lightThresholds.max}       
           />
        </section>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
    );
};
export default RealTimeMonitoring;
