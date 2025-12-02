# 🚀 Deployment Checklist for Talky

## ❌ NOT READY YET - Complete these steps first:

### 🔴 Critical Issues to Fix:

#### 1. **Remove API Key from Backend .env**
- [ ] The `.env` file currently has your API key
- [ ] Before deploying, you must use environment variables on the server
- [ ] NEVER deploy with API key in the code!

#### 2. **Environment Variables for Production**
```env
# On your deployment platform (Render, Vercel, Railway, etc.)
# Add these as environment variables:
API_KEY=your_actual_key_here
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

#### 3. **Update CORS Settings**
Current: Allows all origins (*)
Production: Must specify exact frontend URL

File: `backend/main.py`
```python
# Change from:
allow_origins=["*"]

# To:
allow_origins=["https://your-frontend-domain.com"]
```

#### 4. **Frontend API URL**
File: `frontend/script.js`
```javascript
// Change from:
const API_URL = 'http://localhost:8000/api/chat';

// To:
const API_URL = 'https://your-backend-domain.com/api/chat';
// OR use environment detection:
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api/chat'
    : 'https://your-backend-domain.com/api/chat';
```

---

## 📋 Pre-Deployment Checklist:

### Security:
- [x] `.env` files in `.gitignore` ✅
- [ ] Remove API key from code
- [ ] Set up environment variables on hosting platform
- [ ] Update CORS to production domains
- [ ] Remove `__pycache__` from git

### Code Quality:
- [ ] Test all features work locally
- [ ] Remove debug/console.log statements
- [ ] Add error handling for production
- [ ] Test with different browsers

### Configuration:
- [ ] Update API URLs for production
- [ ] Set proper CORS origins
- [ ] Configure production environment variables
- [ ] Add health check endpoint (already done ✅)

---

## 🌐 Deployment Options:

### Option 1: Deploy to Render (Recommended - Free Tier)

**Backend (Python/FastAPI):**
1. Create account at https://render.com
2. New Web Service
3. Connect GitHub repo
4. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment Variables: Add `API_KEY`
5. Deploy!

**Frontend:**
1. New Static Site
2. Build Command: (none needed)
3. Publish Directory: `frontend`
4. Deploy!

### Option 2: Deploy to Vercel

**Backend:**
- Not ideal for Python backend
- Better for Node.js version in `secure-backend/`

**Frontend:**
1. Install Vercel CLI: `npm i -g vercel`
2. `cd frontend`
3. `vercel --prod`

### Option 3: Deploy to Railway

**Backend & Frontend together:**
1. https://railway.app
2. New Project from GitHub
3. Add environment variables
4. Deploy!

---

## 🔧 Pre-Deployment Code Changes Needed:

### 1. Create Production Config
```python
# backend/config.py - Add environment detection
import os

class Config:
    # Environment
    ENV = os.getenv("ENV", "development")
    DEBUG = ENV == "development"
    
    # API Keys
    API_KEY = os.getenv("API_KEY")
    
    # CORS
    if ENV == "production":
        ALLOWED_ORIGINS = [os.getenv("FRONTEND_URL")]
    else:
        ALLOWED_ORIGINS = ["http://localhost:3000", "*"]
```

### 2. Update Frontend for Production
```javascript
// frontend/script.js - Add environment detection
const isDevelopment = window.location.hostname === 'localhost';

const API_URL = isDevelopment
    ? 'http://localhost:8000/api/chat'
    : '/api/chat'; // Relative URL for production
```

### 3. Add Requirements for Production
```
# backend/requirements.txt - Already has:
fastapi
uvicorn
pydantic
python-dotenv
httpx
google-generativeai

# Add for production:
gunicorn  # Production server
```

---

## 🚨 Critical Security Before Deploy:

### 1. Clean Git History (Your API key was committed!)
```bash
# This removes the API key from all git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

### 2. Revoke Old API Keys
- Go to: https://makersuite.google.com/app/apikey
- Delete any keys that were exposed
- Create a fresh key for production

### 3. Update .gitignore (Already done ✅)
```gitignore
.env
*.env
__pycache__/
*.pyc
```

---

## 📊 Deployment Steps Summary:

### Step 1: Prepare Code
```bash
# 1. Remove pycache from git
git rm -r --cached backend/__pycache__
git add .gitignore
git commit -m "chore: Remove pycache and secure .env"

# 2. Update code for production (see above)
# 3. Test locally one more time
# 4. Commit changes
git add .
git commit -m "feat: Prepare for production deployment"
git push origin main
```

### Step 2: Deploy Backend
1. Choose hosting platform (Render recommended)
2. Connect GitHub repo
3. Add environment variable: `API_KEY=your_key_here`
4. Deploy
5. Get backend URL: `https://your-app.onrender.com`

### Step 3: Deploy Frontend
1. Update `frontend/script.js` with backend URL
2. Deploy to Vercel/Netlify/Render
3. Get frontend URL: `https://your-app.vercel.app`

### Step 4: Update CORS
1. Add frontend URL to backend CORS settings
2. Redeploy backend

### Step 5: Test Production
- [ ] Visit frontend URL
- [ ] Send test message
- [ ] Check browser console for errors
- [ ] Test on mobile

---

## 🎯 Ready to Deploy When:

- [ ] All environment variables configured
- [ ] CORS updated for production
- [ ] API URLs updated
- [ ] Old API keys revoked
- [ ] Tested locally
- [ ] Code committed to git
- [ ] `.env` never in git history

---

## 💡 Quick Deploy Commands (After fixes):

```bash
# 1. Clean up
git rm -r --cached backend/__pycache__
git add .

# 2. Commit
git commit -m "chore: Prepare for production deployment"

# 3. Push
git push origin main

# 4. Deploy on platform (Render/Vercel/Railway)
```

---

**Current Status: ⚠️ NOT READY**
**After completing checklist: ✅ READY TO DEPLOY**

Would you like me to help you prepare for deployment to a specific platform?
