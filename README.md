# 🤖 Talky - AI Chatbot

> Modern AI-powered chatbot featuring Groq LLM integration, Supabase authentication, and beautiful responsive design.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://talkychat.vercel.app/)
[![Backend](https://img.shields.io/badge/backend-Railway-purple)](https://talky-production-2636.up.railway.app)

## ✨ Features

- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 🤖 **AI-Powered**: Groq LLM (llama-3.3-70b-versatile) for intelligent conversations
- 🔐 **User Authentication**: Secure signup/login with Supabase
- 💬 **Real-time Chat**: Fast, responsive chat interface
- 📱 **Mobile Friendly**: Fully responsive design for all devices
- 🎭 **User Profiles**: Personalized experience with user avatars
- ⚡ **Fast Performance**: Optimized for speed and efficiency

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Supabase JS SDK for authentication
- Deployed on Vercel

**Backend:**
- Python 3.9+
- FastAPI framework
- Groq API for AI responses
- Deployed on Railway

**Database:**
- Supabase (PostgreSQL)

## 📁 Project Structure

```
chatbot/
├── frontend/           # Frontend application
│   ├── index.html     # Main HTML file
│   ├── styles.css     # Styling
│   ├── script.js      # Chat logic
│   ├── auth.js        # Authentication handlers
│   └── ...
├── backend/           # Backend API
│   ├── main.py       # FastAPI application
│   ├── config.py     # Configuration
│   ├── models.py     # Data models
│   └── routes/       # API routes
├── .env.example      # Environment variables template
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- Groq API key ([Get it here](https://console.groq.com))
- Supabase account ([Sign up](https://supabase.com))

### Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Sahin-sultan/Talky.git
cd Talky
```

**2. Backend Setup**
```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Add your Groq API key to .env
# GROQ_API_KEY=your_groq_api_key_here

# Run the server
uvicorn main:app --reload --port 8080
```

Backend will be available at `http://localhost:8080`

**3. Frontend Setup**
```bash
cd frontend

# Option 1: Open index.html directly in browser
# Double-click index.html

# Option 2: Use Python's built-in server
python -m http.server 8000

# Option 3: Use Node.js http-server
npx http-server -p 8000
```

Frontend will be available at `http://localhost:8000`

**4. Configure Supabase**

Create a Supabase project and update `frontend/supabaseClient.js`:
```javascript
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

## 🌐 Deployment

### Backend (Railway)

1. Create a Railway account
2. Create new project from GitHub repo
3. Add environment variable: `GROQ_API_KEY`
4. Deploy automatically triggers

### Frontend (Vercel)

1. Create a Vercel account
2. Import GitHub repository
3. Deploy (no special configuration needed)

## 📝 Environment Variables

**Backend (.env):**
```bash
GROQ_API_KEY=your_groq_api_key_here
```

**Frontend (supabaseClient.js):**
```javascript
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Usage

1. **Sign Up**: Create an account with email and password
2. **Login**: Access your personalized chat interface
3. **Chat**: Start conversing with the AI assistant
4. **Profile**: Click your avatar to access profile options

## 🔧 Configuration

**Change AI Model** (backend/config.py):
```python
MODEL_NAME = "llama-3.3-70b-versatile"  # Change to different Groq model
TEMPERATURE = 0.7  # Adjust creativity (0.0-1.0)
```

**Customize UI** (frontend/styles.css):
```css
:root {
    --neon-blue: #5b7cff;
    --neon-purple: #7b4dff;
    /* Modify colors as needed */
}
```

## 📱 API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Send chat message
  ```json
  {
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }
  ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Sahin Sultan**
- GitHub: [@Sahin-sultan](https://github.com/Sahin-sultan)

## 🙏 Acknowledgments

- [Groq](https://groq.com) for the AI API
- [Supabase](https://supabase.com) for authentication
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Railway](https://railway.app) & [Vercel](https://vercel.com) for hosting

---

⭐ If you find this project useful, please give it a star!
