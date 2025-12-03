# Talky - Deployment Guide

## 🚀 Production Deployment Checklist

### 1. **Frontend Deployment (Vercel/Netlify)**

#### Required Files:
- `frontend/index.html` - Main application
- `frontend/styles.css` - All styling
- `frontend/script.js` - Main chat functionality
- `frontend/auth.js` - Supabase authentication
- `frontend/formHandlers.js` - Form handling
- `frontend/emailValidator.js` - Email validation
- `frontend/customAutocomplete.js` - Name autocomplete
- `frontend/supabaseClient.js` - Supabase config (⚠️ UPDATE CREDENTIALS)
- `frontend/favicon.svg` - Logo

#### Steps:
1. **Update Supabase Credentials** in `frontend/supabaseClient.js`:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

2. **Deploy to Vercel**:
   ```bash
   cd frontend
   vercel --prod
   ```
   Or connect your GitHub repository to Vercel dashboard.

3. **Configure Build Settings**:
   - Build Command: (none - static site)
   - Output Directory: `frontend`
   - Install Command: (none)

### 2. **Backend Deployment (Railway/Render/Heroku)**

#### Required Files:
- `backend/main.py` - FastAPI application
- `backend/config.py` - Configuration
- `backend/models.py` - Data models
- `backend/requirements.txt` - Python dependencies
- `backend/.env` - Environment variables (⚠️ CREATE THIS)

#### Steps:
1. **Create `.env` file** in `backend/` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   PORT=8080
   ```

2. **Deploy to Railway**:
   ```bash
   cd backend
   railway up
   ```

3. **Or Deploy to Render**:
   - Connect GitHub repository
   - Set Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables to Set**:
   - `GROQ_API_KEY` - Your Groq API key
   - `PORT` - 8080 or platform default

### 3. **Supabase Database Setup**

1. **Create Supabase Project** at https://supabase.com

2. **Run SQL to create profiles table**:
   ```sql
   CREATE TABLE public.profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     full_name TEXT NOT NULL,
     email TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Allow users to read their own profile
   CREATE POLICY "Users can view own profile"
   ON public.profiles FOR SELECT
   USING (auth.uid() = id);

   -- Allow users to update their own profile
   CREATE POLICY "Users can update own profile"
   ON public.profiles FOR UPDATE
   USING (auth.uid() = id);

   -- Allow authenticated users to insert their profile
   CREATE POLICY "Users can insert own profile"
   ON public.profiles FOR INSERT
   WITH CHECK (auth.uid() = id);
   ```

3. **Disable Email Confirmation** (for quick testing):
   - Go to Authentication > Settings
   - Disable "Enable email confirmations"

### 4. **Update Frontend API Endpoint**

In `frontend/script.js`, update the API URL:
```javascript
const API_URL = 'https://your-backend-url.com';  // Change this!
```

### 5. **Final Checks Before Deployment**

- [ ] Groq API key is set in backend `.env`
- [ ] Supabase credentials updated in `supabaseClient.js`
- [ ] Backend API URL updated in `script.js`
- [ ] Supabase profiles table created
- [ ] Email confirmation disabled in Supabase
- [ ] Test signup/login on production
- [ ] Test chat functionality
- [ ] Test on mobile devices
- [ ] Check browser console for errors

## 🎯 Quick Deploy Commands

### Frontend (Vercel):
```bash
cd frontend
vercel --prod
```

### Backend (Railway):
```bash
cd backend
railway login
railway up
```

## 📱 Mobile Optimization

✅ **Already Implemented**:
- Responsive design for all screen sizes
- Touch-friendly buttons (44px minimum)
- Prevents iOS zoom on input focus
- Optimized for portrait and landscape
- Mobile-friendly modals and dropdowns

## 🔧 Environment Variables Summary

### Backend:
- `GROQ_API_KEY` - Required for AI responses
- `PORT` - Server port (default: 8080)

### Frontend:
- Update `SUPABASE_URL` in `supabaseClient.js`
- Update `SUPABASE_ANON_KEY` in `supabaseClient.js`
- Update `API_URL` in `script.js`

## 🚨 Security Notes

1. **Never commit** `supabaseClient.js` with real credentials to GitHub
2. **Use environment variables** for all secrets
3. **Enable CORS properly** - update allowed origins in production
4. **Set up RLS policies** in Supabase for data security

## 📊 Project Structure (Clean)

```
chatbot/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── auth.js
│   ├── formHandlers.js
│   ├── emailValidator.js
│   ├── customAutocomplete.js
│   ├── supabaseClient.js
│   └── favicon.svg
└── backend/
    ├── main.py
    ├── config.py
    ├── models.py
    ├── requirements.txt
    └── .env
```

## 🎉 Ready to Deploy!

Your project is now optimized and ready for production deployment. All unnecessary files have been removed, mobile responsiveness is implemented, and the code is clean and efficient.

**Good luck with your deployment! 🚀**

---
Developed by **Sahin Sultan** | [Portfolio](https://sahinsultan.vercel.app/)
