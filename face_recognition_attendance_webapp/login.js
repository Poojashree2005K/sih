document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulate login validation
    if (username === 'user' && password === 'password') {
        window.location.href = 'dashboard.html'; // Redirect to the dashboard page
    } else {
        document.getElementById('error-message').classList.remove('hidden');
    }
});
