/* =========================================
   1. UTILITIES & CRYPTOGRAPHY
   ========================================= */

/**
 * Uses the native Web Crypto API to generate a secure SHA-256 hash.
 * This ensures passwords are NEVER stored in plain text.
 */
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/* =========================================
   2. DOM ELEMENT SELECTION
   ========================================= */
// Auth Forms (index.html)
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

const regError = document.getElementById('reg-error');
const regSuccess = document.getElementById('reg-success');
const loginError = document.getElementById('login-error');

// Dashboard Elements (dashboard.html)
const logoutBtn = document.getElementById('logout-btn');
const authOverlay = document.getElementById('auth-check-overlay');
const welcomeMsg = document.getElementById('welcome-msg');

/* =========================================
   3. ROUTING & SESSION MANAGEMENT
   ========================================= */

// Check if a user is currently logged in
const activeUser = localStorage.getItem('activeSession');

// Determine which page we are currently on based on DOM elements
const isDashboard = document.querySelector('.dashboard-container') !== null;

if (isDashboard) {
    // DASHBOARD LOGIC: Protect the route
    if (!activeUser) {
        // No session found! Kick them back to the login page immediately.
        window.location.replace('index.html');
    } else {
        // Session valid. Remove the security overlay and personalize the UI.
        setTimeout(() => {
            authOverlay.style.display = 'none';
            welcomeMsg.textContent = `Welcome, ${activeUser}!`;
        }, 500); // Artificial delay to show the "Verifying..." UI
    }
} else {
    // LOGIN PAGE LOGIC: Prevent logged-in users from seeing the login screen
    if (activeUser) {
        window.location.replace('dashboard.html');
    }
}

/* =========================================
   4. UI TOGGLING (INDEX.HTML)
   ========================================= */
if (showRegisterBtn && showLoginBtn) {
    showRegisterBtn.addEventListener('click', () => {
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
        clearMessages();
    });

    showLoginBtn.addEventListener('click', () => {
        registerSection.classList.remove('active');
        loginSection.classList.add('active');
        clearMessages();
    });
}

function clearMessages() {
    regError.style.display = 'none';
    regSuccess.style.display = 'none';
    loginError.style.display = 'none';
    if(registerForm) registerForm.reset();
    if(loginForm) loginForm.reset();
}

/* =========================================
   5. REGISTRATION LOGIC
   ========================================= */
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;

        // Validation: Minimum 8 characters, at least 1 number
        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            showError(regError, 'Password must be at least 8 characters and contain a number.');
            return;
        }

        // Fetch existing users or initialize empty database
        const usersDB = JSON.parse(localStorage.getItem('usersDB')) || {};

        // Validation: Duplicate username or email check
        if (usersDB[username] || Object.values(usersDB).some(u => u.email === email)) {
            showError(regError, 'Username or email already exists.');
            return;
        }

        // Hash password and save user
        const hashedPassword = await hashPassword(password);
        usersDB[username] = {
            email: email,
            password: hashedPassword
        };
        
        localStorage.setItem('usersDB', JSON.stringify(usersDB));
        
        // Success UI state
        regError.style.display = 'none';
        regSuccess.textContent = 'Account created successfully! You can now log in.';
        regSuccess.style.display = 'block';
        registerForm.reset();
    });
}

/* =========================================
   6. LOGIN LOGIC
   ========================================= */
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const identifier = document.getElementById('login-username').value.trim(); // Can be username or email
        const password = document.getElementById('login-password').value;

        const usersDB = JSON.parse(localStorage.getItem('usersDB')) || {};
        
        // Attempt to find the user by username OR email
        let foundUsername = null;
        if (usersDB[identifier]) {
            foundUsername = identifier;
        } else {
            // Search by email
            foundUsername = Object.keys(usersDB).find(key => usersDB[key].email === identifier);
        }

        // If user exists, verify the hash
        if (foundUsername) {
            const hashedPassword = await hashPassword(password);
            if (usersDB[foundUsername].password === hashedPassword) {
                // SUCCESS: Create a session token (in this case, just storing the username)
                localStorage.setItem('activeSession', foundUsername);
                window.location.replace('dashboard.html');
                return;
            }
        }

        // FAILURE: Ambiguous error message (security best practice)
        showError(loginError, 'Invalid username or password.');
    });
}

/* =========================================
   7. LOGOUT LOGIC (DASHBOARD.HTML)
   ========================================= */
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        // Destroy the session
        localStorage.removeItem('activeSession');
        // Redirect to login
        window.location.replace('index.html');
    });
}

// Utility to display error messages clearly
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}