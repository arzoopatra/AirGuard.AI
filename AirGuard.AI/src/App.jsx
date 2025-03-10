import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import EnvironmentalChat from './Components/EnvironmentalChat';
import EnvironmentalAlerts from './Components/EnvironmentalAlerts';
import EnvironmentalMap from './Components/EnvironmentalMap';
import './styles.css'; // Import custom CSS

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<EnvironmentalChat />} />
        <Route path="/alerts" element={<EnvironmentalAlerts />} />
        <Route path="/map" element={<EnvironmentalMap />} />
      </Routes>
    </Router>
  );
};

export default App;