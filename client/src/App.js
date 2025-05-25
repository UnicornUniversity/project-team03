import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RealTimeMonitoring from '../src/components/realTimeMonitoring';
import Statistics from '../src/components/statistics';
import LoginPage from '../src/components/loginPage'; // Import LoginPage
import SettingsPage from '../src/components/settings'; // Import SettingsPage
import { AuthProvider, AuthContext } from './authContext';
import './index.css';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Pokud uživatel není přihlášen, přesměrujeme ho na /login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Přihlašovací stránka */}
          <Route path="/login" element={<LoginPage />} />

          {/* Chráněné cesty */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RealTimeMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics/:greenhouse"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;