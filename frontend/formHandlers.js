// Form submission handlers for Login and Sign Up

// ==================== LOGIN FORM HANDLER ====================
async function handleLoginSubmit() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const submitBtn = document.getElementById('signInBtn');
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');

    // Validation
    if (!email || !password) {
        showError(errorDiv, 'Please fill in all fields');
        return;
    }

    // Clear previous messages
    hideMessage(errorDiv);
    hideMessage(successDiv);

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        const result = await handleSignIn(email, password);

        if (result.success) {
            showSuccess(successDiv, 'Login successful!');
            
            // Close modal and reload to show logged-in state
            setTimeout(() => {
                document.getElementById('loginModal').classList.remove('active');
                window.location.reload();
            }, 800);
        } else {
            showError(errorDiv, result.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Login';
        }
    } catch (error) {
        showError(errorDiv, 'An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
    }
}

// ==================== SIGN UP FORM HANDLER ====================
async function handleSignUpSubmit() {
    const fullName = document.getElementById('signUpFullName').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value;
    const submitBtn = document.getElementById('signUpBtn');
    const errorDiv = document.getElementById('signUpError');
    const successDiv = document.getElementById('signUpSuccess');

    // Validation
    if (!fullName || !email || !password) {
        showError(errorDiv, 'Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError(errorDiv, 'Password must be at least 6 characters');
        return;
    }

    // Clear previous messages
    hideMessage(errorDiv);
    hideMessage(successDiv);

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    try {
        const result = await handleSignUp(fullName, email, password);

        if (result.success) {
            showSuccess(successDiv, result.message);
            
            // Clear form
            document.getElementById('signUpForm').reset();
            
            // Close signup modal and open login modal after 2 seconds
            setTimeout(() => {
                document.getElementById('signUpModal').classList.remove('active');
                document.getElementById('loginModal').classList.add('active');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign Up';
                hideMessage(successDiv);
            }, 2000);
        } else {
            showError(errorDiv, result.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign Up';
        }
    } catch (error) {
        showError(errorDiv, 'An error occurred. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign Up';
    }
}

// ==================== UTILITY FUNCTIONS ====================
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    element.style.color = '#ef4444';
}

function showSuccess(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
    element.style.color = '#22c55e';
}

function hideMessage(element) {
    element.style.display = 'none';
    element.textContent = '';
}

// Make functions globally available
window.handleLoginSubmit = handleLoginSubmit;
window.handleSignUpSubmit = handleSignUpSubmit;
