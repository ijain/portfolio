class ProductModal {
    constructor(modal_id = 'product-modal') {
        this.modal = document.getElementById(modal_id);

        if (!this.modal) {
            throw new Error(`Modal element with id "${modal_id}" not found.`);
        }
    }

    open(product = null, onClose = null) {
        this.product = product;
        this.onClose = onClose;
        this.modal.textContent = '';
        this.modal.classList.add('show');

        const wrapper = document.createElement('div');
        const title = document.createElement('h3');

        title.textContent = product ? 'Edit Product' : 'Add Product';
        wrapper.appendChild(title);

        const form = document.createElement('form');
        form.id = 'modal-form';

        this.nameInput = this.#createInput({ labelText: 'Name', id: 'modal-name', value: product ? product.name : '' }, form);
        this.descInput = this.#createInput({ labelText: 'Description', id: 'modal-description', value: product ? product.description || '' : '' }, form);
        this.priceInput = this.#createInput({ labelText: 'Price', id: 'modal-price', type: 'number', value: product ? product.price : '' }, form);
        this.stockInput = this.#createInput({ labelText: 'In stock', id: 'modal-stock', type: 'number', value: product ? product.stock : 0 }, form);

        const fileLabel = document.createElement('label');
        fileLabel.className = 'file-label';

        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.id = 'modal-image';

        const fileBtn = document.createElement('span');
        fileBtn.className = 'file-btn';
        fileBtn.textContent = 'Choose File';

        this.fileNameSpan = document.createElement('span');
        this.fileNameSpan.id = 'file-name';
        this.fileNameSpan.textContent = product && product.image ? this.#truncateFilename(product.image) : 'No file selected';

        fileLabel.appendChild(this.fileInput);
        fileLabel.appendChild(fileBtn);
        fileLabel.appendChild(this.fileNameSpan);

        form.appendChild(fileLabel);
        form.appendChild(document.createElement('br'));

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = product ? 'Save' : 'Add';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'modal-close';
        cancelBtn.textContent = 'Cancel';

        form.appendChild(submitBtn);
        form.appendChild(cancelBtn);

        wrapper.appendChild(form);
        this.modal.appendChild(wrapper);

        this.form = form;
        this.closeBtn = cancelBtn;

        this.#bindEvents();
    }

    #createInput({ labelText, type = 'text', id, value = '' }, form) {
        const label = document.createElement('label');
        label.textContent = labelText + ': ';

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;

        label.appendChild(input);
        form.appendChild(label);
        form.appendChild(document.createElement('br'));

        return input;
    }

    #bindEvents() {
        this.closeBtn.addEventListener('click', () => {
            this.modal.classList.remove('show');
        });

        this.fileInput.addEventListener('change', () => {
            const fullName = this.fileInput.files.length > 0 ? this.fileInput.files[0].name : '';
            this.fileNameSpan.textContent = this.#truncateFilename(fullName);
        });

        this.nameInput.addEventListener('input', () => this.#validateName());
        this.priceInput.addEventListener('input', () => this.#validatePrice());
        this.stockInput.addEventListener('input', () => this.#validateStock());

        this.form.addEventListener('submit', (e) => this.#handleSubmit(e));
    }

    #truncateFilename(name, maxLength = 20) {
        if (!name) {
            return '';
        }

        const dotIndex = name.lastIndexOf('.');

        if (dotIndex === -1 || name.length <= maxLength) {
            return name;
        }

        const ext = name.slice(dotIndex);
        const base = name.slice(0, dotIndex);

        if (base.length > maxLength - ext.length - 3) {
            return base.slice(0, maxLength - ext.length - 3) + '...' + ext;
        }

        return base + ext;
    }

    #showError(input, message) {
        let error = input.nextElementSibling;

        if (!error || !error.classList.contains('error')) {
            error = document.createElement('span');
            error.className = 'error';
            input.after(error);
        }

        error.textContent = message;
        input.classList.add('invalid');
    }

    #clearError(input) {
        const error = input.nextElementSibling;

        if (error && error.classList.contains('error')) {
            error.textContent = '';
        }

        input.classList.remove('invalid');
    }

    #validateName() {
        const value = this.nameInput.value.trim();

        if (!value) {
            this.#showError(this.nameInput, 'Name is required.');
            return false;
        }

        this.#clearError(this.nameInput);

        return true;
    }

    #validatePrice() {
        const value = parseFloat(this.priceInput.value);

        if (isNaN(value) || value <= 0) {
            this.#showError(this.priceInput, 'Price must be a positive number.');
            return false;
        }

        this.#clearError(this.priceInput);

        return true;
    }

    #validateStock() {
        const value = parseInt(this.stockInput.value);

        if (isNaN(value) || value < 0) {
            this.#showError(this.stockInput, 'Stock must be zero or more.');
            return false;
        }

        this.#clearError(this.stockInput);

        return true;
    }

    #validateAll() {
        return this.#validateName() && this.#validatePrice() && this.#validateStock();
    }

    async #handleSubmit(e) {
        e.preventDefault();

        if (!this.#validateAll()) {
            return;
        }

        const name = this.nameInput.value;
        const description = this.descInput.value;
        const price = parseFloat(this.priceInput.value);
        const stock = parseInt(this.stockInput.value);
        const imageFile = this.fileInput.files[0];

        let product_id = this.product ? this.product.id : null;
        let res = null;

        try {
            if (!product_id) {
                res = await api.post('/products', { name, description, price, stock });
                product_id = res.id;
            } else {
                res = await api.put(`/products/${product_id}`, { name, description, price, stock });
            }

            if (imageFile) {
                const json = await api.upload(`/products/${product_id}/upload`, imageFile);
                res.image = json.image;
            }

            this.modal.classList.remove('show');

            if (typeof this.onClose === 'function') {
                this.onClose();
            }
        } catch (err) {
            console.error('Modal error:', err);
        }
    }
}

const modal = new ProductModal();
