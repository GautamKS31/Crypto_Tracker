import { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitchToLogin }) => {
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Register with OTP
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        otp: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/auth/send-otp', {
                email: formData.email
            });
            
            setMessage('OTP sent to your email successfully!');
            setStep(2);
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                email: formData.email,
                password: formData.password,
                otp: formData.otp
            });
            
            setMessage('Registration successful! You can now login.');
            
            // Switch to login after successful registration
            setTimeout(() => {
                if (onSwitchToLogin) {
                    onSwitchToLogin();
                }
            }, 2000);
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 1) {
        return (
            <form onSubmit={handleSendOTP}>
                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
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

                <button 
                    type="submit" 
                    className={`btn ${isLoading ? 'loading' : ''}`} 
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending OTP...' : '📤 Send OTP'}
                </button>
            </form>
        );
    }

    return (
        <div>
            {message && (
                <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            
            <div className="otp-section">
                <p>📱 OTP has been sent to: <strong>{formData.email}</strong></p>
                <p style={{ fontSize: '14px', color: '#718096', marginTop: '5px' }}>
                    Check your email and enter the 6-digit code below
                </p>
                
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="otp">🔐 Enter OTP</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">🔒 Create Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            minLength="6"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`btn ${isLoading ? 'loading' : ''}`} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : '🎉 Create Account'}
                    </button>
                </form>
                
                <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setStep(1)}
                    style={{ 
                        background: 'linear-gradient(135deg, #718096, #4a5568)',
                        marginTop: '10px'
                    }}
                >
                    ← Back to Email
                </button>
            </div>
        </div>
    );
};

export default Register;
