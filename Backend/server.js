const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.log('MongoDB connection error:', err.message);
        console.log('Please check:');
        console.log('1. Your internet connection');
        console.log('2. MongoDB Atlas IP whitelist');
        console.log('3. Correct username/password in connection string');
    });

// Routes
const loginRoutes = require('./login_page');
const registerRoutes = require('./register');
const cryptoRoutes = require('./crypto');

app.use('/api/auth', loginRoutes);
app.use('/api/auth', registerRoutes);
app.use('/api/crypto', cryptoRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Crypto Tracker Backend API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
