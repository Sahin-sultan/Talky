/**
 * SECURE FRONTEND APPLICATION
 * 
 * SECURITY RULES:
 * 1. NEVER call external APIs directly (Google, OpenAI, etc.)
 * 2. ONLY call our backend endpoint: /api/chat
 * 3. NEVER hardcode or store API keys in frontend code
 * 4. Backend handles all API key management
 */

// Configuration - ONLY backend endpoint!
const API_BASE_URL = 'http://localhost:5000';
const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;
const HEALTH_ENDPOINT = `${API_BASE_URL}/health`;

// DOM Elements
const chatArea = document.getElementById('chatArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const connectionStatus = document.getElementById('connectionStatus');

// Conversation history
let messages = [];

/**
 * Check backend server connection
 */
async function checkConnection() {
    try {
        const response = await fetch(HEALTH_ENDPOINT);
        const data = await response.json();
        
        if (data.status === 'ok') {
            connectionStatus.className = 'connection-status connected';
            connectionStatus.title = 'Connected to backend';
            return true;
        }
    } catch (error) {
        connectionStatus.className = 'connection-status disconnected';
        connectionStatus.title = 'Backend server is offline';
        console.error('Backend connection failed:', error);
        return false;
    }
}

/**
 * Add message to chat UI
 */
function addMessage(content, type = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTyping(show) {
    let typingDiv = document.querySelector('.typing');
    
    if (show && !typingDiv) {
        typingDiv = document.createElement('div');
        typingDiv.className = 'typing';
        typingDiv.textContent = 'AI is thinking...';
        chatArea.appendChild(typingDiv);
    } else if (!show && typingDiv) {
        typingDiv.remove();
    }
    
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * Send message to backend
 * 
 * SECURITY: This ONLY calls our backend endpoint
 * NEVER calls Google/OpenAI directly!
 */
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Check backend connection first
    const isConnected = await checkConnection();
    if (!isConnected) {
        addMessage('❌ Backend server is offline. Please start the backend server first.', 'error');
        return;
    }

    // Add user message to UI
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Add to conversation history
    messages.push({ role: 'user', content: message });
    
    // Disable input while processing
    messageInput.disabled = true;
    sendBtn.disabled = true;
    showTyping(true);

    try {
        // SECURITY: Only call OUR backend, never external APIs!
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // NO API keys in headers! Backend handles that.
            },
            body: JSON.stringify({
                messages: messages,
                model: 'gemini' // or 'openai'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Server error');
        }

        const data = await response.json();
        
        // Add AI response to UI
        addMessage(data.response, 'bot');
        
        // Add to conversation history
        messages.push({ role: 'assistant', content: data.response });

    } catch (error) {
        console.error('Chat error:', error);
        
        // User-friendly error messages
        let errorMsg = error.message;
        
        if (error.message.includes('fetch')) {
            errorMsg = '❌ Cannot connect to backend server. Make sure it\'s running on port 5000.';
        } else if (error.message.includes('API key')) {
            errorMsg = '❌ API key not configured. Please add your API key to secure-backend/.env file.';
        }
        
        addMessage(errorMsg, 'error');
        
        // Remove failed message from history
        messages.pop();
        
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        sendBtn.disabled = false;
        showTyping(false);
        messageInput.focus();
    }
}

/**
 * Event Listeners
 */
sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Check connection on page load
window.addEventListener('load', () => {
    checkConnection();
    messageInput.focus();
    
    // Add welcome message
    setTimeout(() => {
        addMessage('Hello! I\'m your secure AI assistant. How can I help you today?', 'bot');
    }, 500);
});

// Periodic connection check
setInterval(checkConnection, 30000); // Check every 30 seconds

/**
 * SECURITY VERIFICATION
 * 
 * This code demonstrates proper security practices:
 * ✅ No API keys in frontend code
 * ✅ Only calls backend endpoint (/api/chat)
 * ✅ No direct calls to external APIs
 * ✅ Backend handles all API key management
 * ✅ Proper error handling without exposing sensitive info
 */

console.log('🔒 Security Check:');
console.log('✅ No API keys in frontend code');
console.log('✅ Only calling backend endpoint:', CHAT_ENDPOINT);
console.log('✅ Backend handles all external API calls');
