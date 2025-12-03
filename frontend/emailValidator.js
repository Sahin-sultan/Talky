// Email validation with visual feedback

// Email validation regex
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate login email
const loginEmailInput = document.getElementById('loginEmail');
const loginEmailValidator = document.getElementById('loginEmailValidator');

if (loginEmailInput && loginEmailValidator) {
    loginEmailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email.length === 0) {
            loginEmailValidator.className = 'email-validator';
        } else if (isValidEmail(email)) {
            loginEmailValidator.className = 'email-validator valid';
        } else {
            loginEmailValidator.className = 'email-validator invalid';
        }
    });
}

// Validate signup email
const signUpEmailInput = document.getElementById('signUpEmail');
const signUpEmailValidator = document.getElementById('signUpEmailValidator');

if (signUpEmailInput && signUpEmailValidator) {
    signUpEmailInput.addEventListener('input', function() {
        const email = this.value.trim();
        
        if (email.length === 0) {
            signUpEmailValidator.className = 'email-validator';
        } else if (isValidEmail(email)) {
            signUpEmailValidator.className = 'email-validator valid';
        } else {
            signUpEmailValidator.className = 'email-validator invalid';
        }
    });
}
