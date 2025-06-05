import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import IBotaniQLogo from './iBotaniQLogo';
import LoginModal from './loginModal';
import { AuthContext } from '../authContext';
import { fetchThresholds, saveThresholds } from '../services/api';
import './settings.css';

const SettingsPage = () => {
  const [greenhouseId, setGreenhouseId] = useState('1');
  const [thresholds, setThresholds] = useState({
    temperature: { min: '', max: '' },
    soilMoisture: { min: '', max: '' },
    airHumidity: { min: '', max: '' },
    light: { min: '', max: '' },
  });

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadThresholds = async () => {
      try {
        const data = await fetchThresholds(greenhouseId);
        setThresholds(data);
      } catch (error) {
        console.error('Chyba při načítání limitů:', error);
        setThresholds({
          temperature: { min: 18, max: 26 },
          soilMoisture: { min: 10, max: 50 },
          airHumidity: { min: 30, max: 70 },
          light: { min: 2, max: 5 },
        });
      }
    };
    
    if (isAuthenticated) {
      loadThresholds();
    }
  }, [greenhouseId, isAuthenticated]);

  const handleSaveThresholds = async () => {
    if (!isAuthenticated) {
      alert('Pro uložení limitů se prosím přihlaste.');
      return;
    }

    setIsSaving(true);
    try {
      await saveThresholds(greenhouseId, thresholds);
      alert('Limity byly úspěšně uloženy.');
    } catch (error) {
      console.error('Chyba při ukládání limitů:', error);
      alert('Chyba při ukládání limitů: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e, type, field) => {
    setThresholds((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: e.target.value },
    }));
  };

  const handleLogin = () => setShowLoginModal(true);
  const handleLogout = () => setIsAuthenticated(false);
  const handleLoginSubmit = (user) => {
    console.log('User logged in:', user);
    setIsAuthenticated(true);
    setShowLoginModal(false);
  };

  return (
    <div className="page">
    {/* <div className="settings-container"> */}
      <header className="header">
        <div className="header-content">
          <div className="title-and-back">
            <IBotaniQLogo />
            <nav className="nav-links">
              <Link to="/">Zpět na hlavní stránku</Link>
            </nav>
            <div className="settings-title-dropdown">
              <h1 className="settings-title">Nastavení limitů pro:</h1>
              <div className="dropdown">
                <button className="dropdown-link">
                  Skleník {greenhouseId} <span style={{ marginLeft: '5px' }}>▼</span>
                </button>
                <div className="dropdown-content">
                  {['1', '2', '3'].map((id) => (
                    <button
                      key={id}
                      className={`dropdown-item ${greenhouseId === id ? 'active' : ''}`}
                      onClick={() => setGreenhouseId(id)}
                    >
                      Skleník {id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isAuthenticated ? (
          <button className="btn" onClick={handleLogout}>Odhlásit</button>
        ) : (
          <button className="btn" onClick={handleLogin}>Přihlášení</button>
        )}
      </header>

      {isAuthenticated ? (
        <>
          <h2 className="threshold-title">Limity pro skleník {greenhouseId}</h2>
          <div className="threshold-form">
            <div className="threshold-card">
              {/* <h3>Teplota</h3> */}
               <h3>🌡️ Teplota</h3>
              <div className="threshold-inputs">
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
            </div>

            <div className="threshold-card">
              {/* <h3>Vlhkost půdy</h3> */}
              <h3>🌱 Vlhkost půdy</h3>
              <div className="threshold-inputs">
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
            </div>

            <div className="threshold-card">
              {/* <h3>Vlhkost vzduchu</h3> */}
              <h3>💨 Vlhkost vzduchu</h3>
              <div className="threshold-inputs">
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
            </div>

            <div className="threshold-card">
              {/* <h3>Světlo</h3> */}
              <h3>☀️ Světlo</h3>
              <div className="threshold-inputs">
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
            </div>

            <div className="button-wrapper">
              <button 
                className="btn" 
                onClick={handleSaveThresholds}
                disabled={isSaving}
              >
                {isSaving ? 'Ukládání...' : 'Uložit limity'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Pro přístup k nastavení limitů se prosím přihlaste.</p>
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSubmit={handleLoginSubmit}
        />
      )}
    {/* </div> */}
    </div>
  );
};

export default SettingsPage;
