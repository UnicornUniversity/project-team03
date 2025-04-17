import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import IBotaniQLogo from './iBotaniQLogo';
import './realTimeMonitoring.css'; 
import './loginPage.css';

const LoginPage = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Stav pro zobrazení modálního okna
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User logged in:', result.user);
      setIsAuthenticated(true); // Nastavíme uživatele jako přihlášeného
      navigate('/'); // Přesměrování na hlavní stránku
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRegister = () => {
    setShowRegisterModal(true); // Zobrazí modální okno
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false); // Zavře modální okno
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <IBotaniQLogo />
        </div>
        <nav className="nav-links">
          <a href="/">Aktuální situace</a>
          <a href="/settings">Nastavení</a>
        </nav>
        <div className="login-button-container">
          {!isAuthenticated ? (
            <button className="login-button" onClick={handleGoogleLogin}>
              Nepřihlášen
            </button>
          ) : (
            <button className="login-button" onClick={handleLogout}>
              Odhlásit
            </button>
          )}
        </div>
      </header>
      <section className="login-content">
        <h2>Přihlášení</h2>
        <img src="/images/plant-image.JPG" alt="Plant" className="plant-image" />
        <p>Pro přístup k aplikaci se prosím přihlaste pomocí svého Google účtu.</p>
        {!isAuthenticated && (
          <>
            <button className="login-button" onClick={handleGoogleLogin}>
              Přihlásit se pomocí Google
            </button>
            <button className="register-button" onClick={handleRegister}>
              Registrovat se
            </button>
          </>
        )}
      </section>

      {/* Modální okno pro registraci */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Registrace</h2>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Zadejte svůj email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Heslo</label>
                <input type="password" id="password" placeholder="Zadejte své heslo" />
              </div>
              <button type="submit" className="login-button">
                Registrovat
              </button>
              <button type="button" className="cancel-button" onClick={closeRegisterModal}>
                Zavřít
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;