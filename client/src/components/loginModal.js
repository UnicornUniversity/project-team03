import React, { useState } from 'react';
import './loginModal.css';
import { auth, provider, signInWithPopup } from './firebaseConfig';

const LoginModal = ({ onClose, onSubmit }) => {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Úspěšné přihlášení
      onSubmit(result.user);
    } catch (error) {
      console.error('Error during Google login:', error);
      let errorMessage = 'Přihlášení přes Google selhalo.';
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Přihlášení přes Google není povoleno. Prosím, povolte jej v konzoli Firebase.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Síťová chyba. Zkontrolujte své internetové připojení.';
      } else {
        errorMessage = `Chyba: ${error.message}`;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Přihlášení</h2>
        {error && <p className="error">{error}</p>}
        <button onClick={handleGoogleLogin}>Přihlásit se přes Google</button>
      </div>
    </div>
  );
};

export default LoginModal;
