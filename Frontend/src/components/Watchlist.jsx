import { useState, useEffect } from 'react';

const Watchlist = ({ onSwitchSection }) => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        loadWatchlist();
    }, []);

    const loadWatchlist = () => {
        const savedWatchlist = localStorage.getItem('crypto_watchlist');
        if (savedWatchlist) {
            setWatchlist(JSON.parse(savedWatchlist));
        }
    };

    const removeFromWatchlist = (coinId) => {
        const updatedWatchlist = watchlist.filter(coin => coin.id !== coinId);
        setWatchlist(updatedWatchlist);
        localStorage.setItem('crypto_watchlist', JSON.stringify(updatedWatchlist));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(price);
    };

    const formatPercentage = (percentage) => {
        if (!percentage) return 'N/A';
        const formatted = percentage.toFixed(2);
        return `${formatted >= 0 ? '+' : ''}${formatted}%`;
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>⭐ Watchlist & Favorites</h2>
                <span className="watchlist-count">{watchlist.length} coins</span>
            </div>
            
            <div className="watchlist-content">
                {watchlist.length > 0 ? (
                    <>
                        <div className="favorites-section">
                            <h3>⚡ Your Watchlist</h3>
                            <div className="favorite-coins">
                                {watchlist.map((coin) => (
                                    <div key={coin.id} className="favorite-coin">
                                        <img src={coin.image} alt={coin.name} />
                                        <div className="coin-info">
                                            <span className="name">{coin.name}</span>
                                            <span className="symbol">{coin.symbol.toUpperCase()}</span>
                                            <span className="price">{formatPrice(coin.current_price)}</span>
                                        </div>
                                        <div className="coin-stats">
                                            <span className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                                                {formatPercentage(coin.price_change_percentage_24h)}
                                            </span>
                                            <span className="rank">#{coin.market_cap_rank}</span>
                                        </div>
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeFromWatchlist(coin.id)}
                                            title="Remove from watchlist"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">👀</span>
                        <p>Your watchlist is empty. Add coins from the dashboard to track their performance!</p>
                        <button className="cta-btn" onClick={() => onSwitchSection && onSwitchSection('dashboard')}>
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
