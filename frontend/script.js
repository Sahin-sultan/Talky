const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Store conversation history
let messages = [];

// API Endpoint (adjust if backend runs on different port)
const API_URL = 'http://localhost:8000/api/chat';

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botReply = data.response;

        // Add bot message to UI
        appendMessage(botReply, false);
        
        // Add to history
        messages.push({ role: 'assistant', content: botReply });

    } catch (error) {
        console.error('Error:', error);
        appendMessage('Sorry, something went wrong. Please check the console or backend connection.', false);
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

// Login Modal Logic
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModalBtn = document.getElementById('closeModalBtn');

if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('active');
    });

    // Close modal when clicking outside
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

function handleLogin() {
    // Simulate login
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    
    loginModal.classList.remove('active');
    
    // Change icon to indicate logged in state
    loginBtn.innerHTML = '<i class="fas fa-user-check"></i>';
    loginBtn.style.background = '#5b7cff';
    loginBtn.style.color = 'white';
    loginBtn.title = 'Logged In';
    
    // Optional: Store state
    localStorage.setItem('isLoggedIn', 'true');
}

function handleSignUp() {
    // Simulate Sign Up
    const signUpModal = document.getElementById('signUpModal');
    const loginBtn = document.getElementById('loginBtn');
    
    signUpModal.classList.remove('active');
    
    // Change icon to indicate logged in state
    loginBtn.innerHTML = '<i class="fas fa-user-check"></i>';
    loginBtn.style.background = '#5b7cff';
    loginBtn.style.color = 'white';
    loginBtn.title = 'Logged In';
    
    // Optional: Store state
    localStorage.setItem('isLoggedIn', 'true');
}

// Check login state on load
if (localStorage.getItem('isLoggedIn') === 'true') {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        loginBtn.style.background = '#5b7cff';
        loginBtn.style.color = 'white';
        loginBtn.title = 'Logged In';
    }
}
