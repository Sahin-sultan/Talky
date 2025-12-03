const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Store conversation history
let messages = [];

// VERSION CHECK - Port 8080
console.log('🔧 Script loaded');
console.log('🕒 Script version:', new Date().toISOString());

// API Endpoint Configuration
// For production: Set your backend URL here
const BACKEND_URL = 'http://localhost:8080'; // Change this to your production backend URL

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? BACKEND_URL
    : BACKEND_URL;  // Use BACKEND_URL for production

const API_URL = `${API_BASE}/api/chat`;
const HEALTH_URL = `${API_BASE}/api/health`;

console.log('📡 API_URL:', API_URL);
console.log('❤️ HEALTH_URL:', HEALTH_URL);
console.log('🌐 Current page:', window.location.href);

// Connection status
let isServerConnected = false;

// Check user login status and update UI
async function checkUserLoginStatus() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session && session.user) {
            // User is logged in
            const user = session.user;
            const profile = await getUserProfile(user.id);
            
            // Hide login button, show user profile
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('userProfile').style.display = 'block';
            
            // Update user avatar and dropdown
            const userName = profile?.full_name || user.email.split('@')[0];
            const firstLetter = userName.charAt(0).toUpperCase();
            
            document.getElementById('userAvatar').textContent = firstLetter;
            document.getElementById('dropdownAvatar').textContent = firstLetter;
            document.getElementById('dropdownName').textContent = profile?.full_name || userName;
            document.getElementById('dropdownEmail').textContent = user.email;
            
            // Check if we should show welcome animation (after login)
            const showAnimation = sessionStorage.getItem('showWelcomeAnimation') === 'true';
            if (showAnimation) {
                sessionStorage.removeItem('showWelcomeAnimation');
                
                // Trigger particle animation
                if (typeof createWelcomeParticles === 'function') {
                    setTimeout(() => {
                        createWelcomeParticles();
                    }, 300);
                }
            }
            
            // Update welcome message with user's name (with animation if just logged in)
            updateWelcomeMessage(profile?.full_name || userName, showAnimation);
        } else {
            // User is not logged in
            document.getElementById('loginBtn').style.display = 'flex';
            document.getElementById('userProfile').style.display = 'none';
            
            // Default welcome message
            updateWelcomeMessage(null);
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        // Show login button on error
        document.getElementById('loginBtn').style.display = 'flex';
        document.getElementById('userProfile').style.display = 'none';
        updateWelcomeMessage(null);
    }
}

// Update welcome message with user's name
function updateWelcomeMessage(userName, showAnimation = false) {
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg) {
        const textContent = welcomeMsg.querySelector('.text-content');
        
        if (userName) {
            // Add animation classes
            if (showAnimation) {
                welcomeMsg.classList.add('welcome-animation');
                textContent.classList.add('welcome-shimmer');
                
                // Remove shimmer after animation completes
                setTimeout(() => {
                    textContent.classList.remove('welcome-shimmer');
                }, 2000);
                
                // Remove animation class after it completes
                setTimeout(() => {
                    welcomeMsg.classList.remove('welcome-animation');
                }, 800);
            }
            
            // Create animated welcome message
            const welcomeHTML = `
                <span style="display: inline-block; animation: scaleIn 0.5s ease-out;">Hello</span>
                <strong style="display: inline-block; animation: scaleIn 0.6s ease-out; color: #5b7cff; text-shadow: 0 0 10px rgba(91, 124, 255, 0.5);">${userName}</strong>!
                <span style="display: inline-block; animation: scaleIn 0.7s ease-out;">👋</span>
                <br>
                <span style="display: inline-block; animation: slideInUp 0.8s ease-out;">Welcome back to</span>
                <span style="display: inline-block; animation: scaleIn 0.9s ease-out; color: #5b7cff; font-weight: 600;">Talky 0.1</span>
                <br>
                <span style="display: inline-block; animation: fadeIn 1s ease-out;">How can I help you today?</span>
            `;
            
            textContent.innerHTML = welcomeHTML;
            
            // Add pulse effect to the entire message
            if (showAnimation) {
                setTimeout(() => {
                    welcomeMsg.classList.add('welcome-pulse');
                    setTimeout(() => {
                        welcomeMsg.classList.remove('welcome-pulse');
                    }, 600);
                }, 1000);
            }
        } else {
            textContent.innerHTML = 'Hello! I\'m Talky 0.1. How can I help you today?';
        }
    }
}

// Toggle profile dropdown menu
function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const userProfile = document.getElementById('userProfile');
    const dropdown = document.getElementById('profileDropdown');
    
    if (userProfile && !userProfile.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

// Handle logout
async function handleLogout() {
    try {
        await signOut();
    } catch (error) {
        console.error('Logout error:', error);
        // Force reload even if there's an error
        window.location.reload();
    }
}

// Make functions globally available
window.toggleProfileMenu = toggleProfileMenu;
window.handleLogout = handleLogout;

// Check login status on page load
if (typeof supabaseClient !== 'undefined') {
    checkUserLoginStatus();
}

// Retry connection every 5 seconds if disconnected
setInterval(() => {
    if (!isServerConnected) {
        checkServerConnection();
    }
}, 5000);

// Check server connection on load
window.addEventListener('load', checkServerConnection);

// Check server connection
async function checkServerConnection() {
    console.log('🔍 Checking server connection to:', HEALTH_URL);
    try {
        const response = await fetch(HEALTH_URL, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Server connected:', data);
            isServerConnected = true;
            updateConnectionStatus(true);
        } else {
            console.warn('⚠️ Server responded with error:', response.status);
            isServerConnected = false;
            updateConnectionStatus(false);
        }
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('🔧 Make sure backend is running: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080');
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
        appendMessage('⚠️ Cannot connect to server. Please start the backend:\n\n• Double-click START_BACKEND_8080.bat\n• Or run: python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080', false);
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
            errorMessage += '1. The backend server is running\n';
            errorMessage += `2. The server is accessible at ${BACKEND_URL}\n`;
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

// Note: Login and SignUp handlers are now in formHandlers.js with Supabase integration
