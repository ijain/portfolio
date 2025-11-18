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
        fetchAndRenderProducts(Number(target.dataset.page));
        return;
    }

    if (target.classList.contains('edit-btn')) {
        const product = currentProducts.find(p => p.id == target.dataset.id);

        if (!product) {
            return;
        }

        openProductModal(product, () => fetchAndRenderProducts(currentPage));
        return;
    }

    if (target.classList.contains('delete-btn')) {
        deleteProduct(target.dataset.id);
        return;
    }
});


async function fetchAndRenderProducts(page = 1) {
    const grid = document.getElementById('products-grid');
    grid.textContent = '';

    try {
        const res = await api.get(`/products?page=${page}`);
        renderProducts(res.data);
        renderPagination(res.current_page, res.last_page);
    } catch (err) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = 'red';
        errorMsg.textContent = `Failed to load products: ${err.message}`;
        grid.appendChild(errorMsg);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        await api.delete(`/products/${id}`);
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
            ? `${api.base_url}/storage/products/${item.image}`
            : 'assets/images/product-no-image.svg';
        addFigure(item, image, gallery);
    });
}

function addFigure(product, image, container) {
    const { id, name, price, stock } = product;

    const figure = addElement('figure', '', '', id);
    const figcaption = addElement('figcaption');
    const nameDiv = addElement('div', '', name);
    const priceDiv = addElement('div', '', `Price: ${price}`);
    const stockDiv = addElement('div', '', `Stock: ${stock}`);
    const buttonsDiv = addElement('div', 'buttons');
    const editButton = addElement('button', 'edit-btn', 'Edit', id);
    const deleteButton = addElement('button', 'delete-btn', 'Delete', id);
    const img = addImage(product, image);

    buttonsDiv.append(editButton, deleteButton);
    figcaption.append(nameDiv, priceDiv, stockDiv, buttonsDiv);
    figure.append(img, figcaption);
    container.appendChild(figure);
}

function addElement(name, className = '', text = '', id = null) {
    const element = document.createElement(name);

    if (className) {
        element.className = className;
    }
    if (text !== null && text !== undefined) {
        element.textContent = text;
    }
    if (id) {
        element.dataset.id = id;
    }

    return element;
}

function addImage(product, image) {
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

    if (oldPagination) {
        oldPagination.remove();
    }

    if (last <= 1) {
        return;
    }

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

