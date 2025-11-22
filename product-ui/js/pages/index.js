class Products {
    constructor(api) {
        this.api = api;
        this.products_grid = document.getElementById('products-grid');
    }

    init() {
        this.fetchAndRenderProducts(1);

        document.getElementById('logout-btn').addEventListener('click', logout);

        document.getElementById('add-btn').addEventListener('click', () => {
            modal.open(null, () => this.fetchAndRenderProducts(1));
        });

        document.addEventListener('click', async (e) => {
            const target = e.target;

            if (target.classList.contains('page-btn')) {
                await this.fetchAndRenderProducts(Number(target.dataset.page));
            }
        });
    }

    async fetchAndRenderProducts(page = 1) {
        this.products_grid.textContent = '';

        try {
            const res = await this.api.get(`/products?page=${page}`);
            this.renderProducts(res.data);
            this.renderPagination(res.current_page, res.last_page);
        } catch (err) {
            const errorMsg = document.createElement('p');
            errorMsg.style.color = 'red';
            errorMsg.textContent = `Failed to load products: ${err.message}`;
            this.products_grid.appendChild(errorMsg);
        }
    }

    async deleteProduct(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await this.api.delete(`/products/${id}`);

            const current_page = document.querySelector('.page-btn.active');
            const page_num =  current_page ? Number(current_page.dataset.page) : 1;

            await this.fetchAndRenderProducts(page_num);
        } catch (err) {
            alert(`Delete error: ${err.message}`);
        }
    }

    renderProducts(products) {
        this.products_grid.textContent = '';
        const gallery = document.createElement('main');
        gallery.className = 'gallery';
        this.products_grid.appendChild(gallery);

        products.forEach(product => {
            const image = product.image
                ? `${this.api.base_url}/storage/products/${product.image}`
                : `${this.api.base_url}/storage/assets/images/product-no-image.svg`;

            const { figure, edit_button, delete_button, id } = this.createProductFigure(product, image);
            gallery.appendChild(figure);
            this.attachProductEvents({ edit_button, delete_button, id });
        });
    }

    attachProductEvents({ edit_button, delete_button, id }) {
        edit_button.addEventListener('click', async () => {
            const productData = await this.api.get(`/products/${id}`);

            if (productData) {
                modal.open(productData, () => {
                    const current_page = document.querySelector('.page-btn.active');
                    const page_num =  current_page ? Number(current_page.dataset.page) : 1;

                    this.fetchAndRenderProducts(page_num);
                });
            }
        });

        delete_button.addEventListener('click', () => this.deleteProduct(id));
    }

    createProductFigure(product, image) {
        const { id, name, price, stock } = product;

        const figure = this.addElement('figure', '', '', id);
        const figcaption = this.addElement('figcaption');
        const nameDiv = this.addElement('div', '', name);
        const priceDiv = this.addElement('div', '', `Price: ${price}`);
        const stockDiv = this.addElement('div', '', `Stock: ${stock}`);
        const buttonsDiv = this.addElement('div', 'buttons');
        const edit_button = this.addElement('button', 'edit-btn', 'Edit', id);
        const delete_button = this.addElement('button', 'delete-btn', 'Delete', id);
        const img = this.addImage(product, image);

        buttonsDiv.append(edit_button, delete_button);
        figcaption.append(nameDiv, priceDiv, stockDiv, buttonsDiv);
        figure.append(img, figcaption);

        return { figure, edit_button, delete_button, id };
    }

    addElement(tag, class_name = '', text = '', id = null) {
        const el = document.createElement(tag);
        if (class_name) el.className = class_name;
        if (text !== null && text !== undefined) el.textContent = text;
        if (id) el.dataset.id = id;
        return el;
    }

    addImage(product, image) {
        const img = document.createElement('img');
        img.alt = product.name;
        img.loading = 'lazy';
        img.src = image;
        img.onerror = () => { img.src = 'assets/images/product-no-image.svg'; };
        return img;
    }

    renderPagination(current, last) {
        const old_pagination = this.products_grid.querySelector('.pagination');

        if (old_pagination) {
            old_pagination.remove();
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

        this.products_grid.appendChild(pagination);
    }
}

const products = new Products(api);
products.init();
