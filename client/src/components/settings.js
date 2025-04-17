import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import IBotaniQLogo from './iBotaniQLogo'; 
import LoginModal from './loginModal'; 
import { AuthContext } from '../authContext'; 
import './settings.css'; 

const SettingsPage = () => {
  const [plantId, setPlantId] = useState('1'); // Výchozí skleník
  const [thresholds, setThresholds] = useState({
    temperature: { min: '', max: '' },
    soilMoisture: { min: '', max: '' },
    airHumidity: { min: '', max: '' },
    light: { min: '', max: '' },
  });

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext); // Přístup k autentizaci
  const [showLoginModal, setShowLoginModal] = useState(false);
 

  // Načtení limitů při změně skleníku
  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const response = await fetch(`/api/thresholds/${plantId}`);
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
  }, [plantId]);

  // Uložení limitů
  const saveThresholds = async () => {
    try {
      const response = await fetch(`/api/thresholds/${plantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thresholds),
      });

      if (!response.ok) {
        throw new Error(`Chyba při ukládání limitů: ${response.statusText}`);
      }

      alert('Limity byly úspěšně uloženy.');
    } catch (error) {
      console.error('Chyba při ukládání limitů:', error);
    }
  };

  // Aktualizace hodnot v limitech
  const handleInputChange = (e, type, field) => {
    setThresholds({
      ...thresholds,
      [type]: {
        ...thresholds[type],
        [field]: e.target.value,
      },
    });
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
    <div className="settings-container">
      <div className="header">
        <div className="header-content">
          <div className="title-and-back">
            <IBotaniQLogo />
            <nav className="nav-links">
              <Link to="/">Zpět na hlavní stránku</Link> {/* Tlačítko zpět */}
            </nav>
            <div className="settings-title-dropdown">
              <h1 className="settings-title">Nastavení limitů pro:</h1>
              <div className="dropdown">
                <button className="dropdown-link">
                  Skleník {plantId} <span style={{ marginLeft: '5px' }}>▼</span>
                </button>
                <div className="dropdown-content">
                  <button
                    className={`dropdown-item ${plantId === '1' ? 'active' : ''}`}
                    onClick={() => setPlantId('1')}
                  >
                    Skleník 1
                  </button>
                  <button
                    className={`dropdown-item ${plantId === '2' ? 'active' : ''}`}
                    onClick={() => setPlantId('2')}
                  >
                    Skleník 2
                  </button>
                  <button
                    className={`dropdown-item ${plantId === '3' ? 'active' : ''}`}
                    onClick={() => setPlantId('3')}
                  >
                    Skleník 3
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isAuthenticated ? (
          <button className="login-button" onClick={handleLogout}>Odhlásit</button>
        ) : (
          <button className="login-button" onClick={handleLogin}>Přihlášení</button>
        )}
      </div>
      {isAuthenticated ? (
        <>
          <h2>Limity pro skleník {plantId}</h2>
          <div>
            <h3>Teplota</h3>
            <label>
              Min:
              <input
                type="number"
                value={thresholds.temperature.min}
                onChange={(e) => handleInputChange(e, 'temperature', 'min')}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={thresholds.temperature.max}
                onChange={(e) => handleInputChange(e, 'temperature', 'max')}
              />
            </label>
          </div>

          <div>
            <h3>Vlhkost půdy</h3>
            <label>
              Min:
              <input
                type="number"
                value={thresholds.soilMoisture.min}
                onChange={(e) => handleInputChange(e, 'soilMoisture', 'min')}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={thresholds.soilMoisture.max}
                onChange={(e) => handleInputChange(e, 'soilMoisture', 'max')}
              />
            </label>
          </div>

          <div>
            <h3>Vlhkost vzduchu</h3>
            <label>
              Min:
              <input
                type="number"
                value={thresholds.airHumidity.min}
                onChange={(e) => handleInputChange(e, 'airHumidity', 'min')}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={thresholds.airHumidity.max}
                onChange={(e) => handleInputChange(e, 'airHumidity', 'max')}
              />
            </label>
          </div>

          <div>
            <h3>Světlo</h3>
            <label>
              Min:
              <input
                type="number"
                value={thresholds.light.min}
                onChange={(e) => handleInputChange(e, 'light', 'min')}
              />
            </label>
            <label>
              Max:
              <input
                type="number"
                value={thresholds.light.max}
                onChange={(e) => handleInputChange(e, 'light', 'max')}
              />
            </label>
          </div>

          <button onClick={saveThresholds}>Uložit limity</button>
        </>
      ) : (
        <p>Pro přístup k nastavení limitů se prosím přihlaste.</p>
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
  );
};

export default SettingsPage;