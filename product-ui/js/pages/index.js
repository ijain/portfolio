// 🧱 Runs after HTML loads
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('auth_token');

  // logout handler
  document.getElementById('logout-btn').addEventListener('click', logout);

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products`, {
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
  gallery.innerHTML = '<main class="gallery"></main>'; // placeholder container
  const container = gallery.querySelector('main');

  products.forEach(p => {
    const img = new Image();
    const img_url = p.image ? `${API_BASE_URL}/storage/products/${p.image}` : 'assets/images/product-no-image.svg';

    img.onload = () => {
      container.innerHTML += `
        <figure>
          <img src="${img_url}" alt="${p.name}">
          <figcaption>${p.name}</figcaption>
        </figure>
      `;
    };

    img.onerror = () => {
      const fallback_url = 'assets/images/product-no-image.svg';
      container.innerHTML += `
        <figure>
          <img src="${fallback_url}" alt="${p.name}">
          <figcaption>${p.name}</figcaption>
        </figure>
      `;
    };

    img.src = img_url; // triggers load/error check
  });
}


function renderProducts1(products) {
  const gallery = document.getElementById('products-grid');
  gallery.innerHTML = `
    <main class="gallery">
      ${products.map(p => `
        <figure>
          <img src="${p.image ? `${API_BASE_URL}/storage/products/${p.image}` : 'assets/images/product-no-image.svg'}" alt="${p.name}">
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
