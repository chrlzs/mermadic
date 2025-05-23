// Authentication related functions

// Check if user is logged in
function checkAuthStatus() {
  const user = JSON.parse(localStorage.getItem('user'));

  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const dashboardLink = document.getElementById('dashboard-link');
  const logoutLink = document.getElementById('logout-link');

  if (user) {
    // User is logged in
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'inline-block';
    if (logoutLink) {
      logoutLink.style.display = 'inline-block';
      logoutLink.addEventListener('click', logout);
    }

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

// Check for Google auth redirect
function checkGoogleAuthRedirect() {
  // After Google login, the user will be redirected to the dashboard
  // We need to fetch the current user info to update localStorage
  if (window.location.pathname === '/dashboard.html' && !localStorage.getItem('user')) {
    // Fetch current user info
    fetch('/api/users/me')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not authenticated');
      })
      .then(data => {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch(error => {
        console.error('Error fetching user after Google login:', error);
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
      });
  }
}
