// src/components/SideBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaUserInjured, FaCalendarAlt, FaCalendarCheck, FaPills, FaFileAlt, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import './SideBar_pharmacy.css';
import logo from '../assets/images/logo.png';  // Make sure this path is correct

const SideBar = () => {
    return (
        <div className="sidebar">
    <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-image" />
        <div className="logo-text">
            <span className="logo-medi">Medi</span>
            <span className="logo-connect">Connect</span>
        </div>
    </div>
    <ul>
        <li><Link to="/dashboard"><FaUserMd className="icon" /> Dashboard</Link></li>
       
        <li><Link to="/prescription"><FaFileAlt className="icon" /> Prescription</Link></li>
       
    </ul>
</div>

    
    );
};

export default SideBar;
