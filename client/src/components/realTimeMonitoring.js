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
  if (!data) return null;
  if (data.temperature > 26 || data.temperature < 18) {
    return 'teplotu';
  } else if (data.soil_moisture > 98 || data.soil_moisture < 10) {
    return 'vlhkost půdy';
  } else if (data.humidity > 70 || data.humidity < 30) {
    return 'vlhkost vzduchu';
  } else if (data.light_level > 90 || data.light_level < 0) {
    return 'světlo';
  }
  return null;
};

 useEffect(() => {
  // Zkontroluj nejdřív skleník 1, pak skleník 2
  const exceeded1 = checkValues(dataSklenik1);
  const exceeded2 = checkValues(dataSklenik2);

  if (exceeded1) {
    setExceededValue(exceeded1);
  } else if (exceeded2) {
    setExceededValue(exceeded2);
  } else {
    setExceededValue(null);
  }
}, [dataSklenik1, dataSklenik2]);

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
    const isSoilMoistureNormal = data.soil_moisture >= 15 && data.soil_moisture <= 80;
    const isAirHumidityNormal = data.humidity >= 30 && data.humidity <= 70;
    const isLightNormal = data.light_level >= 2 && data.light_level <= 500;

    return isTemperatureNormal && isSoilMoistureNormal && isAirHumidityNormal && isLightNormal
      ? 'Vše v normě'
      : 'Některé hodnoty jsou mimo normu';
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
          <a href="/" className="active-link">Aktuální situace</a>
          <Link to="/settings">Nastavení</Link>
        </nav>
        <div className="btn-container">
          {!isAuthenticated ? (
            <button className="btn" onClick={handleLogin}>Přihlášení</button>
          ) : (
            <button className="btn" onClick={handleLogout}>Odhlásit</button>
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
      className="btn"
      onClick={() => handleRemoveClick('sklenik1')}
    >
      Odebrat
    </button>
    <button
      className="btn"
      onClick={() => handleRenameClick('sklenik1')}
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
      className="btn"
      onClick={() => handleRemoveClick('sklenik2')}
  
    >
      Odebrat
    </button>
    <button
      className="btn"
      onClick={() => handleRenameClick('sklenik2')}
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
          >
            <p>Přidat další skleník</p>
          </div>

  
        

        {showAddGreenhouseModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>🌿 Přidat nový skleník</h2>
      <input
        type="text"
        className="modal-input"
        placeholder="Zadejte název skleníku"
        value={newGreenhouseName}
        onChange={(e) => setNewGreenhouseName(e.target.value)}
      />
      <div className="modal-buttons">
        <button onClick={handleAddGreenhouseSave} className="confirm">
          Uložit
        </button>
        <button onClick={handleAddGreenhouseClose} className="cancel">
          Storno
        </button>
      </div>
    </div>
  </div>
)}


  
      


       {showRemoveModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>🗑️ Skutečně chcete odebrat skleník?</h2>
      <div className="modal-buttons">
        <button onClick={handleRemoveConfirm} className="confirm">Ano</button>
        <button onClick={handleRemoveCancel} className="cancel">Ne</button>
      </div>
    </div>
  </div>
)}

         


{showRenameModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>✏️ Změnit jméno skleníku</h2>
      <input
        type="text"
        placeholder="Zadejte nový název"
        value={newGreenhouseName}
        onChange={(e) => setNewGreenhouseName(e.target.value)}
      />
      <div className="modal-buttons">
        <button onClick={handleRenameSave} className="confirm">Uložit</button>
        <button onClick={handleRenameCancel} className="cancel">Storno</button>
      </div>
    </div>
  </div>
)}

 {/* Notifikace */}
 <Notifications exceededValue={exceededValue} isAuthenticated={isAuthenticated} />
 
      </main>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onSubmit={handleLoginSubmit} />}
    </div>
  );
};

export default RealTimeMonitoring;