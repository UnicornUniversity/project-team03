import React from 'react';
import { auth, provider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import './login.css'; 

const Login = () => {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <h2>Přihlášení</h2>
      <button onClick={signInWithGoogle}>Přihlásit se pomocí Google</button>
    </div>
  );
};

export default Login;