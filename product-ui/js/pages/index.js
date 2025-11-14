document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token');
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('add-btn').addEventListener('click', () => {
    openProductModal(null, () => fetchAndRenderProducts(1)); // refresh after add
  });

  let currentPage = 1;
  let lastPage = 1;
  let currentProducts = [];

  fetchAndRenderProducts(currentPage);

  async function fetchAndRenderProducts(page = 1) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products?page=${page}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      currentPage = json.current_page;
      lastPage = json.last_page;
      currentProducts = json.data;

      renderProducts(currentProducts);
      renderPagination(currentPage, lastPage);

    } catch (err) {
      console.error('Failed to load products:', err);
      document.getElementById('products-grid').innerHTML =
        `<p style="color:red;">Failed to load products: ${err.message}</p>`;
    }
  }

  function renderProducts(products) {
    const gallery = document.getElementById('products-grid');

    // Reset gallery and create wrapper
    gallery.innerHTML = '<main class="gallery"></main>';
    const container = gallery.querySelector('main');

    products.forEach(p => {
      const imgUrl = p.image
        ? `${API_BASE_URL}/storage/products/${p.image}`
        : 'assets/images/product-no-image.svg';

      addFigure(p, imgUrl, container);
    });
  }

  function addFigure(product, imgUrl, container) {
    const figure = document.createElement('figure');
    figure.dataset.id = product.id;

    figure.innerHTML = `
      <img src="" alt="${product.name}" loading="lazy">
      <figcaption>
        <div>${product.name}</div>
        <div>Price: $${product.price}</div>
        <div>Stock: ${product.stock}</div>
        <div class="buttons">
          <button class="edit-btn" data-id="${product.id}">Edit</button>
          <button class="delete-btn" data-id="${product.id}">Delete</button>
        </div>
      </figcaption>
    `;

    const img = figure.querySelector("img");

    // Load image safely
    img.onerror = () => {
      img.src = 'assets/images/product-no-image.svg';
    };

    // Set src AFTER adding element for stable layout
    img.src = imgUrl;

    container.appendChild(figure);
  }

  function renderPagination(current, last) {
    if (last <= 1) return;

    let html = '<div class="pagination">';
    for (let i = 1; i <= last; i++) {
      html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += '</div>';

    document.getElementById('products-grid').insertAdjacentHTML('beforeend', html);
  }

  document.addEventListener('click', async e => {
    if (e.target.classList.contains('page-btn')) {
      const page = parseInt(e.target.dataset.page);
      fetchAndRenderProducts(page);
    } else if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;
      const product = currentProducts.find(p => p.id == id);
      openProductModal(product, () => fetchAndRenderProducts(currentPage));
    } else if (e.target.classList.contains('delete-btn')) {
      const id = e.target.dataset.id;
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
          fetchAndRenderProducts(currentPage);
        } catch (err) {
          console.error('Delete error:', err);
        }
      }
    }
  });

  function logout() {
    localStorage.removeItem('auth_token');
    window.location.replace('/login.html?logout=' + Date.now());
  }
  window.logout = logout;
});
