const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./models/User');

const router = express.Router();

// Configure nodemailer with correct method name
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Test email configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.log('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP route
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide email address' });
        }

        // Check if user already exists and is verified
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save or update user with OTP
        if (existingUser) {
            existingUser.otp = otp;
            existingUser.otpExpires = otpExpires;
            await existingUser.save();
        } else {
            const newUser = new User({
                email,
                password: 'temp_password', // Will be updated during registration
                otp,
                otpExpires,
                isVerified: false
            });
            await newUser.save();
        }

        // Enhanced email options
        const mailOptions = {
            from: {
                name: 'Crypto Tracker',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: '🔐 Crypto Tracker - Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">Crypto Tracker Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <div style="background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #667eea; font-size: 32px; margin: 0;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
            text: `Your OTP for Crypto Tracker email verification is: ${otp}. This OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);

        res.status(200).json({ message: 'OTP sent successfully to your email' });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ 
            message: 'Error sending OTP. Please check your email configuration.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Verify OTP and Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        if (!email || !password || !otp) {
            return res.status(400).json({ message: 'Please provide email, password, and OTP' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found. Please send OTP first.' });
        }

        // Check if OTP is valid
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP is expired
        if (user.otpExpires < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        user.password = hashedPassword;
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(201).json({ message: 'Registration successful. You can now login.' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

module.exports = router;
