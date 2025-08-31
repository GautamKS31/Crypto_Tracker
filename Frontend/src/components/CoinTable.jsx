import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CoinTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const isRequestingRef = useRef(false);

    // Load watchlist from localStorage on component mount
    useEffect(() => {
        fetchTopCoins();
        loadWatchlist();
    }, []);

    const fetchTopCoins = async () => {
        // Prevent multiple simultaneous requests
        if (isRequestingRef.current) {
            return;
        }

        try {
            isRequestingRef.current = true;
            setLoading(true);
            setError(null);
            
            const response = await axios.get('http://localhost:5000/api/crypto/top-coins');
            
            if (response.data.success) {
                setCoins(response.data.data);
            } else {
                setError('Failed to fetch coin data');
            }
        } catch (error) {
            console.error('Error fetching coins:', error);
            
            // Handle specific error types
            if (error.response?.status === 429) {
                setError('Rate limit exceeded. Please wait a moment before refreshing.');
            } else if (error.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Failed to fetch cryptocurrency data');
            }
        } finally {
            setLoading(false);
            isRequestingRef.current = false;
        }
    };

    const loadWatchlist = () => {
        const savedWatchlist = localStorage.getItem('crypto_watchlist');
        if (savedWatchlist) {
            setWatchlist(JSON.parse(savedWatchlist));
        }
    };

    const addToWatchlist = (coin) => {
        const newWatchlist = [...watchlist, {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.image,
            current_price: coin.current_price,
            price_change_percentage_24h: coin.price_change_percentage_24h,
            market_cap_rank: coin.market_cap_rank
        }];
        
        setWatchlist(newWatchlist);
        localStorage.setItem('crypto_watchlist', JSON.stringify(newWatchlist));
        
        // Show success message
        alert(`${coin.name} added to watchlist!`);
    };

    const isInWatchlist = (coinId) => {
        return watchlist.some(coin => coin.id === coinId);
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

    const formatMarketCap = (marketCap) => {
        if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
        if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
        if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
        return `$${marketCap?.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="coin-table-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading cryptocurrency data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="coin-table-container">
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchTopCoins} className="retry-btn">
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="coin-table-container">
            <div className="table-header">
                <h2>🏆 Top 20 Cryptocurrencies</h2>
                <button onClick={fetchTopCoins} className="refresh-btn">
                    🔄 Refresh
                </button>
            </div>

            <div className="table-wrapper">
                <table className="coin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Coin</th>
                            <th>Price</th>
                            <th>1h %</th>
                            <th>24h %</th>
                            <th>7d %</th>
                            <th>Market Cap</th>
                            <th>Volume (24h)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.map((coin, index) => (
                            <tr key={coin.id} className="coin-row">
                                <td className="rank">{coin.market_cap_rank}</td>
                                <td className="coin-info">
                                    <img 
                                        src={coin.image} 
                                        alt={coin.name}
                                        className="coin-image"
                                    />
                                    <div className="coin-details">
                                        <span className="coin-name">{coin.name}</span>
                                        <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                                    </div>
                                </td>
                                <td className="price">{formatPrice(coin.current_price)}</td>
                                <td className={`percentage ${coin.price_change_percentage_1h_in_currency >= 0 ? 'positive' : 'negative'}`}>
                                    {formatPercentage(coin.price_change_percentage_1h_in_currency)}
                                </td>
                                <td className={`percentage ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                                    {formatPercentage(coin.price_change_percentage_24h)}
                                </td>
                                <td className={`percentage ${coin.price_change_percentage_7d_in_currency >= 0 ? 'positive' : 'negative'}`}>
                                    {formatPercentage(coin.price_change_percentage_7d_in_currency)}
                                </td>
                                <td className="market-cap">{formatMarketCap(coin.market_cap)}</td>
                                <td className="volume">{formatMarketCap(coin.total_volume)}</td>
                                <td className="actions">
                                    <button 
                                        className={`action-btn watch-btn ${isInWatchlist(coin.id) ? 'added' : ''}`}
                                        title={isInWatchlist(coin.id) ? 'Already in Watchlist' : 'Add to Watchlist'}
                                        onClick={() => !isInWatchlist(coin.id) && addToWatchlist(coin)}
                                        disabled={isInWatchlist(coin.id)}
                                    >
                                        {isInWatchlist(coin.id) ? '✅' : '⭐'}
                                    </button>
                                    <button className="action-btn alert-btn" title="Set Price Alert">
                                        🔔
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoinTable;