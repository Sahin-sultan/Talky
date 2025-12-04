// Supabase Client Configuration
// Replace these placeholders with your actual Supabase credentials

const SUPABASE_URL = 'https://ncihodfvzxyvslxjkrjs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jaWhvZGZ2enh5dnNseGprcmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mzk0ODAsImV4cCI6MjA4MDMxNTQ4MH0.7zEUygUTsxlKkTmCoM3PbsAaZxt_po-h5PK2GwliwaA';

// Initialize Supabase client
try {
    if (typeof window.supabase === 'undefined') {
        throw new Error('Supabase SDK not loaded');
    }
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabase;
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Create a dummy client to prevent undefined errors
    window.supabaseClient = null;
}
