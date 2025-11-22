window.openProductModal = function (product, onClose) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    modal.classList.add('show');
    modal.innerHTML = `
  <div>
    <h3>${product ? 'Edit Product' : 'Add Product'}</h3>
    <form id="modal-form">
      <label>Name: <input type="text" id="modal-name" value="${product ? product.name : ''}" required></label><br>
      <label>Description: <input type="text" id="modal-description" value="${product ? product.description || '' : ''}"></label><br>
      <label>Price: <input type="number" id="modal-price" step="0.01" value="${product ? product.price : ''}" required></label><br>
      <label>In stock: <input type="number" id="modal-stock" value="${product ? product.stock : 0}" min="0" required></label><br>
      <label class="file-label">
        <input type="file" id="modal-image">
        <span class="file-btn">Choose File</span>
        <span id="file-name">${product && product.image ? product.image : 'No file selected'}</span>
      </label><br>
      <button type="submit">${product ? 'Save' : 'Add'}</button>
      <button type="button" id="modal-close">Cancel</button>
    </form>
  </div>
`;

    // Close modal
    const closeBtn = document.getElementById('modal-close');
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));

    const fileInput = document.getElementById('modal-image');
    const fileNameSpan = document.getElementById('file-name');

    // Truncate filename utility
    function truncateFilename(name, maxLength = 20) {
        if (!name) return '';
        const dotIndex = name.lastIndexOf('.');
        if (dotIndex === -1 || name.length <= maxLength) return name;

        const ext = name.slice(dotIndex);
        const base = name.slice(0, dotIndex);

        if (base.length > maxLength - ext.length - 3) {
            return base.slice(0, maxLength - ext.length - 3) + '...' + ext;
        } else {
            return base + ext;
        }
    }

    // Initial filename for Edit
    fileNameSpan.textContent = truncateFilename(fileNameSpan.textContent);

    // Update on file selection
    fileInput.addEventListener('change', () => {
        const fullName = fileInput.files.length > 0 ? fileInput.files[0].name : '';
        fileNameSpan.textContent = truncateFilename(fullName);
    });

    // Form submit
    const form = document.getElementById('modal-form');
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name = document.getElementById('modal-name').value;
        const description = document.getElementById('modal-description').value;
        const price = parseFloat(document.getElementById('modal-price').value);
        const stock = parseInt(document.getElementById('modal-stock').value);
        //const imageFile = document.getElementById('modal-image').files[0];
        const imageFile = fileInput.files[0];

        const token = localStorage.getItem('auth_token');
        let productId = product ? product.id : null;
        let resultProduct = null;

        try {
            // 1️⃣ Create or Update product
            if (!productId) {
                const res = await fetch(`${api.base_url}/api/v1/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, description, price, stock })
                });

                if (res.status === 401) {
                    logout();
                    return;
                }

                if (!res.ok) throw new Error(`Create product failed: ${res.status}`);
                resultProduct = await res.json();
                productId = resultProduct.id;
            } else {
                const res = await fetch(`${api.base_url}/api/v1/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name, description, price, stock })
                });

                if (res.status === 401) {
                    logout();
                    return;
                }

                if (!res.ok) throw new Error(`Update product failed: ${res.status}`);
                resultProduct = await res.json();
            }

            // 2️⃣ Upload image if selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const res = await fetch(`${api.base_url}/api/v1/products/${productId}/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
                const json = await res.json();
                resultProduct.image = json.image;
            }

            // 3️⃣ Close modal
            modal.classList.remove('show');

            // 4️⃣ Notify parent to refetch products
            if (typeof onClose === 'function') onClose();

        } catch (err) {
            console.error('Modal error:', err);
        }
    });
};
