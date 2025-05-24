import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './realTimeMonitoring.css';
import { Link } from 'react-router-dom';
import IBotaniQLogo from './iBotaniQLogo';
import LoginModal from './loginModal'; 
import { AuthContext } from '../authContext';
import { fetchLatestData } from '../services/api';
import Notifications from './notifications';

const RealTimeMonitoring = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [menuActive, setMenuActive] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dataSklenik1, setDataSklenik1] = useState(null);
  const [dataSklenik2, setDataSklenik2] = useState(null);
  const [additionalGreenhouses, setAdditionalGreenhouses] = useState([]); // Stav pro další skleníky
  const navigate = useNavigate();
  const [showAddGreenhouseModal, setShowAddGreenhouseModal] = useState(false);
  const [newGreenhouseName, setNewGreenhouseName] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedGreenhouse, setSelectedGreenhouse] = useState(null);
  const [hiddenGreenhouses, setHiddenGreenhouses] = useState([]);
  const [exceededValue, setExceededValue] = useState(null);
 
  
  useEffect(() => {
    const fetchDataForGreenhouses = async () => {
      if (isAuthenticated) {
        try {
          console.log('Fetching data for greenhouses...');
          const sklenik1Data = await fetchLatestData(1); // Data pro skleník 1
          const sklenik2Data = await fetchLatestData(2); // Data pro skleník 2
    
          if (sklenik1Data && sklenik1Data.length > 0) {
            setDataSklenik1(sklenik1Data[0]); // Poslední měření pro skleník 1
          }
    
          if (sklenik2Data && sklenik2Data.length > 0) {
            setDataSklenik2(sklenik2Data[0]); // Poslední měření pro skleník 2
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchDataForGreenhouses();
  }, [isAuthenticated]);

  // Render additional greenhouses
  const renderAdditionalGreenhouses = () => {
    return additionalGreenhouses.map((greenhouse) => (
      <div key={greenhouse.id} className="status-item-container">
        <div className="status-item" onClick={() => handleGreenhouseClick(greenhouse.id)}>
          <img src="/images/plant-image.JPG" alt="Plant" className="plant-image" />
          <div className="current-status-container">
            <h2>{greenhouse.name}</h2>
            <p>Data nejsou dostupná</p>
          </div>
        </div>
      </div>
    ));
  };

  const checkValues = (data) => {
    if (!data) return;

    if (data.temperature > 26 || data.temperature < 18) {
      setExceededValue('teplotu');
    } else if (data.soil_moisture > 50 || data.soil_moisture < 10) {
      setExceededValue('vlhkost půdy');
    } else if (data.humidity > 70 || data.humidity < 30) {
      setExceededValue('vlhkost vzduchu');
    } else if (data.light_level > 5 || data.light_level < 2) {
      setExceededValue('světlo');
    } else {
      setExceededValue(null);
    }
  };

  useEffect(() => {
    checkValues(dataSklenik1); // Kontrola hodnot pro skleník 1
  }, [dataSklenik1]);

  useEffect(() => {
    checkValues(dataSklenik2); // Kontrola hodnot pro skleník 2
  }, [dataSklenik2]);

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

  const handleAddGreenhouseClick = () => {
    setShowAddGreenhouseModal(true);
  };

  const handleAddGreenhouseClose = () => {
    setShowAddGreenhouseModal(false);
    setNewGreenhouseName('');
  };

  const handleAddGreenhouseSave = () => {
    if (newGreenhouseName.trim() === '') {
      alert('Zadejte název skleníku.');
      return;
    }

    const newGreenhouse = {
      id: `sklenik${Date.now()}`, // Unikátní ID pro nový skleník
      name: newGreenhouseName,
      timestamp: Date.now(),
      temperature: null,
      soil_moisture: null,
      humidity: null,
      light_level: null
    };

    setHiddenGreenhouses((prevHidden) => prevHidden.filter(id => id !== newGreenhouse.id));
    setAdditionalGreenhouses((prevGreenhouses) => [...prevGreenhouses, newGreenhouse]); // Přidání nového skleníků do seznamu dalších skleníků

    console.log('Nový skleník uložen:', newGreenhouseName);
    handleAddGreenhouseClose();
  };

  const handleRemoveClick = (greenhouseId) => {
    setSelectedGreenhouse(greenhouseId);
    setShowRemoveModal(true);
  };
  
  const handleRemoveCancel = () => {
    setShowRemoveModal(false);
  };
  
  
  const handleRemoveConfirm = () => {
    setHiddenGreenhouses((prevHidden) => [...prevHidden, selectedGreenhouse]);
    setShowRemoveModal(false);
    setSelectedGreenhouse(null);
  };
  const handleRenameClick = (greenhouseId) => {
    setSelectedGreenhouse(greenhouseId);
    setShowRenameModal(true);
  };
  
  const handleRenameCancel = () => {
    setShowRenameModal(false);
    setNewGreenhouseName('');
  };
  
  const handleRenameSave = () => {
    if (newGreenhouseName.trim() === '') {
      alert('Zadejte nový název skleníku.');
      return;
    }
  
    if (selectedGreenhouse === 'sklenik1') {
      setDataSklenik1((prevData) => ({
        ...prevData,
        name: newGreenhouseName,
      }));
    } else if (selectedGreenhouse === 'sklenik2') {
      setDataSklenik2((prevData) => ({
        ...prevData,
        name: newGreenhouseName,
      }));
    }
  
    console.log(`Skleník ${selectedGreenhouse} přejmenován na: ${newGreenhouseName}`);
    setShowRenameModal(false);
    setNewGreenhouseName('');
  };

  const calculateCurrentStatus = (data) => {
    if (!data) return 'Data nejsou dostupná';

    const isTemperatureNormal = data.temperature >= 18 && data.temperature <= 26;
    const isSoilMoistureNormal = data.soil_moisture >= 10 && data.soil_moisture <= 50;
    const isAirHumidityNormal = data.humidity >= 30 && data.humidity <= 70;
    const isLightNormal = data.light_level >= 2 && data.light_level <= 5;

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
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Aktuální situace skleníků</h1>
        
<section className="status" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
  {!hiddenGreenhouses.includes('sklenik1') && (
    <div className="status-item-container">
      <div className="status-item" onClick={() => handleGreenhouseClick('sklenik1')}>
        <img src="/images/plant1.JPG" alt="Plant" className="plant-image" />
        <div className="current-status-container">
        <h2>{dataSklenik1?.name || 'Skleník 1'}</h2>
        <p
    style={{
      color: calculateCurrentStatus(dataSklenik1) === 'Některé hodnoty jsou mimo normu' ? 'red' : 'black',
    }}
  >
    {isAuthenticated ? calculateCurrentStatus(dataSklenik1) : 'Aktuální údaje získáte po přihlášení'}
  </p>
</div>
        <div className="measurement-container">
          <div>Poslední měření:</div>
          <p>{isAuthenticated && dataSklenik1 ? new Date(dataSklenik1.timestamp).toLocaleString() : '?'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    <button
      className="remove-greenhouse-button"
      onClick={() => handleRemoveClick('sklenik1')}
      style={{
        marginTop: '0,1px',
        marginLeft: '35px',
        padding: '5px 10px',
        backgroundColor: '#b9cfbe',
        color: 'darkgreen',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
    >
      Odebrat
    </button>
    <button
      className="rename-greenhouse-button"
      onClick={() => handleRenameClick('sklenik1')}
      style={{
        marginTop: '0,1px',
        marginLeft: '3px',
        padding: '5px 10px',
        backgroundColor: '#b9cfbe',
        color: 'darkgreen',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
    >
      Změnit jméno
    </button>
  </div>
</div>
 )}

{!hiddenGreenhouses.includes('sklenik2') && (
    <div className="status-item-container">
      <div className="status-item" onClick={() => handleGreenhouseClick('sklenik2')}>
        <img src="/images/plant2.JPG" alt="Plant" className="plant-image" />
        <div className="current-status-container">
        <h2>{dataSklenik2?.name || 'Skleník 2'}</h2>
        <p
    style={{
      color: calculateCurrentStatus(dataSklenik2) === 'Některé hodnoty jsou mimo normu' ? 'red' : 'black',
    }}
    >
    {isAuthenticated ? calculateCurrentStatus(dataSklenik2) : 'Aktuální údaje získáte po přihlášení'}
     </p>
   </div>
        <div className="measurement-container">
          <div>Poslední měření:</div>
          <p>{isAuthenticated && dataSklenik2 ? new Date(dataSklenik2.timestamp).toLocaleString() : '?'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
    <button
      className="remove-greenhouse-button"
      onClick={() => handleRemoveClick('sklenik2')}
      style={{
        marginTop: '0,1px',
        marginLeft: '35px',
        padding: '5px 10px',
        backgroundColor: '#b9cfbe',
        color: 'darkgreen',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
    >
      Odebrat
    </button>
    <button
      className="rename-greenhouse-button"
      onClick={() => handleRenameClick('sklenik2')}
      style={{
        marginTop: '0,1px',
        marginLeft: '3px',
        padding: '5px 10px',
        backgroundColor: '#b9cfbe',
        color: 'darkgreen',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
      }}
    >
      Změnit jméno
    </button>
  </div>
</div>
 )}
 {renderAdditionalGreenhouses()}
</section>
   {/* Přidat další skleník */}
   <div
            className="status-item add-greenhouse"
            onClick={handleAddGreenhouseClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              border: '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              color: '#666'
            }}
          >
           
            <p>Přidat další skleník</p>
          </div>

  
        {/* Modální okno pro přidání skleníku */}
        {showAddGreenhouseModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Přidat nový skleník</h2>
              <input
                type="text"
                placeholder="Zadejte název skleníku"
                value={newGreenhouseName}
                onChange={(e) => setNewGreenhouseName(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={handleAddGreenhouseSave}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Uložit
                </button>
                <button
                  onClick={handleAddGreenhouseClose}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Storno
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Modální okno pro odebrání skleníku */}
        {showRemoveModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Skutečně chcete odebrat skleník?</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                  onClick={handleRemoveConfirm}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ANO
                </button>
                <button
                  onClick={handleRemoveCancel}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'gray',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  NE
                </button>
              </div>
            </div>
          </div>
        )}
           {/* Modální okno pro změnu jména skleníku */}
        {showRenameModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Změnit jméno skleníku</h2>
      <input
        type="text"
        placeholder="Zadejte nový název"
        value={newGreenhouseName}
        onChange={(e) => setNewGreenhouseName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={handleRenameSave}
          style={{
            padding: '10px 20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Uložit
        </button>
        <button
          onClick={handleRenameCancel}
          style={{
            padding: '10px 20px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Storno
        </button>
      </div>
    </div>
  </div>
)}
 {/* Notifikace */}
 <Notifications exceededValue={exceededValue} />
 
      </main>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
  );
};

export default RealTimeMonitoring;