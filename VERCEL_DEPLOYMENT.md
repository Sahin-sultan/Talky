# 🚀 Deploy to Vercel - Complete Guide

## ✅ Prerequisites Completed
- ✓ Vercel-optimized serverless functions created in `/api`
- ✓ Frontend auto-detects localhost vs production
- ✓ API key secured in environment variables
- ✓ CORS configured automatically

## 📦 What You're Deploying

### Project Structure for Vercel:
```
chat bot/
├── api/                    # Serverless functions (backend)
│   ├── chat.py            # Main chat endpoint
│   └── health.py          # Health check endpoint
├── frontend/              # Static frontend files
│   ├── index.html
│   ├── chat.html
│   ├── login.html
│   ├── script.js
│   └── styles.css
├── vercel.json           # Vercel configuration
├── requirements.txt      # Python dependencies
└── .env.example         # Environment template
```

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Repository
```powershell
cd "d:\PROJECTS !\chat bot"

# Make sure .env is NOT committed
git status

# If .env is tracked, remove it:
# git rm --cached .env
# git commit -m "Remove .env from tracking"

# Commit optimized code
git add .
git commit -m "Optimize for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**
```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to project
cd "d:\PROJECTS !\chat bot"

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository: `Sahin-sultan/Talky`
4. Vercel will auto-detect settings
5. Click "Deploy"

### Step 3: Add Environment Variables

**In Vercel Dashboard:**
1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```
Name: GEMINI_API_KEY
Value: AIzaSyBKxk_uSjTu6o86f7GyEz-vtzZj6siAUsM
```

**Using Vercel CLI:**
```powershell
vercel env add GEMINI_API_KEY
# Paste your API key when prompted
```

### Step 4: Redeploy with Environment Variables
```powershell
vercel --prod
```

## 🔧 Configuration Details

### vercel.json Explained:
- **Rewrites**: Routes `/api/*` requests to serverless functions
- **Headers**: Enables CORS for API endpoints
- **Functions**: Configures Python runtime for `/api` folder

### Frontend Auto-Detection:
The frontend automatically uses:
- `localhost:8000` when developing locally
- Vercel's URL when deployed (same origin)

## ✅ Verify Deployment

1. **Check Health Endpoint:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"status":"ok","message":"System operational","platform":"Vercel"}`

2. **Test Chat:**
   - Visit: `https://your-app.vercel.app/frontend/index.html`
   - Send a test message
   - Should see green connection dot and receive responses

## 🎯 Post-Deployment Checklist

- [ ] Health endpoint returns 200 OK
- [ ] Chat interface loads without errors
- [ ] Connection status shows green dot
- [ ] Chat messages get AI responses
- [ ] No CORS errors in browser console
- [ ] Environment variable `GEMINI_API_KEY` is set

## 🔄 Local Development

To continue developing locally:
```powershell
# Start backend
cd "d:\PROJECTS !\chat bot\backend"
python -m uvicorn main:app --reload --port 8000

# Start frontend (in new terminal)
cd "d:\PROJECTS !\chat bot\frontend"
python -m http.server 3000
```

Frontend will automatically detect localhost and use `http://localhost:8000/api/*`

## 🚨 Troubleshooting

### "API key not configured" error:
- Verify environment variable in Vercel dashboard
- Redeploy after adding environment variables

### "Failed to fetch" errors:
- Check browser console for CORS errors
- Verify `/api/health` endpoint is accessible
- Ensure `vercel.json` is in root directory

### Python package errors:
- Ensure `requirements.txt` includes all dependencies:
  ```
  google-generativeai
  fastapi
  uvicorn
  python-dotenv
  pydantic
  ```

### Chat not working:
1. Test health endpoint first
2. Check browser Network tab for failed requests
3. Verify environment variables are set
4. Check Vercel function logs in dashboard

## 📊 Monitor Your Deployment

**Vercel Dashboard:**
- View deployment logs
- Monitor function invocations
- Check error rates
- View analytics

**Function Logs:**
```powershell
vercel logs
```

## 🎉 Your Deployed URLs

After deployment, you'll get:
- **Main App**: `https://your-app.vercel.app/frontend/index.html`
- **Chat API**: `https://your-app.vercel.app/api/chat`
- **Health Check**: `https://your-app.vercel.app/api/health`

Vercel also provides preview URLs for each commit!

## 🔐 Security Notes

✅ **Done Right:**
- API key stored in Vercel environment variables
- `.env` file in `.gitignore`
- Backend handles all API calls
- Frontend never exposes API key

⚠️ **Important:**
- Never commit `.env` file
- Don't share your API key publicly
- Monitor API usage at Google Cloud Console

## 🚀 Next Steps

1. **Custom Domain** (Optional):
   - Vercel Settings → Domains
   - Add your custom domain
   - Configure DNS

2. **Analytics** (Optional):
   - Enable Vercel Analytics
   - Monitor user traffic

3. **Rate Limiting** (Recommended):
   - Add rate limiting to prevent API abuse
   - Use Vercel Edge Config or similar

## 💡 Pro Tips

- Vercel auto-deploys on every push to `main`
- Use `vercel env pull` to sync env vars locally
- Preview deployments test changes before production
- Function logs help debug issues quickly

---

**Ready to deploy?** Run `vercel` in your project directory! 🎉
