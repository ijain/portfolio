fetchAndRenderProducts(document.querySelector('.page-btn.active'));

document.getElementById('logout-btn').addEventListener('click', logout);

document.getElementById('add-btn').addEventListener('click', () => {
    openProductModal(null, () => fetchAndRenderProducts(1));
});

document.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.classList.contains('page-btn')) {
        await fetchAndRenderProducts(Number(target.dataset.page));
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
        await fetchAndRenderProducts(document.querySelector('.page-btn.active'));
    } catch (err) {
        alert(`Delete error: ${err.message}`);
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-grid');
    container.textContent = ''; // clear previous content

    const gallery = document.createElement('main');
    gallery.className = 'gallery';
    container.appendChild(gallery);

    products.forEach(product => {
        const image = product.image
            ? `${api.base_url}/storage/products/${product.image}`
            : `${api.base_url}/storage/assets/images/product-no-image.svg`;

        const { figure, editButton, deleteButton, id } = createProductFigure(product, image);
        gallery.appendChild(figure);
        attachProductEvents({ editButton, deleteButton, id });
    });
}

function attachProductEvents({ editButton, deleteButton, id }) {
    editButton.addEventListener('click', async () => {
        const productData = await api.get(`/products/${id}`);
        if (productData) {
            openProductModal(productData, () => {
                const activePage = document.querySelector('.page-btn.active');
                fetchAndRenderProducts(activePage);
            });
        }
    });

    deleteButton.addEventListener('click', () => {
        deleteProduct(id);
    });
}

function createProductFigure(product, image) {
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

    return { figure, editButton, deleteButton, id };
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
        button.dataset.page = String(i);
        button.textContent = String(i);
        pagination.appendChild(button);
    }

    container.appendChild(pagination);
}

