// Authentication Functions for Talky

// ==================== SIGN UP FUNCTION ====================
async function handleSignUp(fullName, email, password) {
    try {
        console.log('Attempting signup with:', { email, fullName, passwordLength: password.length });
        
        // Sign up the user with auto-confirm option
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: window.location.origin,
                data: {
                    full_name: fullName
                }
            }
        });

        console.log('Signup response:', { data, error });

        if (error) throw error;

        // Insert full name into profiles table
        if (data.user) {
            const { error: profileError } = await supabaseClient
                .from('profiles')
                .insert([
                    { 
                        id: data.user.id, 
                        full_name: fullName,
                        email: email 
                    }
                ]);

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // Continue anyway since user was created
            }
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
            return { success: true, message: 'Account created! Please check your email to verify your account before logging in.' };
        }

        return { success: true, message: 'Account created. Please log in.' };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, message: error.message || 'Failed to create account' };
    }
}

// ==================== LOGIN FUNCTION ====================
async function handleSignIn(email, password) {
    try {
        console.log('Attempting login with:', { email, passwordLength: password.length });
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        console.log('Login response:', { data, error });

        if (error) throw error;

        return { success: true, user: data.user };
    } catch (error) {
        console.error('Sign in error:', error);
        
        // User-friendly error messages
        let message = 'Login failed';
        if (error.message.includes('Invalid login credentials')) {
            message = 'Invalid email or password. If you just signed up, please verify your email first.';
        } else if (error.message.includes('Email not confirmed')) {
            message = 'Please check your email and click the verification link before logging in.';
        } else if (error.message.includes('Email not confirmed')) {
            message = 'Please verify your email address first. Check your inbox for the confirmation link.';
        } else {
            message = error.message;
        }
        
        return { success: false, message: message };
    }
}

// ==================== SESSION CHECK ====================
async function checkSession() {
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
            // No active session, redirect to login
            window.location.href = '/login';
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Session check error:', error);
        window.location.href = '/login';
        return null;
    }
}

// ==================== GET CURRENT USER ====================
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        
        if (error) throw error;
        
        return user;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

// ==================== SIGN OUT ====================
async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) throw error;
        
        // Redirect to main page and reload
        window.location.href = '/';
        window.location.reload();
    } catch (error) {
        console.error('Sign out error:', error);
        // Reload page anyway to clear session
        window.location.href = '/';
        window.location.reload();
    }
}

// ==================== GET USER PROFILE ====================
async function getUserProfile(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        
        return data;
    } catch (error) {
        console.error('Get profile error:', error);
        return null;
    }
}

// Export functions to window for global access
window.handleSignUp = handleSignUp;
window.handleSignIn = handleSignIn;
window.checkSession = checkSession;
window.getCurrentUser = getCurrentUser;
window.signOut = signOut;
window.getUserProfile = getUserProfile;
