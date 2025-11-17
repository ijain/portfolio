let currentPage = 1;
let lastPage = 1;
let currentProducts = [];

fetchAndRenderProducts(currentPage);

document.getElementById('logout-btn').addEventListener('click', logout);

document.getElementById('add-btn').addEventListener('click', () => {
    openProductModal(null, () => fetchAndRenderProducts(1));
});

document.addEventListener('click', async e => {
    if (e.target.classList.contains('page-btn')) {
        const page = parseInt(e.target.dataset.page);
        fetchAndRenderProducts(page);
    } else if (e.target.classList.contains('edit-btn')) {
        const product = currentProducts.find(item => item.id == e.target.dataset.id);
        openProductModal(product, () => fetchAndRenderProducts(currentPage));
    } else if (e.target.classList.contains('delete-btn')) {
        deleteProduct(e.target.dataset.id);
    }
});

async function fetchAndRenderProducts(page = 1) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products?page=${page}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });

        if (res.status === 401) {
            logout();
            return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        currentPage = json.current_page;
        lastPage = json.last_page;
        currentProducts = json.data;

        renderProducts(currentProducts);
        renderPagination(currentPage, lastPage);

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
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
            });

            if (!res.ok) {
                throw new Error(`Delete failed: ${res.status}`);
            }

            fetchAndRenderProducts(currentPage);
        } catch (err) {
            throw new Error(`Delete error: ${err}`)
        }
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-grid');
    const gallery = document.createElement('main');

    gallery.className = 'gallery';
    container.textContent = '';
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

function addElement(element_name, class_name = '', text_content = '', id = null) {
    element = document.createElement(element_name);

    if (class_name !== '') {
        element.className = class_name;
    }
    if (text_content !== '') {
        element.textContent = text_content;
    }
    if (id) {
        element.dataset.id = id;
    }

    return element;
}

function addElementImage(product, image) {
    const img = document.createElement('img');

    img.alt = product.name;
    img.loading = 'lazy';

    img.onerror = () => {
        img.src = 'assets/images/product-no-image.svg';
    };

    img.src = image;

    return img;
}

function renderPagination(current, last) {
    if (last <= 1) {
        return;
    }

    const container = document.getElementById('products-grid');
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

function logout() {
    localStorage.removeItem('auth_token');
    window.location.replace('/login.html?logout=' + Date.now());
}

