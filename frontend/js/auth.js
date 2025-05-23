// Authentication related functions

// Check if user is logged in
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem('user'));

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const dashboardLink = document.getElementById('dashboard-link');
  const logoutLink = document.getElementById('logout-link');
  const errorMessage = document.getElementById('error-message');

  // Check for session expiration message
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('session') === 'expired' && errorMessage) {
    errorMessage.textContent = 'Your session has expired. Please log in again.';
    errorMessage.style.display = 'block';
  }

  if (user) {
    // User is logged in
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'inline-block';
    if (logoutLink) {
      logoutLink.style.display = 'inline-block';
      logoutLink.addEventListener('click', logout);
    }

    // Verify session is still valid
    verifySession();

    // Check for URL parameters after Google login
    checkGoogleAuthRedirect();
  } else {
    // User is not logged in
    if (loginLink) loginLink.style.display = 'inline-block';
    if (registerLink) registerLink.style.display = 'inline-block';
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'none';

    // Check for URL parameters after Google login
    checkGoogleAuthRedirect();
  }
}

// Logout function
async function logout(e) {
  if (e) e.preventDefault();

  try {
    await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Clear user from localStorage
    localStorage.removeItem('user');

    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Verify if the session is still valid
async function verifySession() {
  return new Promise(async (resolve, reject) => {
    // Only check once every minute to avoid excessive API calls
    // but still catch session expiration quickly
    const lastCheck = localStorage.getItem('session_last_check');
    const now = Date.now();
    if (lastCheck && now - parseInt(lastCheck) < 60 * 1000) {
      return resolve(); // Skip check if we checked recently
    }

    try {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Session expired
          console.warn('Session verification failed - clearing user data');
          localStorage.removeItem('user');
          localStorage.removeItem('session_last_check');
          window.location.href = '/login.html?session=expired';
          return reject(new Error('Session expired'));
        }
        return reject(new Error('Failed to verify session'));
      } else {
        // Session is valid, update user data
        const data = await response.json();
        if (data.user) {
          // Update the user data in localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      // Update last check timestamp
      localStorage.setItem('session_last_check', now.toString());
      resolve();
    } catch (error) {
      console.error('Error verifying session:', error);
      // Don't log out on network errors, but reject the promise
      reject(error);
    }
  });
}

// Check for Google auth redirect
function checkGoogleAuthRedirect() {
  // After Google login, the user will be redirected to the dashboard
  // We need to fetch the current user info to update localStorage
  if (window.location.pathname === '/dashboard.html' && !localStorage.getItem('user')) {
    console.log('Detected potential Google auth redirect to dashboard');
    // This will be handled by the dashboard.html page itself
    return;
  }

  // Check for error parameter in URL (from Google auth failure)
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  if (error) {
    console.error('Google authentication error:', error);
    // Display error message to user
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
      errorElement.textContent = `Google authentication failed: ${error}`;
      errorElement.style.display = 'block';
    }
  }
}
