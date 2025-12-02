const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Store conversation history
let messages = [];

// API Endpoint - automatically detect or use localhost
const API_URL = 'http://localhost:8000/api/chat';
const HEALTH_URL = 'http://localhost:8000/health';

// Connection status
let isServerConnected = false;

// Check server connection on load
window.addEventListener('load', checkServerConnection);

// Check server connection
async function checkServerConnection() {
    try {
        const response = await fetch(HEALTH_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (response.ok) {
            isServerConnected = true;
            updateConnectionStatus(true);
        } else {
            isServerConnected = false;
            updateConnectionStatus(false);
        }
    } catch (error) {
        isServerConnected = false;
        updateConnectionStatus(false);
    }
}

function updateConnectionStatus(connected) {
    const modelName = document.querySelector('.model-name');
    if (!modelName) return;
    
    // Remove any existing status indicator
    const existingIndicator = modelName.querySelector('.connection-status');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Add new status indicator
    const statusIndicator = document.createElement('span');
    statusIndicator.className = 'connection-status';
    statusIndicator.style.cssText = `
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-left: 8px;
        background: ${connected ? '#22c55e' : '#ef4444'};
        box-shadow: 0 0 8px ${connected ? '#22c55e' : '#ef4444'};
    `;
    statusIndicator.title = connected ? 'Server connected' : 'Server disconnected';
    modelName.appendChild(statusIndicator);
    
    // Only show warning if user tries to send a message without connection
    // Don't show warning automatically on page load
}

function appendMessage(content, isUser) {
    const rowDiv = document.createElement('div');
    rowDiv.className = `message-row ${isUser ? 'user' : 'bot'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Text Content
    const textDiv = document.createElement('div');
    textDiv.className = 'text-content';
    
    // Simple formatting for code blocks (basic)
    if (!isUser && content.includes('```')) {
        content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    }
    
    textDiv.innerHTML = content.replace(/\n/g, '<br>');
    
    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'Copy message';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(textDiv.innerText).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        });
    };

    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(copyBtn);
    rowDiv.appendChild(contentDiv);
    
    chatHistory.appendChild(rowDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Check connection before sending
    if (!isServerConnected) {
        appendMessage('⚠️ Cannot connect to server. Please start the backend:\n\n• Double-click START_BACKEND.bat\n• Or run: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000', false);
        return;
    }

    // Add user message to UI
    appendMessage(text, true);
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;
    typingIndicator.style.display = 'block';

    // Add to history
    messages.push({ role: 'user', content: text });

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                messages: messages
            }),
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMsg = errorData.detail || `Server error: ${response.status} ${response.statusText}`;
            
            // Make API key errors more prominent
            if (errorMsg.includes('API Key Error') || errorMsg.includes('API key')) {
                errorMsg = '🔑 ' + errorMsg;
            }
            
            throw new Error(errorMsg);
        }

        const data = await response.json();
        const botReply = data.response;

        // Add bot message to UI
        appendMessage(botReply, false);
        
        // Add to history
        messages.push({ role: 'assistant', content: botReply });

    } catch (error) {
        console.error('Error:', error);
        
        // Remove the user message from history since request failed
        messages.pop();
        
        let errorMessage = 'Failed to connect to the server. ';
        
        if (error.message.includes('fetch')) {
            errorMessage += 'Please ensure:\n';
            errorMessage += '1. The backend server is running (run: python backend/main.py)\n';
            errorMessage += '2. The server is accessible at http://localhost:8000\n';
            errorMessage += '3. CORS is properly configured';
        } else {
            errorMessage += error.message;
        }
        
        appendMessage(errorMessage, false);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        typingIndicator.style.display = 'none';
        userInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Sidebar Toggle Logic (Mobile & Desktop)
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            // Mobile: Toggle overlay
            sidebar.classList.toggle('active');
        } else {
            // Desktop: Toggle collapse
            sidebar.classList.toggle('collapsed');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
}


// Supabase integration will be added fresh with the new project tomorrow.

// Modal Logic
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

if (loginModal && loginBtn && closeModalBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

// Sign Up Modal Logic
const signUpModal = document.getElementById('signUpModal');
const closeSignUpModalBtn = document.getElementById('closeSignUpModalBtn');
const signUpLink = document.getElementById('signUpLink');
const signInLink = document.getElementById('signInLink');

if (signUpModal && signUpLink && signInLink) {
    // Open Sign Up from Login
    signUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signUpModal.classList.add('active');
    });

    // Open Login from Sign Up
    signInLink.addEventListener('click', (e) => {
        e.preventDefault();
        signUpModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Close Sign Up
    closeSignUpModalBtn.addEventListener('click', () => {
        signUpModal.classList.remove('active');
    });

    // Close when clicking outside
    signUpModal.addEventListener('click', (e) => {
        if (e.target === signUpModal) {
            signUpModal.classList.remove('active');
        }
    });
}

// Placeholder Handlers
function handleLogin() {
    alert("Supabase integration will be added fresh with the new project tomorrow.");
    document.getElementById('loginModal').classList.remove('active');
}

function handleSignUp() {
    alert("Supabase integration will be added fresh with the new project tomorrow.");
    document.getElementById('signUpModal').classList.remove('active');
}

