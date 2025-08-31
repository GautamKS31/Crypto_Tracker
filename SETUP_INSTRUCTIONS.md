# Crypto Tracker - MERN Stack Authentication Project

A beginner-friendly MERN stack application with JWT authentication, email verification using SMTP, and MongoDB Atlas integration.

## Project Structure

```
Crypto_Tracker/
├── Backend/
│   ├── models/
│   │   └── User.js              # User schema for MongoDB
│   ├── server.js                # Main backend server file
│   ├── login_page.js            # Login authentication logic
│   ├── register.js              # Registration and OTP logic
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx         # Login component
    │   │   ├── Register.jsx      # Registration component
    │   │   └── Dashboard.jsx     # Dashboard component
    │   ├── App.jsx               # Main React app
    │   ├── index.css             # Global styles
    │   └── main.jsx              # React entry point
    ├── package.json              # Frontend dependencies
    └── index.html                # HTML template
```

## Features

- **Authentication**: JWT-based login/logout
- **Email Verification**: OTP sent via SMTP (Gmail)
- **Database**: MongoDB Atlas integration
- **Frontend**: React with simple, beginner-friendly design
- **Backend**: Express.js with separate route files

## Setup Instructions

### 1. Prerequisites

- Node.js installed on your system
- MongoDB Atlas account
- Gmail account for SMTP

### 2. Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/crypto_tracker?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   ```

4. **MongoDB Atlas Setup**:
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string and replace `MONGODB_URI`

5. **Gmail SMTP Setup**:
   - Enable 2-factor authentication on your Gmail account
   - Generate an "App Password" for your application
   - Use your Gmail address for `EMAIL_USER`
   - Use the app password for `EMAIL_PASS`

6. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Testing the Application

1. Backend should run on `http://localhost:5000`
2. Frontend should run on `http://localhost:5173`
3. Open your browser and go to the frontend URL

## How to Use

### Registration Process:
1. Click on "Register" tab
2. Enter your email address
3. Click "Send OTP"
4. Check your email for the 6-digit OTP
5. Enter the OTP and create a password
6. Click "Register"
7. You'll be redirected to login

### Login Process:
1. Click on "Login" tab
2. Enter your registered email and password
3. Click "Login"
4. You'll be redirected to the dashboard

## API Endpoints

### Authentication Routes:
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/register` - Register with OTP verification
- `POST /api/auth/login` - User login

## Troubleshooting

1. **MongoDB Connection Issues**:
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username and password

2. **Email Not Sending**:
   - Verify Gmail app password is correct
   - Check if 2FA is enabled on Gmail
   - Ensure EMAIL_USER and EMAIL_PASS are set correctly

3. **CORS Issues**:
   - Backend includes CORS middleware for frontend requests

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer, bcryptjs
- **Frontend**: React, Axios, React Router DOM
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: SMTP via Gmail

## Next Steps

After authentication is working, you can extend this project with:
- Real-time cryptocurrency price tracking
- User portfolio management
- Price alerts and notifications
- Market trend analysis
