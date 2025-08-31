const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const router = express.Router();

// Login route with JWT authentication
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email 
            },
            process.env.JWT_SECRET,
            { 
                expiresIn: '24h' // Token expires in 24 hours
            }
        );

        // Send success response with JWT token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        });

        console.log(`User logged in successfully: ${email}`);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// JWT Token verification middleware (optional - for protecting routes)
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Protected route example (you can use this for dashboard or other protected routes)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -otp');
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Token validation route
router.post('/verify-token', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ 
            valid: true, 
            user: {
                id: decoded.userId,
                email: decoded.email
            }
        });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});

module.exports = router;
