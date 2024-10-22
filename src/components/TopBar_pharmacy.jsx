import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar_pharmacy.css';
import logo from '../assets/images/logo.png';

const TopBar_pharmacy = () => {
    const [greeting, setGreeting] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const hours = new Date().getHours();
        if (hours >= 5 && hours < 12) {
            setGreeting('Good Morning!');
        } else if (hours >= 12 && hours < 18) {
            setGreeting('Good Afternoon!');
        } else {
            setGreeting('Good Night!');
        }
    }, []);

    // Handle logout
    const handleLogout = () => {
        // Clear sessionStorage or localStorage depending on how login is managed
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isLoggedIn'); // If you use localStorage

        // Redirect to login page
        navigate('/login');
    };

    return (
        <div className="topbar">
            <div className="greeting-container">
                <span className="greeting">{greeting}</span>
                <span className="subtitle">Your Health, Our Priority</span>
            </div>

            <div className="right-section">
                <div className="user-info">
                    <img className="profile-image" src={logo} alt="Admin Profile" />
                    <span className="username">Pharmacist</span>

                    {/* Dropdown for logout */}
                    <div className="dropdown-container">
                        <span 
                            className="dropdown-toggle" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            ▼
                        </span>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar_pharmacy;
