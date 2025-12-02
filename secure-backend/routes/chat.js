/**
 * CHAT API ROUTES
 * 
 * SECURITY: API keys are read from process.env (from .env file)
 * NEVER hardcode API keys or send them to frontend!
 */

const express = require('express');
const router = express.Router();

/**
 * POST /api/chat
 * 
 * Handles chat requests using Google Gemini or OpenAI
 * API keys are securely stored in .env file
 */
router.post('/', async (req, res) => {
    try {
        const { messages, model } = req.body;

        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ 
                error: 'Invalid request: messages array is required' 
            });
        }

        // Determine which AI service to use
        const useGemini = model === 'gemini' || !model;
        
        if (useGemini) {
            // Use Google Gemini
            const response = await callGeminiAPI(messages);
            return res.json({ response, model: 'gemini' });
        } else {
            // Use OpenAI
            const response = await callOpenAI(messages);
            return res.json({ response, model: 'openai' });
        }

    } catch (error) {
        console.error('Chat API Error:', error.message);
        
        // NEVER expose API keys in error messages
        const safeError = error.message.includes('API key') 
            ? 'API configuration error. Please check backend .env file.'
            : error.message;
            
        res.status(500).json({ error: safeError });
    }
});

/**
 * Call Google Gemini API
 * API key is read from process.env.GEMINI_API_KEY
 */
async function callGeminiAPI(messages) {
    // Get API key from environment (NEVER hardcode!)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not found in .env file. Please add it to secure-backend/.env');
    }

    // Import Gemini SDK
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    
    // Initialize Gemini with API key from .env
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Convert messages to Gemini format
    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({ history });
    
    // Send message and get response
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    
    return response.text();
}

/**
 * Call OpenAI API
 * API key is read from process.env.OPENAI_API_KEY
 */
async function callOpenAI(messages) {
    // Get API key from environment (NEVER hardcode!)
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY not found in .env file. Please add it to secure-backend/.env');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // API key from .env only!
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

module.exports = router;
