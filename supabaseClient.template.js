// Supabase Client Configuration Template
// Copy this file to supabaseClient.js and add your real credentials

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabase;

/*
HOW TO GET YOUR CREDENTIALS:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Settings" → "API"
4. Copy "Project URL" → paste as SUPABASE_URL
5. Copy "anon public" key → paste as SUPABASE_ANON_KEY
*/
