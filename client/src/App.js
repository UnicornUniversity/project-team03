import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RealTimeMonitoring from '../src/components/realTimeMonitoring';
import Login from './components/login.js';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RealTimeMonitoring />} />
     </Routes>
    </Router>
  );
};

export default App;
