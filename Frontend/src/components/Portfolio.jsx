const Portfolio = () => {
    return (
        <div className="section-container">
            <div className="section-header">
                <h2>💼 Portfolio Management</h2>
                <button className="add-btn">+ Add Holdings</button>
            </div>
            
            <div className="portfolio-stats">
                <div className="stat-card">
                    <h3>Total Portfolio Value</h3>
                    <p className="stat-value">$12,450.00</p>
                    <span className="stat-change positive">+5.2% (24h)</span>
                </div>
                <div className="stat-card">
                    <h3>Total Holdings</h3>
                    <p className="stat-value">8 Assets</p>
                    <span className="stat-change">Diversified</span>
                </div>
                <div className="stat-card">
                    <h3>Best Performer</h3>
                    <p className="stat-value">ETH</p>
                    <span className="stat-change positive">+12.4%</span>
                </div>
            </div>

            <div className="portfolio-table">
                <h3>Your Holdings</h3>
                <div className="empty-state">
                    <span className="empty-icon">📊</span>
                    <p>No holdings yet. Start tracking your crypto portfolio!</p>
                    <button className="cta-btn">Add Your First Holding</button>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
