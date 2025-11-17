let currentPage = 1;
let lastPage = 1;
let currentProducts = [];

fetchAndRenderProducts(currentPage);

document.getElementById('logout-btn').addEventListener('click', logout);

document.getElementById('add-btn').addEventListener('click', () => {
    openProductModal(null, () => fetchAndRenderProducts(1));
});

document.addEventListener('click', e => {
    const target = e.target;
    if (target.classList.contains('page-btn')) {
        fetchAndRenderProducts(parseInt(target.dataset.page));
    } else if (target.classList.contains('edit-btn')) {
        const product = currentProducts.find(p => p.id == target.dataset.id);
        openProductModal(product, () => fetchAndRenderProducts(currentPage));
    } else if (target.classList.contains('delete-btn')) {
        deleteProduct(target.dataset.id);
    }
});

window.addEventListener('resize', () => fillLastRow());

async function fetchAndRenderProducts(page = 1) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products?page=${page}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });

        if (res.status === 401) { logout(); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        currentPage = json.current_page;
        lastPage = json.last_page;
        currentProducts = json.data;

        renderProducts(currentProducts);
        renderPagination(currentPage, lastPage);
        fillLastRow();
    } catch (err) {
        const grid = document.getElementById('products-grid');
        grid.textContent = '';
        const errorMsg = document.createElement('p');
        errorMsg.style.color = 'red';
        errorMsg.textContent = `Failed to load products: ${err.message}`;
        grid.appendChild(errorMsg);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
        fetchAndRenderProducts(currentPage);
    } catch (err) {
        alert(`Delete error: ${err.message}`);
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-grid');
    container.textContent = '';

    const gallery = document.createElement('main');
    gallery.className = 'gallery';
    container.appendChild(gallery);

    products.forEach(item => {
        const image = item.image
            ? `${API_BASE_URL}/storage/products/${item.image}`
            : 'assets/images/product-no-image.svg';
        addFigure(item, image, gallery);
    });
}

function addFigure(product, image, container) {
    const figure = addElement('figure', '', '', product.id);
    const figcaption = addElement('figcaption');
    const nameDiv = addElement('div', '', product.name);
    const priceDiv = addElement('div', '', `Price: $${product.price}`);
    const stockDiv = addElement('div', '', `Stock: ${product.stock}`);
    const buttonsDiv = addElement('div', 'buttons');
    const editButton = addElement('button', 'edit-btn', 'Edit', product.id);
    const deleteButton = addElement('button', 'delete-btn', 'Delete', product.id);
    const img = addElementImage(product, image);

    buttonsDiv.append(editButton, deleteButton);
    figcaption.append(nameDiv, priceDiv, stockDiv, buttonsDiv);
    figure.append(img, figcaption);
    container.appendChild(figure);
}

function addElement(name, className = '', text = '', id = null) {
    const el = document.createElement(name);
    if (className) el.className = className;
    if (text) el.textContent = text;
    if (id) el.dataset.id = id;
    return el;
}

function addElementImage(product, image) {
    const img = document.createElement('img');
    img.alt = product.name;
    img.loading = 'lazy';
    img.src = image;
    img.onerror = () => { img.src = 'assets/images/product-no-image.svg'; };
    return img;
}

function renderPagination(current, last) {
    const container = document.getElementById('products-grid');
    const oldPagination = container.querySelector('.pagination');
    if (oldPagination) oldPagination.remove();

    if (last <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    for (let i = 1; i <= last; i++) {
        const button = document.createElement('button');
        button.className = 'page-btn' + (i === current ? ' active' : '');
        button.dataset.page = i;
        button.textContent = i;
        pagination.appendChild(button);
    }

    container.appendChild(pagination);
}

function fillLastRow() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    // remove old placeholders
    gallery.querySelectorAll('figure').forEach(f => {
        if (f.style.visibility === 'hidden') f.remove();
    });

    const figures = gallery.querySelectorAll('figure');
    if (!figures.length) return;

    const containerWidth = gallery.clientWidth;
    const minItemWidth = 220;
    const gap = 20;
    const cols = Math.floor((containerWidth + gap) / (minItemWidth + gap));
    const remainder = figures.length % cols;
    if (remainder === 0) return;

    const placeholders = cols - remainder;
    for (let i = 0; i < placeholders; i++) {
        const ph = document.createElement('figure');
        ph.style.visibility = 'hidden';
        gallery.appendChild(ph);
    }
}

function logout() {
    localStorage.removeItem('auth_token');
    window.location.replace('/login.html?logout=' + Date.now());
}
