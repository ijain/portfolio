// 🧱 Runs after HTML loads
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');

  // logout handler
  document.getElementById('logout-btn').addEventListener('click', logout);

  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const products = Array.isArray(json) ? json : json.data;

    renderProducts(products);
  } catch (err) {
    console.error('Failed to load products:', err);
    document.getElementById('products-grid').innerHTML =
      `<p style="color:red;">Failed to load products: ${err.message}</p>`;
  }
});

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p>${p.description ?? ''}</p>
      <p><strong>$${p.price}</strong> • ${p.stock} in stock</p>
    </div>
  `).join('');
}

function logout() {
  localStorage.removeItem('auth_token');
  sessionStorage.clear();

  // Redirect safely, add query to prevent cached guard issues
  window.location.replace('/login.html?logout=' + Date.now());
}
window.logout = logout;
