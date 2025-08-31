import { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            setMessage('Login successful!');
            
            // Call the success callback
            if (onLoginSuccess) {
                onLoginSuccess(response.data.user);
            }
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {message && (
                <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            
            <div className="form-group">
                <label htmlFor="email">📧 Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">🔒 Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
            </div>

            <button 
                type="submit" 
                className={`btn ${isLoading ? 'loading' : ''}`} 
                disabled={isLoading}
            >
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
    );
};

export default Login;
