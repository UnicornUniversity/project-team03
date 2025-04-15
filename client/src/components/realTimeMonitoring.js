import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './realTimeMonitoring.css';
import { Link } from 'react-router-dom';
import IBotaniQLogo from './iBotaniQLogo';
import LoginModal from './loginModal'; 
import { AuthContext } from '../authContext';
import { fetchData } from '../services/api';

const RealTimeMonitoring = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [menuActive, setMenuActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dataSklenik1, setDataSklenik1] = useState(null);
  const [dataSklenik2, setDataSklenik2] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataForGreenhouses = async () => {
      if (isAuthenticated) {
        try {
          const sklenik1Data = await fetchData(1); // Data pro skleník 1
          const sklenik2Data = await fetchData(2); // Data pro skleník 2
          setDataSklenik1(sklenik1Data[0]); // Poslední měření pro skleník 1
          setDataSklenik2(sklenik2Data[0]); // Poslední měření pro skleník 2
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchDataForGreenhouses();
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

  const handleGreenhouseClick = (greenhouse) => {
    navigate(`/statistics/${greenhouse}`);
  };

  const calculateCurrentStatus = (data) => {
    if (!data) return 'Data nejsou dostupná';

    const isTemperatureNormal = data.temperature >= 18 && data.temperature <= 26;
    const isSoilMoistureNormal = data.soil_moisture >= 10 && data.soil_moisture <= 50;
    const isAirHumidityNormal = data.humidity >= 30 && data.humidity <= 70;
    const isLightNormal = data.light_level >= 200 && data.light_level <= 500;

    return isTemperatureNormal && isSoilMoistureNormal && isAirHumidityNormal && isLightNormal
      ? 'Vše v normě'
      : 'Některé hodnoty jsou mimo normu';
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
          <a href="/" className="active-link">Aktuální situace</a>
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
      <main>
        <h1>Vyberte skleník</h1>
        <section className="status">
          {/* Skleník 1 */}
          <div className="status-item" onClick={() => handleGreenhouseClick('sklenik1')}>            
            
            <div className="current-status-container">
             <div>Skleník 1 aktuálně:</div>
             <img src="/images/plant-image.JPG" alt="Plant" className="plant-image" />
              <p>{isAuthenticated ? calculateCurrentStatus(dataSklenik1) : 'Aktuální údaje získáte po přihlášení'}</p>
            </div>
            <div className="measurement-container">
              <div>Poslední měření:</div>
              <p>{isAuthenticated && dataSklenik1 ? new Date(dataSklenik1.timestamp).toLocaleString() : '?'}</p>
            </div>
          </div>
  
          {/* Skleník 2 */}
          <div className="status-item" onClick={() => handleGreenhouseClick('sklenik2')}>
            
            <div className="current-status-container">
            
              <div>Skleník 2 Aktuálně:</div>
              <img src="/images/greenHouse.JPG" alt="Plant" className="plant-image" />
              <p>{isAuthenticated ? calculateCurrentStatus(dataSklenik2) : 'Aktuální údaje získáte po přihlášení'}</p>
            </div>
            <div className="measurement-container">
              <div>Poslední měření:</div>
              <p>{isAuthenticated && dataSklenik2 ? new Date(dataSklenik2.timestamp).toLocaleString() : '?'}</p>
            </div>
          </div>
        </section>
      </main>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
  );
};

export default RealTimeMonitoring;