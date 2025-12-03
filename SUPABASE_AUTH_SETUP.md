# Supabase Authentication Integration - Setup Guide

## ✅ What Has Been Done

I've successfully integrated Supabase Authentication into your Talky chatbot with the following features:

### Files Created:
1. **`supabaseClient.js`** - Supabase configuration and client initialization
2. **`auth.js`** - All authentication functions (signup, login, logout, session check)
3. **`formHandlers.js`** - Form submission handlers with validation and loading states
4. **`dashboard.html`** - Protected dashboard page example

### Files Modified:
1. **`index.html`** - Added Supabase scripts, form IDs, and error/success message containers
2. **`styles.css`** - Added styles for error/success messages and loading states

---

## 🔑 STEP 1: Add Your Supabase Credentials

**Open this file:** `frontend/supabaseClient.js`

Replace these placeholders with your actual Supabase credentials:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

**Where to find your credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on "Settings" → "API"
4. Copy "Project URL" → paste as `SUPABASE_URL`
5. Copy "anon public" key → paste as `SUPABASE_ANON_KEY`

---

## 📊 STEP 2: Create the Profiles Table in Supabase

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
```

---

## 🎯 How It Works

### Sign Up Flow:
1. User fills in: Full Name, Email, Password
2. System creates account using `supabase.auth.signUp()`
3. User's full name is saved in `profiles` table
4. Success message appears: "Account created. Please log in."
5. User is redirected to Login modal after 2 seconds

### Login Flow:
1. User enters: Email, Password
2. System authenticates using `supabase.auth.signInWithPassword()`
3. On success, redirects to `/dashboard.html`
4. On failure, shows error: "Invalid email or password"

### Session Protection:
- Call `checkSession()` on any protected page
- If no active session → redirects to login
- Example: See `dashboard.html`

### Logout:
- Call `signOut()` function
- Clears session and redirects to login

---

## 📁 File Structure

```
frontend/
├── supabaseClient.js       ← PASTE YOUR CREDENTIALS HERE
├── auth.js                 ← Authentication functions
├── formHandlers.js         ← Form validation & submission
├── dashboard.html          ← Example protected page
├── index.html              ← Updated with auth integration
└── styles.css              ← Updated with message styles
```

---

## 🔧 Functions Available

### In `auth.js`:
- `handleSignUp(fullName, email, password)` - Creates new account
- `handleSignIn(email, password)` - Logs in user
- `checkSession()` - Checks if user is logged in
- `getCurrentUser()` - Gets current user data
- `signOut()` - Logs out user
- `getUserProfile(userId)` - Gets user profile from database

### In `formHandlers.js`:
- `handleLoginSubmit()` - Handles login form submission
- `handleSignUpSubmit()` - Handles signup form submission

---

## ✨ Features Implemented

✅ Email & Password Authentication  
✅ Form validation (empty fields, password length)  
✅ Loading states (button shows spinner while processing)  
✅ Error messages (user-friendly)  
✅ Success messages (with animations)  
✅ Button disable during submission  
✅ Auto-redirect after signup/login  
✅ Session checking for protected pages  
✅ User profile storage in database  
✅ Clean logout functionality  

---

## 🚀 Testing Instructions

1. **Add your Supabase credentials** to `supabaseClient.js`
2. **Create the profiles table** using the SQL above
3. **Open `index.html`** in browser
4. **Click Login button** → test signup
5. **Fill signup form** → should create account
6. **Login with credentials** → should redirect to dashboard
7. **Test logout** → should clear session and redirect

---

## 🎨 UI Notes

- Your existing UI design is **NOT modified**
- Only added: error/success message containers
- Added: loading spinner on buttons
- All styling matches your current theme

---

## 📝 Notes

- Google login button is present but NOT yet connected (you requested email/password only)
- Password must be minimum 6 characters
- Email verification is handled by Supabase settings
- All sensitive data is stored securely in Supabase

---

## ⚠️ Remember

**NEVER commit `supabaseClient.js` with real credentials to GitHub!**

Add to `.gitignore`:
```
frontend/supabaseClient.js
```

Or use environment variables in production.

---

Need help? Check the console for detailed error messages during testing.
