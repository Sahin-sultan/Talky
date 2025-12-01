# Talky - Setup Guide

## Fix for "Failed to fetch" Error

The "Failed to fetch" error occurs when the frontend cannot connect to the backend server. Follow these steps to fix it:

### Step 1: Install Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure API Key (Optional)

Create a `.env` file in the `backend` folder:

```
API_KEY=your_google_gemini_api_key_here
```

**Note:** The chatbot will work without an API key but will return mock responses. To get real AI responses, you need a Google Gemini API key from: https://makersuite.google.com/app/apikey

### Step 3: Start the Backend Server

**Option A - Using the batch file (Windows):**
- Double-click `START_BACKEND.bat` in the root folder

**Option B - Using terminal:**
```bash
cd backend
python start_server.py
```

**Option C - Direct command:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Step 4: Open the Frontend

1. Open `frontend/index.html` in your browser
2. OR use Live Server extension in VS Code (recommended)

### Verification

- Backend should be running at: http://localhost:8000
- API documentation available at: http://localhost:8000/docs
- Test the API at: http://localhost:8000/health

### Common Issues

1. **Port 8000 already in use:**
   - Stop other applications using port 8000
   - Or change the port in both `backend/start_server.py` and `frontend/script.js`

2. **Module not found errors:**
   - Make sure you installed all dependencies: `pip install -r requirements.txt`

3. **CORS errors:**
   - The CORS configuration has been updated to allow all local development ports
   - Make sure the backend is actually running

4. **Still getting "Failed to fetch":**
   - Check if the backend server is actually running
   - Check browser console (F12) for detailed error messages
   - Verify the API_URL in `frontend/script.js` matches your backend URL

## Project Structure

```
chat bot/
├── backend/
│   ├── main.py           # FastAPI server
│   ├── config.py         # Configuration
│   ├── models.py         # Data models
│   ├── start_server.py   # Server startup script
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── index.html       # Main page
│   ├── script.js        # Frontend logic
│   └── styles.css       # Styling
└── START_BACKEND.bat    # Quick start script
```

## Features

- ✅ Real-time chat interface
- ✅ Conversation history
- ✅ Code highlighting
- ✅ Copy message functionality
- ✅ Responsive design
- ✅ Error handling with helpful messages
- 🔄 Google Gemini AI integration (with API key)

## Next Steps

1. Get a Google Gemini API key for real AI responses
2. Customize the system prompt in `backend/config.py`
3. Add Supabase authentication (planned)
