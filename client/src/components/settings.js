import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import IBotaniQLogo from './iBotaniQLogo'; 
import LoginModal from './loginModal'; 
import { AuthContext } from '../authContext'; 
import './settings.css'; 

const SettingsPage = () => {
  const [plantId, setPlantId] = useState('1'); // Výchozí skleník
  const [thresholds, setThresholds] = useState({
    temperature: { min: 18, max: 26 },
    soilMoisture: { min: 10, max: 50 },
    airHumidity: { min: 30, max: 70 },
    light: { min: 200, max: 500 },
  });

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext); // Přístup k autentizaci
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [menuActive] = useState(false);

  // Mockovaná data pro různé skleníky
  const mockThresholds = {
    '1': {
      temperature: { min: 18, max: 26 },
      soilMoisture: { min: 10, max: 50 },
      airHumidity: { min: 30, max: 70 },
      light: { min: 200, max: 500 },
    },
    '2': {
      temperature: { min: 15, max: 25 },
      soilMoisture: { min: 20, max: 60 },
      airHumidity: { min: 40, max: 80 },
      light: { min: 150, max: 400 },
    },
    '3': {
      temperature: { min: 20, max: 30 },
      soilMoisture: { min: 15, max: 45 },
      airHumidity: { min: 35, max: 75 },
      light: { min: 180, max: 450 },
    },
  };

  // Načtení mockovaných limitů při změně skleníku
  const handlePlantChange = (id) => {
    setPlantId(id);
    setThresholds(mockThresholds[id]);
  };

  // Uložení limitů (mock funkce)
  const saveThresholds = () => {
    console.log('Uložené limity:', thresholds);
    alert('Mock: Limity byly úspěšně uloženy.');
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
            <nav className={`nav-links ${menuActive ? 'active' : ''}`}>
              <Link to="/">Zpět na hlavní stránku</Link> {/* Tlačítko zpět */}
            </nav>
            <div className="settings-title-dropdown">
              <h1 className="settings-title">Nastavení limitů pro:</h1>
              <div className="dropdown">
                <button className="dropdown-link">
                  Skleník {plantId}
                </button>
                <div className="dropdown-content">
                  <button
                    className={`dropdown-item ${plantId === '1' ? 'active' : ''}`}
                    onClick={() => handlePlantChange('1')}
                  >
                    Skleník 1
                  </button>
                  <button
                    className={`dropdown-item ${plantId === '2' ? 'active' : ''}`}
                    onClick={() => handlePlantChange('2')}
                  >
                    Skleník 2
                  </button>
                  <button
                    className={`dropdown-item ${plantId === '3' ? 'active' : ''}`}
                    onClick={() => handlePlantChange('3')}
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