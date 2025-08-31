import { useState, useEffect } from 'react';
import axios from 'axios';

const NewsIntegration = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [savedArticles, setSavedArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNews, setFilteredNews] = useState([]);

    useEffect(() => {
        fetchNews();
        loadSavedArticles();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/crypto/news');
            
            if (response.data.success) {
                setNews(response.data.data);
                setFilteredNews(response.data.data); // Add this line
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSavedArticles = () => {
        const saved = localStorage.getItem('saved_articles');
        if (saved) {
            setSavedArticles(JSON.parse(saved));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        // Add logic to filter news based on category
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        // Filter news based on category
        const filteredNews = filterNewsByCategory(news, category);
        // You might want to create a separate state for filtered news
    };

    const handleSaveArticle = (article) => {
        const isAlreadySaved = savedArticles.some(saved => saved.id === article.id);
        
        if (isAlreadySaved) {
            // Remove from saved
            const updated = savedArticles.filter(saved => saved.id !== article.id);
            setSavedArticles(updated);
            localStorage.setItem('saved_articles', JSON.stringify(updated));
            alert('Article removed from saved articles');
        } else {
            // Add to saved
            const updated = [...savedArticles, article];
            setSavedArticles(updated);
            localStorage.setItem('saved_articles', JSON.stringify(updated));
            alert('Article saved successfully!');
        }
    };

    const handleShareArticle = (article) => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.summary,
                url: article.url || window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = `${article.title}\n\n${article.summary}\n\nRead more: ${article.url || window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Article link copied to clipboard!');
            }).catch(() => {
                alert('Share feature not supported. Article details copied to console.');
                console.log('Share:', shareText);
            });
        }
    };

    const isArticleSaved = (articleId) => {
        return savedArticles.some(saved => saved.id === articleId);
    };

    const handleTopicClick = (topic) => {
        alert(`Searching for ${topic} related news...`);
        // In a real app, this would filter news by the selected topic
    };

    const filterNewsByCategory = (newsArray, category) => {
        if (category === 'all') return newsArray;
        
        return newsArray.filter(article => {
            const titleLower = article.title.toLowerCase();
            const summaryLower = article.summary.toLowerCase();
            
            switch (category) {
                case 'bitcoin':
                    return titleLower.includes('bitcoin') || titleLower.includes('btc') || 
                           summaryLower.includes('bitcoin') || summaryLower.includes('btc');
                case 'ethereum':
                    return titleLower.includes('ethereum') || titleLower.includes('eth') || 
                           summaryLower.includes('ethereum') || summaryLower.includes('eth');
                case 'defi':
                    return titleLower.includes('defi') || titleLower.includes('decentralized') || 
                           summaryLower.includes('defi') || summaryLower.includes('decentralized');
                case 'nfts':
                    return titleLower.includes('nft') || titleLower.includes('token') || 
                           summaryLower.includes('nft') || summaryLower.includes('token');
                default:
                    return true;
            }
        });
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Filter news based on search term
        const filtered = news.filter(article => {
            return article.title.toLowerCase().includes(value.toLowerCase()) ||
                   article.summary.toLowerCase().includes(value.toLowerCase());
        });

        setFilteredNews(filtered);
    };

    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
        
        if (!searchValue.trim()) {
            setFilteredNews(news);
            return;
        }
        
        const filtered = news.filter(article => {
            const titleLower = article.title.toLowerCase();
            const summaryLower = article.summary.toLowerCase();
            const searchLower = searchValue.toLowerCase();
            
            return titleLower.includes(searchLower) || summaryLower.includes(searchLower);
        });
        
        setFilteredNews(filtered);
    };

    const getDisplayNews = () => {
        let displayNews = filteredNews.length > 0 || searchTerm ? filteredNews : news;
        return filterNewsByCategory(displayNews, activeCategory);
    };

    const displayedNews = searchTerm ? filteredNews : filterNewsByCategory(news, activeCategory);

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>📰 News Integration</h2>
                <button onClick={fetchNews} className="refresh-btn">🔄 Refresh</button>
            </div>
            
            <div className="news-content">
                <div className="news-categories">
                    <button 
                        className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('all')}
                    >
                        📈 All News
                    </button>
                    <button 
                        className={`category-btn ${activeCategory === 'bitcoin' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('bitcoin')}
                    >
                        ₿ Bitcoin
                    </button>
                    <button 
                        className={`category-btn ${activeCategory === 'ethereum' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('ethereum')}
                    >
                        Ξ Ethereum
                    </button>
                    <button 
                        className={`category-btn ${activeCategory === 'defi' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('defi')}
                    >
                        🏛️ DeFi
                    </button>
                    <button 
                        className={`category-btn ${activeCategory === 'nfts' ? 'active' : ''}`}
                        onClick={() => handleCategoryChange('nfts')}
                    >
                        🎨 NFTs
                    </button>
                </div>

                <div className="news-search">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="🔍 Search news articles..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search"
                                onClick={() => handleSearch('')}
                            >
                                ✖️
                            </button>
                        )}
                    </div>
                </div>

                <div className="news-list">
                    {loading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading latest news...</p>
                        </div>
                    ) : (
                        getDisplayNews().length > 0 ? (
                            getDisplayNews().map((article) => (
                                <div key={article.id} className="news-item">
                                    <div className="news-content-wrapper">
                                        <div className="news-header">
                                            <h3 className="news-title">{article.title}</h3>
                                            <span className="news-source">{article.source}</span>
                                        </div>
                                        <p className="news-summary">{article.summary}</p>
                                        <div className="news-footer">
                                            <span className="news-time">{formatDate(article.published_at)}</span>
                                            <div className="news-actions">
                                                <button 
                                                    className="news-action"
                                                    onClick={() => handleSaveArticle(article)}
                                                >
                                                    {isArticleSaved(article.id) ? '🔖 Saved' : '🔖 Save'}
                                                </button>
                                                <button 
                                                    className="news-action"
                                                    onClick={() => handleShareArticle(article)}
                                                >
                                                    📤 Share
                                                </button>
                                                <a 
                                                    href={article.url === '#' ? 'https://coindesk.com' : article.url}
                                                    className="news-action read-more"
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    📖 Read More
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <span className="empty-icon">📰</span>
                                <p>No news found for "{searchTerm || activeCategory}". Try a different search term or category.</p>
                            </div>
                        )
                    )}
                </div>

                <div className="trending-topics">
                    <h3>🔥 Trending Topics</h3>
                    <div className="topic-tags">
                        <span 
                            className="topic-tag"
                            onClick={() => handleTopicClick('Bitcoin')}
                        >
                            #Bitcoin
                        </span>
                        <span 
                            className="topic-tag"
                            onClick={() => handleTopicClick('Ethereum')}
                        >
                            #Ethereum
                        </span>
                        <span 
                            className="topic-tag"
                            onClick={() => handleTopicClick('DeFi')}
                        >
                            #DeFi
                        </span>
                        <span 
                            className="topic-tag"
                            onClick={() => handleTopicClick('NFT')}
                        >
                            #NFT
                        </span>
                        <span 
                            className="topic-tag"
                            onClick={() => handleTopicClick('Regulation')}
                        >
                            #Regulation
                        </span>
                        <span 
                            className="topic-tag"
                            onClick={() => handleTopicClick('Adoption')}
                        >
                            #Adoption
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsIntegration;
