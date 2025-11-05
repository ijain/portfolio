// 🧱 Runs after HTML loads
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');

  // logout handler
  document.getElementById('logout-btn').addEventListener('click', logout);

  try {
    const res = await fetch('http://localhost:8000/api/v1/products', {
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
  const gallery = document.getElementById('products-grid');
  gallery.innerHTML = `
    <main class="gallery">
      ${products.map(p => `
        <figure>
          <img src="${p.image ? `uploads/images/${p.image}` : 'assets/images/product-no-image.svg'}" alt="${p.image}">
          <figcaption>${p.name}</figcaption>
        </figure>
      `).join('')}
    </main>
  `;
}

function logout() {
  localStorage.removeItem('auth_token');
  sessionStorage.clear();

  // Redirect safely, add query to prevent cached guard issues
  window.location.replace('/login.html?logout=' + Date.now());
}
window.logout = logout;
