import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import sensorMockData from './sensorMockData.json'; 
import LoginModal from './loginModal'; 
import './statistics.css'; 
import IBotaniQLogo from './iBotaniQLogo';
import { AuthContext } from '../authContext';
import './realTimeMonitoring.css'; 
import Tile from './tile'; 
import SunIcon from './sunIcon';
import Thermomether from './thermometer';
import SoilMoistureIcon from './soilMoistureIcon';
import { fetchData } from '../services/api';
import { useParams } from 'react-router-dom';


const Statistics = () => {
  
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { greenhouse } = useParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
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
  const greenhouseId = greenhouse === 'sklenik1' ? 1 : 2;

  // Načtení limitů z backendu
  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const response = await fetch(`/routes/thresholds/${greenhouseId}`);
        if (!response.ok) {
          throw new Error(`Chyba při načítání limitů: ${response.statusText}`);
        }
        const data = await response.json();
        setThresholds(data);
        
        console.log('Fetched thresholds:', data);
  
        // Pokud data nejsou dostupná, nastavíme výchozí hodnoty
        if (!data || Object.keys(data).length === 0) {
          console.warn('Žádná data pro limity nebyla nalezena, nastavují se výchozí hodnoty.');
          setThresholds({
            temperature: { min: 18, max: 26 },
            soilMoisture: { min: 10, max: 50 },
            airHumidity: { min: 30, max: 70 },
            light: { min: 200, max: 500 },
          });
        } else {
          setThresholds(data);
        }
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
  }, [greenhouseId]);

  // Načtení dat ze skleníku
  useEffect(() => {
    const fetchDataFromApi = async () => {
      if (isAuthenticated) {
        try {
          console.log(`Fetching data for ${greenhouseId}...`);
          
          const fetchedData = await fetchData(greenhouseId); // Číselný greenhouseId
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
  }, [isAuthenticated, greenhouseId]);
  
  const isTemperatureNormal = data.temperature >= thresholds.temperature.min && data.temperature <= thresholds.temperature.max;
  const isSoilMoistureNormal = data.soil_moisture >= thresholds.soilMoisture.min && data.soil_moisture <= thresholds.soilMoisture.max;
  const isAirHumidityNormal = data.humidity >= thresholds.airHumidity.min && data.humidity <= thresholds.airHumidity.max;
  const isLightNormal = data.light_level >= thresholds.light.min && data.light_level <= thresholds.light.max;
  
   
    const getStatusStyle = (isNormal) => ({
      color: isNormal ? 'black' : 'red'
    });
     

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
    <div className="statistics-container">      
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
          <Link to="/">Zpět na hlavní stránku</Link>          
          <Link to="/settings">Nastavení</Link>
        </nav>
        <div className="login-button-container">
          {!isAuthenticated ? (
            <button className="login-button" onClick={handleLogin}>
              Přihlášení
            </button>
          ) : (
            <button className="login-button" onClick={handleLogout}>
              Odhlásit
            </button>
          )}
        </div>
      </header>
     {/* Nadpis pro skleník */}
    <h1>Hodnoty pro {greenhouse === 'sklenik1' ? 'Skleník 1' : 'Skleník 2'}</h1>
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
            imageSrc="/images/leaf.JPG"
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
      <h2>Hodnoty naměřené za poslední období</h2>
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