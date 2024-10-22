import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import SideBar_pharmacy from './components/SideBar_pharmacy';
import TopBar_pharmacy from './components/TopBar_pharmacy';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard_pharmacy';
import Prescription from './pages/Prescription_pharmacy';
import View from './pages/View';
import PSummary from './pages/psummary';

function AppContent() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    // Check if the user is logged in by checking sessionStorage
    const isLoggedIn = !!sessionStorage.getItem('isLoggedIn');

    // Redirect to login if not logged in and trying to access other pages
    if (!isLoggedIn && !isLoginPage) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ display: 'flex' }}>
            {!isLoginPage && <SideBar_pharmacy />}
            <div style={{ flex: 1, marginLeft: !isLoginPage ? '250px' : '0', paddingTop: !isLoginPage ? '60px' : '0' }}>
                {!isLoginPage && <TopBar_pharmacy />}
                <div style={{ marginTop: !isLoginPage ? '60px' : '0' }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/prescription" element={<Prescription />} />
                        <Route path="/view" element={<View />} />
                        <Route path="/psummary" element={<PSummary />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
