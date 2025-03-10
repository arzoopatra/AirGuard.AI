import React, { useState } from 'react';
import Navbar from './Navbar';

const EnvironmentalAlerts = () => {
    const [alerts] = useState([
        {
            id: 1,
            type: 'Air Quality Alert',
            severity: 'High',
            message: 'Poor Air Quality detected in your Area. AQI levels above 150.',
            date: '2024-03-01'
        },
        {
            id: 2,
            type: 'Temperature Warning',
            severity: 'Medium',
            message: 'Unusually High Temperatures expected this Week.',
            date: '2024-03-01'
        },
        {
            id: 3,
            type: 'Rainfall Alert',
            severity: 'Low',
            message: 'Light Rainfall expected in the next 24 hours.',
            date: '2024-03-01'
        }
    ]);

    return (
        <div>
            <Navbar />
            <div className="alerts-container">
                <div className="alerts-header">
                    <h1>Environmental Alerts</h1>
                    <p>Stay Informed about Environmental conditions in your Area</p>
                </div>
                <div className="alerts-list">
                    {alerts.map(alert => (
                        <div key={alert.id} className={`alert-card ${alert.severity.toLowerCase()}`}>
                            <div className="alert-type">{alert.type}</div>
                            <div className="alert-severity">Severity: {alert.severity}</div>
                            <div className="alert-message">{alert.message}</div>
                            <div className="alert-date">Date: {alert.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalAlerts;