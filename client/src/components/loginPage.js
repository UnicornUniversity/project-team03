import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import IBotaniQLogo from './iBotaniQLogo';
import '../index.css'; // Importujte index.css pro globální styly
import './loginPage.css';
import RegistrationModal from './registrationModal';     // Importujte komponentu pro registraci


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
    <div className="page">
      <header className="header">
        <div className="logo-container">
          <IBotaniQLogo />
        </div>
       
        <div className="btn-container">
          {!isAuthenticated ? (
            <button className="btn" onClick={handleGoogleLogin}>
              Nepřihlášen
            </button>
          ) : (
            <button className="btn" onClick={handleLogout}>
              Odhlásit
            </button>
          )}
        </div>
      </header>



<div className="hero-section">
  <div className="hero-left">
    <h1>
      <div>Inteligentní</div>
      <div>Domácí</div>
      <div>Skleník</div>
    </h1>
    <p className="subtitle">
      Sledujte a ovládejte růst rostlin přímo z telefonu.<br />
      Automatizované osvětlení, zavlažování i klima.
    </p>
    <p className="login-info">
      Pro přístup do aplikace se přihlaste pomocí svého Google účtu.
    </p>

    {!isAuthenticated && (
      <div className="button-group">
        <button className="btn login" onClick={handleGoogleLogin}>
        <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.5 2.4 29.6 0 24 0 14.9 0 7.5 5.9 4.5 14l7.6 6c1.8-4.1 5.9-7 10.9-7z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7 5.4c4.3-3.9 6.7-9.8 6.7-16.6z"/>
            <path fill="#FBBC05" d="M12.1 28.5a9.3 9.3 0 0 1 0-9l-7.6-6A15 15 0 0 0 0 24c0 2.4.6 4.7 1.6 6.7l7.6-6z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2.1 1.4-4.8 2.3-8.6 2.3-5 0-9.1-2.9-10.9-7l-7.6 6C7.5 42.1 14.9 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Přihlásit se pomocí Google
        </button>
        <button className="btn register" onClick={handleRegister}>
          Registrovat se
        </button>
      </div>
    )}
  </div>

  <div className="hero-right">
    <img
      src="/images/rostok-grin-ammiachnaia-2.webp"
      alt="Smart greenhouse with plants"
    />
  </div>
</div>


      {/* Modální okno pro registraci */}
       <RegistrationModal show={showRegisterModal} onClose={closeRegisterModal} />

    </div>
  );
};

export default LoginPage;