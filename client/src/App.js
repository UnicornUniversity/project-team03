import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RealTimeMonitoring from '../src/components/realTimeMonitoring';
import Statistics from '../src/components/statistics';
import { AuthProvider } from './authContext';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RealTimeMonitoring />} />
          <Route path="/statistics" element={<Statistics />} />
          {/* Další cesty */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;