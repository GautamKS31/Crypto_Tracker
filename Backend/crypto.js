const express = require('express');
const axios = require('axios');
const router = express.Router();

// CoinGecko API base URL
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

// Rate limiting helper function
const rateLimitDelay = () => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    return Promise.resolve();
};

// Simple in-memory cache
let coinCache = {
    data: null,
    timestamp: 0,
    ttl: 60000 // 1 minute cache
};

const getCachedData = (cacheKey) => {
    const cache = coinCache;
    const now = Date.now();
    
    if (cache.data && (now - cache.timestamp) < cache.ttl) {
        return cache.data;
    }
    
    return null;
};

const setCachedData = (data) => {
    coinCache.data = data;
    coinCache.timestamp = Date.now();
};

// Get top 20 cryptocurrencies
router.get('/top-coins', async (req, res) => {
    try {
        // Check cache first
        const cachedData = getCachedData('top-coins');
        if (cachedData) {
            return res.status(200).json({
                success: true,
                data: cachedData,
                cached: true
            });
        }

        // Apply rate limiting
        await rateLimitDelay();
        lastRequestTime = Date.now();

        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 20,
                page: 1,
                sparkline: false,
                price_change_percentage: '1h,24h,7d' // Add 1h and 7d data
            },
            timeout: 10000
        });

        // Cache the response
        setCachedData(response.data);

        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching top coins:', error.message);
        
        if (error.response?.status === 429) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded. Please try again in a moment.',
                error: 'Too many requests'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cryptocurrency data',
            error: error.message
        });
    }
});

// Get specific coin details
router.get('/coin/:id', async (req, res) => {
    try {
        await rateLimitDelay(); // Apply rate limiting

        const { id } = req.params;
        const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${id}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: true
            }
        });

        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error(`Error fetching coin ${req.params.id}:`, error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coin data',
            error: error.message
        });
    } finally {
        lastRequestTime = Date.now();
    }
});

// Get trending coins
router.get('/trending', async (req, res) => {
    try {
        await rateLimitDelay(); // Apply rate limiting

        const response = await axios.get(`${COINGECKO_BASE_URL}/search/trending`);
        
        res.status(200).json({
            success: true,
            data: response.data.coins
        });
    } catch (error) {
        console.error('Error fetching trending coins:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trending coins',
            error: error.message
        });
    } finally {
        lastRequestTime = Date.now();
    }
});

// Get global crypto market data
router.get('/global', async (req, res) => {
    try {
        await rateLimitDelay(); // Apply rate limiting

        const response = await axios.get(`${COINGECKO_BASE_URL}/global`);
        
        res.status(200).json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        console.error('Error fetching global data:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch global market data',
            error: error.message
        });
    } finally {
        lastRequestTime = Date.now();
    }
});

// Get crypto news (using a simple news aggregator)
router.get('/news', async (req, res) => {
    try {
        // For demo purposes, returning mock news data
        // In production, you would integrate with a real news API
        const mockNews = [
            {
                id: 1,
                title: "Bitcoin Reaches New All-Time High",
                summary: "Bitcoin continues its bullish trend reaching unprecedented levels...",
                url: "https://coindesk.com/markets/2024/08/31/bitcoin-reaches-new-all-time-high/",
                published_at: new Date().toISOString(),
                source: "CryptoNews"
            },
            {
                id: 2,
                title: "Ethereum 2.0 Update Shows Promising Results",
                summary: "The latest Ethereum upgrade demonstrates improved performance...",
                url: "https://cointelegraph.com/news/ethereum-2-0-update-shows-promising-results",
                published_at: new Date(Date.now() - 3600000).toISOString(),
                source: "BlockchainDaily"
            },
            {
                id: 3,
                title: "Major Financial Institution Adopts Cryptocurrency",
                summary: "A leading bank announces cryptocurrency trading services...",
                url: "https://www.reuters.com/technology/major-financial-institution-adopts-cryptocurrency/",
                published_at: new Date(Date.now() - 7200000).toISOString(),
                source: "FinanceToday"
            }
        ];

        res.status(200).json({
            success: true,
            data: mockNews
        });
    } catch (error) {
        console.error('Error fetching news:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch news',
            error: error.message
        });
    }
});

module.exports = router;
