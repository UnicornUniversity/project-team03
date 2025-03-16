import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RealTimeMonitoring from '../src/components/realTimeMonitoring';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RealTimeMonitoring />} />
        </Routes>
    </Router>
  );
};

export default App;