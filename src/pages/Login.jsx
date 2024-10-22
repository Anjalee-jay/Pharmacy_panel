import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure the CSS path is correct
import logo from '../assets/images/logo.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();

            // Pharmacy login credentials
            const pharmacyEmail = 'mediconnect@pharmacy.lk';
            const pharmacyPassword = 'mediconnect';

            if (trimmedEmail === pharmacyEmail && trimmedPassword === pharmacyPassword) {
                // Use sessionStorage to reset login status when session ends
                sessionStorage.setItem('isLoggedIn', 'true');

                // Successful login, navigate to the Pharmacy Dashboard
                navigate('/pharmacy-dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Failed to log in. Please try again.');
            console.error('Error logging in: ', err);
        }
    };

    return (
        <div className="home">
            <header className="header">
                <img src={logo} alt="Logo" className="logo" />
                <h1 className="header-title">MediConnect</h1>
                <h1 className="header-title2">Pharmacy Panel</h1>
            </header>

            <div className="main">
                <div className="login-section">
                    <h2 className="login-header">Login</h2>
                    {error && <div className="error-message">{error}</div>}
                    <label className="input-label" htmlFor="email">
                        Email
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label className="input-label" htmlFor="password">
                        Password
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button className="login-button" onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
