# 📋 Pre-Deployment Checklist

## ⚠️ MUST UPDATE BEFORE DEPLOYING

### 1. Backend URL Configuration
- [ ] Open `frontend/script.js`
- [ ] Find line 13: `const BACKEND_URL = 'http://localhost:8080';`
- [ ] Change to your production backend URL
- [ ] Example: `const BACKEND_URL = 'https://talky-backend.railway.app';`

### 2. Supabase Credentials
- [ ] Open `frontend/supabaseClient.js`
- [ ] Update `SUPABASE_URL` with your project URL
- [ ] Update `SUPABASE_ANON_KEY` with your anon/public key
- [ ] Get these from: Supabase Project Settings > API

### 3. Backend Environment Variables
- [ ] Create `backend/.env` file
- [ ] Add: `GROQ_API_KEY=your_actual_api_key`
- [ ] Get Groq API key from: https://console.groq.com/keys
- [ ] DO NOT commit this file to Git (already in .gitignore)

### 4. Supabase Database Setup
- [ ] Create Supabase project
- [ ] Run SQL from `DEPLOYMENT_GUIDE.md` to create profiles table
- [ ] Enable Row Level Security policies
- [ ] Disable email confirmation (Settings > Authentication)

## 🔍 Testing Checklist

### Local Testing
- [ ] Start backend: `cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8080`
- [ ] Open frontend in browser
- [ ] Test signup with new email
- [ ] Test login with existing account
- [ ] Test logout
- [ ] Test chat functionality
- [ ] Test on mobile (Chrome DevTools)

### Production Testing (After Deploy)
- [ ] Visit deployed frontend URL
- [ ] Check browser console for errors
- [ ] Test signup
- [ ] Test login
- [ ] Test chat
- [ ] Test on real mobile device
- [ ] Test profile dropdown
- [ ] Test logout

## 🚀 Deployment Steps

### Deploy Backend First
1. [ ] Create account on Railway/Render/Heroku
2. [ ] Connect GitHub repository OR upload backend folder
3. [ ] Set environment variables in platform dashboard
4. [ ] Deploy and get backend URL
5. [ ] Test backend health check: `https://your-backend-url.com/health`

### Deploy Frontend Second
1. [ ] Update `BACKEND_URL` in `frontend/script.js` with backend URL from above
2. [ ] Update Supabase credentials in `frontend/supabaseClient.js`
3. [ ] Deploy to Vercel/Netlify
4. [ ] Test the deployed site

## ✅ Post-Deployment Verification

- [ ] Frontend loads without errors
- [ ] Backend API is accessible
- [ ] Signup creates new user in Supabase
- [ ] Login works with existing user
- [ ] Profile dropdown shows user name
- [ ] Chat sends messages and gets AI responses
- [ ] Logout works correctly
- [ ] Mobile view is responsive
- [ ] Email validation works
- [ ] Name autocomplete works

## 🔒 Security Checklist

- [ ] Supabase RLS policies are enabled
- [ ] `.env` file is in `.gitignore`
- [ ] `supabaseClient.js` is in `.gitignore` (or credentials removed before commit)
- [ ] API keys are stored as environment variables only
- [ ] CORS is configured properly in backend

## 📱 Mobile Checklist

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Check touch targets are large enough
- [ ] Verify no zoom on input focus
- [ ] Test modal responsiveness

## 🎯 Performance Checklist

- [ ] No console errors in browser
- [ ] API responses are fast (<2s)
- [ ] Images/assets load quickly
- [ ] No layout shift on page load
- [ ] Smooth animations

## 📝 Documentation Checklist

- [ ] README.md has correct info
- [ ] DEPLOYMENT_GUIDE.md is updated
- [ ] Environment variables are documented
- [ ] API endpoints are documented

## 🎉 Ready to Deploy?

If all items above are checked, you're ready to deploy!

**Deployment Commands:**

### Vercel (Frontend):
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Railway (Backend):
```bash
cd backend
npm install -g @railway/cli
railway login
railway up
```

---

**Questions? Issues?**
- Check `DEPLOYMENT_GUIDE.md` for detailed instructions
- Check `READY_TO_DEPLOY.md` for optimization summary

**Good luck! 🚀**
