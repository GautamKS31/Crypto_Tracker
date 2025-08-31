import { useState } from 'react';

const Sidebar = ({ activeSection, onSectionChange }) => {
    const menuItems = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard', active: true },
        { id: 'portfolio', icon: '💼', label: 'Portfolio Management' },
        { id: 'watchlist', icon: '⭐', label: 'Watchlist & Favorites' },
        { id: 'alerts', icon: '🔔', label: 'Price Alerts & Notifications' },
        { id: 'news', icon: '📰', label: 'News Integration' }
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>🚀 Crypto Tracker</h2>
            </div>
            
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => onSectionChange(item.id)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="profile-avatar">👤</div>
                    <div className="profile-info">
                        <span className="profile-name">Trader</span>
                        <span className="profile-status">• Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
