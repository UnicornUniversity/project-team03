import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { Link } from 'react-router-dom';
import LoginModal from './loginModal'; 
import './statistics.css'; 
import IBotaniQLogo from './iBotaniQLogo';
import { AuthContext } from '../authContext';
import { Tile } from './tile';
import SunIcon from './sunIcon';
import Thermomether from './thermometer';
import SoilMoistureIcon from './soilMoistureIcon';
import { fetchHistoricalData, fetchLatestData } from '../services/api';
import { fetchThresholds } from '../services/api';
import { useParams } from 'react-router-dom';
import HumidityIcon from './humidityIcon';
import GreenhouseWeeklyChart from './greenHouseChart';


const Statistics = () => {
  
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const { greenhouse } = useParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [chartData, setChartData] = useState([]);
  
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

  // Načtení aktuálních limitů z databáze
  useEffect(() => {
    const fetchThresholdsFromApi = async () => {
      try {
        console.log(`Fetching thresholds for greenhouse ${greenhouseId}...`);
        const data = await fetchThresholds(greenhouseId); // Použití funkce z api.js
        console.log('Fetched thresholds:', data);
  
        // Pokud data nejsou dostupná, nastavíme výchozí hodnoty
        if (!data || Object.keys(data).length === 0) {
          console.warn('Žádná data pro limity nebyla nalezena, nastavují se výchozí hodnoty.');
          setThresholds({
            temperature: { min: 18, max: 26 },
            soilMoisture: { min: 10, max: 50 },
            airHumidity: { min: 30, max: 70 },
            light: { min: 2, max: 5 },
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
          light: { min: 2, max: 5},
        });
      }
    };
  
    fetchThresholdsFromApi();
  }, [greenhouseId]);

  // Načtení aktuálních dat 
  useEffect(() => {
    const fetchLatestDataFromApi = async () => {
      if (isAuthenticated) {
        try {
          console.log(`Fetching latest data for greenhouse ${greenhouseId}...`);
          const latestData = await fetchLatestData(greenhouseId); // Použití funkce z api.js
          console.log('Fetched latest data:', latestData);
          const latest = latestData[0]; // <-- fix here!
          setData({
            temperature: latest.temperature ?? '20',
            humidity: latest.humidity ?? '60',
            soil_moisture: latest.soil_moisture ?? '60',
            light_level: latest.light_level ?? '4,1', 
            timestamp: latest.timestamp ?? ''
          });
        } catch (error) {
          console.error('Error fetching latest data:', error);
        }
      }
    };
  
    fetchLatestDataFromApi();
  }, [isAuthenticated, greenhouseId]);
  
  const isTemperatureNormal = data.temperature >= thresholds.temperature.min && data.temperature <= thresholds.temperature.max;
  const isSoilMoistureNormal = data.soil_moisture >= thresholds.soilMoisture.min && data.soil_moisture <= thresholds.soilMoisture.max;
  const isAirHumidityNormal = data.humidity >= thresholds.airHumidity.min && data.humidity <= thresholds.airHumidity.max;
  const isLightNormal = data.light_level >= thresholds.light.min && data.light_level <= thresholds.light.max;
  
   
    const getStatusStyle = (isNormal) => ({
      color: isNormal ? 'black' : 'red'
    });
     
 // Načtení historických dat pro graf
    useEffect(() => {
      const fetchHistoricalDataFromApi = async () => {
        if (isAuthenticated) {
          try {
            const from = new Date();
            from.setDate(from.getDate() - 7); // Posledních 7 dní
            const to = new Date(); // Dnešní datum
    
            const data = await fetchHistoricalData(greenhouseId, from.toISOString(), to.toISOString());
        console.log('Historical data:', data);
    
            setChartData(data.map(entry => ({
              timestamp: entry.timestamp,
              temperature: entry.temperature,
              soilMoisture: entry.soil_moisture,
              airHumidity: entry.humidity,
              lightLevel: entry.light_level
            })));
          } catch (error) {
            console.error('Error fetching historical data:', error);
          }
        }
      }; 
    
      fetchHistoricalDataFromApi();
    }, [isAuthenticated, greenhouseId]);

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
    <div className="page">      
      <header className="header">
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
        <div className="btn-container">
          {!isAuthenticated ? (
            <button className="btn" onClick={handleLogin}>
              Přihlášení
            </button>
          ) : (
            <button className="btn" onClick={handleLogout}>
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
              ? (
        <>
          <Thermomether 
            minTemperature={thresholds.temperature.min}
            maxTemperature={thresholds.temperature.max}
          />
          <span style={getStatusStyle(isTemperatureNormal)}>
            {data.temperature !== undefined ? data.temperature : 20}
          </span>
        </>
      )
      : (
        <>
          <Thermomether 
            minTemperature={thresholds.temperature.min}
            maxTemperature={thresholds.temperature.max}
          />
          ?
        </>
      )
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
            value={
              isAuthenticated 
              ? <><HumidityIcon /> <span style={getStatusStyle(isAirHumidityNormal)}>{data.humidity !== undefined ? data.humidity : 60}</span> </>
              : <><HumidityIcon /> ?</>
            }
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
            // imageSrc="/images/leaf.JPG"
            minThreshold={thresholds.airHumidity.min}
            maxThreshold={thresholds.airHumidity.max}
          />



          <Tile
           title="Světlo"
           value={
            isAuthenticated 
              ? <><SunIcon /> <span style={getStatusStyle(isLightNormal)}>{data.light_level !== undefined ? data.light_level : 4.1}</span> </>
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
        <div className="thermometer-container">        
      </div>
      <h2>Hodnoty naměřené za poslední období</h2>
      <div className="chart-container">
        {isAuthenticated ? (
          <GreenhouseWeeklyChart 
            width="100%" 
            height={400}
            thresholds={thresholds}
            greenhouseId={greenhouseId}
          />
        ) : (
          <p>Žádná data nejsou k dispozici</p>
        )}
      </div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
  );
};


export default Statistics;
