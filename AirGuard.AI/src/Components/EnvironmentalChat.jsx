import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import Groq from "groq-sdk";
import Navbar from './Navbar';

// Configure Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

const EnvironmentalChat = () => {
    const [location, setLocation] = useState({ lat: 31.5497, lon: 74.3436 }); // Default location: Lahore
    const [airData, setAirData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [airResponse, setAirResponse] = useState(null);
    const [language, setLanguage] = useState('en');
    const [messages, setMessages] = useState([
        {
            role: "system",
            content: "",
        },
    ]);

    const apiKey = 'bcbc5efb-e4e4-4456-b58b-979a7d268862';

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
                        setError("Unable to retrieve your Location.");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this Browser.");
                setLoading(false);
            }
        };

        const fetchAirQualityData = async (lat, lon) => {
            try {
                const response = await axios.get(
                    `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`
                );
                setAirData(response.data.data);
                setAirResponse(response.data);
                setLoading(false);

                const initialMessage = `The Air Quality in ${response.data.data.city} is ${response.data.data.current.pollution.aqius} AQI. The Temperature is ${response.data.data.current.weather.tp}°C. Here are some Tips for you: ${getAQITips(response.data.data.current.pollution.aqius).tips}. You can now ask me any Environmental Questions.`;

                setChat([{ sender: 'model', text: initialMessage }]);
            } catch (error) {
                console.error('Error Fetching Air Quality Data:', error);
                setError("Error Fetching Air Quality Data.");
                setLoading(false);
            }
        };

        getCurrentLocation();
    }, [apiKey]);

    const getAQITips = (aqi) => {
        if (aqi <= 50) {
            return {
                level: "Good",
                tips: "Air Quality is Good. Enjoy Outdoor Activities!"
            };
        } else if (aqi <= 100) {
            return {
                level: "Moderate",
                tips: "Sensitive Individuals should limit prolonged Outdoor Exertion."
            };
        } else if (aqi <= 150) {
            return {
                level: "Unhealthy for Sensitive Groups",
                tips: "Children and Elderly should avoid Outdoor Ativities."
            };
        } else {
            return {
                level: "Unhealthy",
                tips: "Everyone should reduce Outdoor Activities."
            };
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage = { sender: 'user', text: userInput.trim() };
        setChat(prev => [...prev, userMessage]);

        try {
            const userPrompt = `The air quality in ${airData.city} is ${airData.current.pollution.aqius} AQI. The temperature is ${airData.current.weather.tp}°C. Question: ${userInput}. Please provide a concise and helpful response.`;

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an Environmental expert providing information about Air Quality and Environmental Conditions."
                    },
                    {
                        role: "user",
                        content: userPrompt
                    }
                ],
                model: "mixtral-8x7b-32768",
                temperature: 0.7,
                max_tokens: 150,
                top_p: 1,
            });

            const modelResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't process your request at the Moment.";
            setChat(prev => [...prev, { sender: 'model', text: modelResponse }]);
        } catch (error) {
            console.error('Error in chat completion:', error);
            setChat(prev => [...prev, { sender: 'model', text: "I apologize, but I encountered an Error processing your Request." }]);
        }

        setUserInput('');
    };

    if (loading) {
        return <div className="loading-text">Loading...</div>;
    }

    if (error) {
        return <div className="error-text">{error}</div>;
    }

    return (
        <div className="chat-container">
            <Navbar />
            <div className="chat-header">
                <h1>Environmental Chat</h1>
                <p>Chat about the environment in {airData?.city || 'your area'}</p>
            </div>

            <div className="chat-box">
                <div className="chat-messages">
                    {chat.map((message, index) => (
                        <div key={index} className={`message-wrapper ${message.sender}`}>
                            <div className="message-content">
                                {message.sender === 'model' && (
                                    <div className="bot-avatar">🌍</div>
                                )}
                                <div className={`message ${message.sender}`}>
                                    {message.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        className="message-input"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask about Weather, Air Quality, or Environmental Conditions"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button className="send-button" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnvironmentalChat;
