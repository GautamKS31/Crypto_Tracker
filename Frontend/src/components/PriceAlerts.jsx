const PriceAlerts = () => {
    return (
        <div className="section-container">
            <div className="section-header">
                <h2>🔔 Price Alerts & Notifications</h2>
                <button className="add-btn">+ Create Alert</button>
            </div>
            
            <div className="alerts-content">
                <div className="alert-types">
                    <div className="alert-type-card">
                        <span className="alert-icon">📈</span>
                        <h3>Price Target</h3>
                        <p>Get notified when a coin reaches your target price</p>
                    </div>
                    <div className="alert-type-card">
                        <span className="alert-icon">📉</span>
                        <h3>Price Drop</h3>
                        <p>Alert when price drops below a certain threshold</p>
                    </div>
                    <div className="alert-type-card">
                        <span className="alert-icon">🎯</span>
                        <h3>Percentage Change</h3>
                        <p>Monitor significant percentage movements</p>
                    </div>
                </div>

                <div className="active-alerts">
                    <h3>🎯 Active Alerts</h3>
                    <div className="empty-state">
                        <span className="empty-icon">🔕</span>
                        <p>No active alerts. Create your first price alert to stay informed!</p>
                        <button className="cta-btn">Set Up Alert</button>
                    </div>
                </div>

                <div className="notification-settings">
                    <h3>⚙️ Notification Settings</h3>
                    <div className="setting-item">
                        <span>📧 Email Notifications</span>
                        <label className="toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <span>📱 Push Notifications</span>
                        <label className="toggle">
                            <input type="checkbox" />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceAlerts;
