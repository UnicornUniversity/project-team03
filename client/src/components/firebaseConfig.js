import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyChyOa9gO9LPIBvsQbvyuhyGLxN_5H6seA",
    authDomain: "ibotaniq.firebaseapp.com",
    projectId: "ibotaniq",
    storageBucket: "ibotaniq.firebasestorage.app",
    messagingSenderId: "349395673351",
    appId: "1:349395673351:web:2881fb768334d56bc8a5a2",
    measurementId: "G-9JPT5PS82E"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  
  export { auth, provider, signInWithPopup };