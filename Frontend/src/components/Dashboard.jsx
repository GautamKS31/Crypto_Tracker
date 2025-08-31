import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CoinTable from './CoinTable';
import Portfolio from './Portfolio';
import Watchlist from './Watchlist';
import PriceAlerts from './PriceAlerts';
import NewsIntegration from './NewsIntegration';

const Dashboard = ({ user, onLogout }) => {
    const [userData, setUserData] = useState(user || null);
    const [activeSection, setActiveSection] = useState('dashboard');

    useEffect(() => {
        // If no user passed as prop, try to get from localStorage
        if (!userData) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            }
        }
    }, [userData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onLogout) {
            onLogout();
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <CoinTable />;
            case 'portfolio':
                return <Portfolio />;
            case 'watchlist':
                return <Watchlist onSwitchSection={handleSectionChange} />;
            case 'alerts':
                return <PriceAlerts />;
            case 'news':
                return <NewsIntegration />;
            default:
                return <CoinTable />;
        }
    };

    if (!userData) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar 
                activeSection={activeSection} 
                onSectionChange={handleSectionChange} 
            />
            
            <div className="main-content">
                <div className="top-bar">
                    <div className="welcome-section">
                        <h1>Welcome back, {userData.email?.split('@')[0]}!</h1>
                        <p>Track your crypto portfolio and stay updated with market trends</p>
                    </div>
                    
                    <div className="user-actions">
                        <div className="user-info">
                            <span className="user-email">{userData.email}</span>
                            <span className="user-status">✅ Verified</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            🚪 Logout
                        </button>
                    </div>
                </div>
                
                <div className="content-area">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
