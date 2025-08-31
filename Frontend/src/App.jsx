import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Don't auto-login, always require fresh login on app restart
    setCurrentView('login');
    setIsAuthenticated(false);
    setUser(null);
    
    // Keep tokens in localStorage for other purposes but don't use them for auto-login
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  if (isAuthenticated && currentView === 'dashboard') {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="container">
      <div className="auth-container">
        <h2>Crypto Tracker</h2>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${currentView === 'login' ? 'active' : ''}`}
            onClick={handleSwitchToLogin}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${currentView === 'register' ? 'active' : ''}`}
            onClick={handleSwitchToRegister}
          >
            Register
          </button>
        </div>

        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'register' && (
          <Register onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>
    </div>
  );
}

export default App;
