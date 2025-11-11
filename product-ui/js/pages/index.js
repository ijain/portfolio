document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('auth_token');
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('add-btn').addEventListener('click', () => {
    openProductModal(null, () => fetchAndRenderProducts(1)); // go to first page after add
  });

  let currentPage = 1;
  let lastPage = 1;

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

      window.currentProducts = json.data;
      renderProducts(json.data);
      renderPagination(currentPage, lastPage);

    } catch (err) {
      console.error('Failed to load products:', err);
      document.getElementById('products-grid').innerHTML =
        `<p style="color:red;">Failed to load products: ${err.message}</p>`;
    }
  }

  function renderProducts(products) {
    const gallery = document.getElementById('products-grid');
    gallery.innerHTML = '<main class="gallery"></main>';
    const container = gallery.querySelector('main');

    products.forEach(p => {
      const img = new Image();
      const img_url = p.image ? `${API_BASE_URL}/storage/products/${p.image}` : 'assets/images/product-no-image.svg';
      img.onload = () => addFigure(p, img_url, container);
      img.onerror = () => addFigure(p, 'assets/images/product-no-image.svg', container);
      img.src = img_url;
    });
  }

  function addFigure(product, img_url, container) {
  container.innerHTML += `
    <figure data-id="${product.id}">
      <img src="${img_url}" alt="${product.name}">
      <figcaption>
        <div>${product.name}</div>
        <div>Price: $${product.price}</div>
        <div>Stock: ${product.stock}</div>
        <button class="edit-btn" data-id="${product.id}">Edit</button>
      </figcaption>
    </figure>
  `;
}

  function renderPagination(current, last) {
    if (last <= 1) return;

    let paginationHtml = '<div class="pagination">';
  
    for (let i = 1; i <= last; i++) {
      paginationHtml += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    paginationHtml += '</div>';

    const gallery = document.getElementById('products-grid');
    gallery.insertAdjacentHTML('beforeend', paginationHtml);
  }

  // Pagination click handler
  document.addEventListener('click', e => {
    if (e.target.classList.contains('page-btn')) {
      const page = parseInt(e.target.dataset.page);
      fetchAndRenderProducts(page);
    } else if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;
      const product = currentProducts.find(p => p.id == id);
      openProductModal(product, () => fetchAndRenderProducts(currentPage));
    }
  });

  function logout() {
    localStorage.removeItem('auth_token');
    window.location.replace('/login.html?logout=' + Date.now());
  }
  window.logout = logout;
});
