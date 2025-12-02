# Talky - Setup Guide

## ✅ EASY START - Just 2 Clicks!

### Option 1: Start Everything at Once (RECOMMENDED)
1. **Double-click** `START_ALL.bat`
2. Wait a few seconds for both servers to start
3. Browser will open automatically at http://localhost:3000

### Option 2: Start Manually

**Step 1: Start Backend Server**
- Double-click `START_BACKEND.bat`
- OR run in terminal: `cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`

**Step 2: Start Frontend Server**
- Double-click `START_FRONTEND.bat`
- OR run in terminal: `cd frontend && python serve.py`

**Step 3: Open Browser**
- Go to http://localhost:3000

---

## Why Do I Need to Run Frontend Server?

When you open `index.html` directly (by double-clicking), it uses `file://` protocol which browsers block from making network requests to `http://localhost:8000` due to CORS security.

**Solution:** We serve the frontend on its own local server (port 3000), so both frontend and backend use `http://` protocol and can communicate properly.

## Fix for "Failed to fetch" Error

The error occurs because:
1. ❌ Opening `index.html` directly → Uses `file://` → CORS blocked
2. ✅ Serving frontend on localhost → Uses `http://` → Works perfectly!

---

## Installation (First Time Only)

### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Configure API Key (Optional)

Create a `.env` file in the `backend` folder:

```
API_KEY=your_google_gemini_api_key_here
```

**Note:** The chatbot works without an API key but returns mock responses. For real AI responses, get a Google Gemini API key from: https://makersuite.google.com/app/apikey

---

## Quick Reference

### URLs
- 🎨 **Frontend**: http://localhost:3000
- ⚙️ **Backend API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs
- 🏥 **Health Check**: http://localhost:8000/health
- 🧪 **Connection Test**: http://localhost:3000/test-connection.html

### Starting the App
| Method | Command |
|--------|---------|
| **Easy** | Double-click `START_ALL.bat` |
| **Backend Only** | Double-click `START_BACKEND.bat` |
| **Frontend Only** | Double-click `START_FRONTEND.bat` |
| **Manual Backend** | `cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000` |
| **Manual Frontend** | `cd frontend && python serve.py` |

### Stopping the Servers
- Press `CTRL+C` in each terminal window
- Or close the terminal windows

---

## Troubleshooting

### 1. Port Already in Use
**Error:** `Address already in use`

**Solution:**
```powershell
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F
```

### 2. Module Not Found
**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### 3. Connection Status Shows Red Dot
- The red dot means frontend can't reach backend
- Make sure backend server is running on port 8000
- Check terminal for error messages

### 4. Browser Shows "This site can't be reached"
- Make sure you're using http://localhost:3000 (not opening index.html directly)
- Check if frontend server is running

### 5. Still Getting CORS Errors
- Don't open `index.html` directly
- Always use http://localhost:3000
- Both servers must be running

---

## Project Structure

```
chat bot/
├── START_ALL.bat           # 🚀 Start everything
├── START_BACKEND.bat       # Start backend only  
├── START_FRONTEND.bat      # Start frontend only
├── README_SETUP.md         # This file
├── backend/
│   ├── main.py            # FastAPI server
│   ├── config.py          # Configuration
│   ├── models.py          # Data models
│   ├── start_server.py    # Server startup script
│   └── requirements.txt   # Python dependencies
└── frontend/
    ├── index.html         # Main chat page
    ├── script.js          # Frontend logic
    ├── styles.css         # Styling
    ├── serve.py           # Frontend server
    └── test-connection.html # Connection test
```

## Features

- ✅ Real-time chat interface with connection status indicator
- ✅ Automatic server connection checking
- ✅ Conversation history
- ✅ Code highlighting
- ✅ Copy message functionality
- ✅ Responsive design
- ✅ Helpful error messages
- ✅ One-click startup
- 🔄 Google Gemini AI integration (with API key)

## Next Steps

1. ✅ Install dependencies (one-time)
2. ✅ Double-click `START_ALL.bat`
3. ✅ Chat with Talky!
4. 🔑 (Optional) Add Gemini API key for real AI responses
5. 🎨 (Optional) Customize the UI in `frontend/styles.css`
6. 🔧 (Optional) Adjust AI behavior in `backend/config.py`
