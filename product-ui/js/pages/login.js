document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  form.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const msg = document.getElementById('login-message');

  msg.textContent = 'Logging in...';
  msg.style.color = '#555';

  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Login failed');
    }

    const data = await res.json();
    localStorage.setItem('auth_token', data.token);

    msg.textContent = '✅ Logged in successfully!';
    msg.style.color = 'green';

    setTimeout(() => window.location.replace('/index.html'), 150);
  } catch (err) {
    msg.textContent = `❌ Login failed: ${err.message}`;
    msg.style.color = 'red';
  }
}
