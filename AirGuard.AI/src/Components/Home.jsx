import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="home">
      <Navbar />

      <div className="content">
        <h1>AirGuard AI</h1>
        <p>Your Real-Time guide to a Cleaner & Greener Future</p>
      </div>

      <div className="button-container">
        <div className="button-row">
          <button
            className="btn blue"
            onClick={() => handleNavigation('/chat')}
          >
            Chat with Real-Time Insights
          </button>
          <button
            className="btn yellow"
            onClick={() => handleNavigation('/map')}
          >
            See Pollution Levels in Your Area
          </button>
        </div>
        <div className="button-row">
          <button
            className="btn green"
            onClick={() => handleNavigation('/alerts')}
          >
            Get Alerts for Climate Change
          </button>
        </div>
      </div>


    </div>
  );
};

export default Home;
