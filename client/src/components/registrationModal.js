import React from 'react';
import './registrationModal.css';

const RegistrationModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
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
          <button type="button" className="cancel-button" onClick={onClose}>
            Zavřít
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;