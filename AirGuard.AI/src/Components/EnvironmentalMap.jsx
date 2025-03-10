import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';

// Configure Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EnvironmentalMap = () => {
    const [location, setLocation] = useState({ lat: 31.5497, lon: 74.3436 }); // Default location: Lahore
    const [airData, setAirData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiKey = '9eb2dec9-5d3d-41c3-9cc5-81baa35b5c27';

    useEffect(() => {
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ lat: latitude, lon: longitude });
                        await fetchAirQualityData(latitude, longitude);
                    },
                    (error) => {
                        setError("Unable to retrieve your location.");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);
            }
        };

        const fetchAirQualityData = async (lat, lon) => {
            try {
                const response = await axios.get(
                    `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`
                );
                setAirData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching air quality data:', error);
                setError("Error fetching air quality data.");
                setLoading(false);
            }
        };

        getCurrentLocation();
    }, [apiKey]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const getAQITips = (aqi) => {
        if (aqi <= 50) {
            return {
                level: "Good",
                message: "Air quality is satisfactory, and air pollution poses little or no risk.",
                colorClass: "good",
                tips: "Enjoy your day! No precautions needed."
            };
        } else if (aqi <= 100) {
            return {
                level: "Moderate",
                message: "Air quality is acceptable. However, there may be a risk for some people.",
                colorClass: "moderate",
                tips: "Sensitive groups should limit prolonged outdoor exertion."
            };
        } else if (aqi <= 150) {
            return {
                level: "Unhealthy for Sensitive Groups",
                message: "Members of sensitive groups may experience health effects.",
                colorClass: "unhealthy-sensitive",
                tips: "Limit outdoor activities for sensitive groups."
            };
        } else {
            return {
                level: "Unhealthy",
                message: "Everyone may begin to experience health effects.",
                colorClass: "unhealthy",
                tips: "Avoid prolonged outdoor exertion."
            };
        }
    };

    const airQualityInfo = airData ? getAQITips(airData.current.pollution.aqius) : null;

    return (
        <div>
            <Navbar />
            <div className="map-container">
                <div className="map-header">
                    <h1>Air Quality Map</h1>
                    {airData && (
                        <p>Check the air quality index (AQI) in {airData.city}</p>
                    )}
                </div>

                <div className="map-wrapper">
                    <MapContainer
                        center={[location.lat, location.lon]}
                        zoom={13}
                        style={{ height: '500px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="©️ OpenStreetMap contributors"
                        />
                        <Marker position={[location.lat, location.lon]}>
                            {airData && (
                                <Popup>
                                    <div className="popup-content">
                                        <h3>{airData.city}</h3>
                                        <p>AQI: {airData.current.pollution.aqius}</p>
                                        <p>Temperature: {airData.current.weather.tp}°C</p>
                                        <p>Humidity: {airData.current.weather.hu}%</p>
                                    </div>
                                </Popup>
                            )}
                        </Marker>
                    </MapContainer>
                </div>

                {airData && airQualityInfo && (
                    <div className="air-quality-info">
                        <h2 className={airQualityInfo.colorClass}>
                            Air Quality Index: {airData.current.pollution.aqius} ({airQualityInfo.level})
                        </h2>
                        <p className="message">{airQualityInfo.message}</p>
                        <p className="tips-header">What you should do:</p>
                        <p className="tips">{airQualityInfo.tips}</p>
                    </div>
                )}

                <div className="pollution-tips">
                    <h2>How to Reduce Air Pollution</h2>
                    <ul>
                        <li>Reduce Vehicle Use: Use public transportation or carpool</li>
                        <li>Use Energy Efficient Appliances: Switch to energy-saving devices</li>
                        <li>Conserve Energy: Turn off unused lights and appliances</li>
                        <li>Avoid Burning Waste: Properly dispose of waste materials</li>
                        <li>Plant Trees: Help improve air quality naturally</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalMap; 