# 🔑 How to Get a Valid Google Gemini API Key

## ⚠️ Your Current Issue:
**Error:** `API key expired. Please renew the API key.`

**Reason:** The API key you provided is either:
- ❌ Invalid/expired
- ❌ Incorrect format
- ❌ Not a valid Google AI Studio API key

---

## ✅ How to Get a NEW Valid API Key (5 minutes)

### Step 1: Go to Google AI Studio
**Link:** https://makersuite.google.com/app/apikey

Or alternatively: https://aistudio.google.com/app/apikey

### Step 2: Sign In
- Use your Google account
- Accept terms of service if prompted

### Step 3: Create API Key
1. Click **"Create API Key"** button
2. Choose **"Create API key in new project"** (or select existing project)
3. **Copy** the API key immediately (you may not see it again!)

### Step 4: Add Key to Your Project
1. Open: `backend\.env` file
2. Replace the line with your NEW key:
   ```
   API_KEY=your_actual_new_key_here
   ```
3. **Save** the file

### Step 5: Restart Backend Server
Close the backend terminal and restart:
- Double-click `START_BACKEND.bat`
- Or run: `cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000`

---

## 📝 Example of CORRECT Format:

```
API_KEY=AIzaSyDa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

**Note:** 
- Should start with `AIzaSy`
- About 39 characters long
- No spaces, no quotes

---

## 🧪 Test Your New API Key:

```powershell
cd backend
python test_key.py
```

You should see: `Success!` if the key is valid.

---

## ❓ Common Issues:

### "API key expired"
- The key was deleted or expired
- Get a new one from AI Studio

### "API key not valid"
- Wrong format (check for typos)
- Copied incorrectly (make sure no extra spaces)

### "Quota exceeded"
- You've used up your free quota
- Wait 24 hours or upgrade your plan

### "API key not found"
- Not enabled for Gemini API
- Create new key specifically for Generative Language API

---

## 🔒 Security Reminder:

- ✅ Keep API key in `backend\.env` only
- ✅ Never share it publicly
- ✅ `.env` is protected by `.gitignore` (won't be committed to git)
- ❌ Don't paste it in chat, screenshots, or videos

---

## 📚 Official Documentation:

- Get API Key: https://ai.google.dev/gemini-api/docs/api-key
- API Quickstart: https://ai.google.dev/gemini-api/docs/quickstart
- Pricing (Free tier): https://ai.google.dev/pricing

---

## 🎯 Quick Checklist:

- [ ] Go to https://makersuite.google.com/app/apikey
- [ ] Sign in with Google account
- [ ] Click "Create API Key"
- [ ] Copy the key (starts with AIzaSy...)
- [ ] Open `backend\.env`
- [ ] Paste: `API_KEY=your_new_key_here`
- [ ] Save file
- [ ] Restart backend server
- [ ] Test in chat!

---

**After getting a new key, your chat should work perfectly!** ✨
