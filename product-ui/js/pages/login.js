const form = document.querySelector('.login-form');
form.addEventListener('submit', handleLogin);

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const msg = document.getElementById('login-message');

    msg.textContent = 'Logging in...';
    msg.style.color = '#555';

    try {
        const res = await api.post('/token', { email, password }, true);
        localStorage.setItem('auth_token', res.token);

        setTimeout(() => window.location.replace('/index.html'), 150);
    } catch (err) {
        localStorage.removeItem('auth_token');
        msg.textContent = `Login failed: ${err.message}`;
        msg.style.color = 'red';
    }
}
