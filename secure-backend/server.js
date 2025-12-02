/**
 * SECURE BACKEND SERVER
 * 
 * Security Rules:
 * 1. API keys are ONLY stored in .env file (NEVER in code)
 * 2. API keys are NEVER sent to frontend
 * 3. All external API calls happen on backend only
 * 4. Frontend only communicates with this backend
 */

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// ===========================
// SECURITY MIDDLEWARE
// ===========================

// Enable CORS for frontend (adjust origin in production)
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// ===========================
// ROUTES
// ===========================

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Chat API routes
app.use('/api/chat', chatRoutes);

// ===========================
// ERROR HANDLING
// ===========================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    
    // NEVER expose internal errors or API keys to client
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error',
        // In production, don't send stack traces
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ===========================
// START SERVER
// ===========================

app.listen(PORT, () => {
    console.log('=====================================');
    console.log('🔒 SECURE BACKEND SERVER');
    console.log('=====================================');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`✅ API endpoint: http://localhost:${PORT}/api/chat`);
    console.log('=====================================');
    
    // Verify environment variables are loaded
    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
        console.warn('⚠️  WARNING: No API keys found in .env file!');
        console.warn('⚠️  Please add your API keys to .env file');
    } else {
        console.log('✅ API keys loaded from .env');
    }
    
    console.log('=====================================');
});

module.exports = app;
