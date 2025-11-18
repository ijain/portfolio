function logout() {
    localStorage.removeItem('auth_token');
    window.location.replace('/login.html?logout=' + Date.now());
}

const Api = (function () {
    class ApiClass {
        constructor(config) {
            this.url = config.getUrl();
            this.base_url = config.getBaseUrl();
        }

        async get(path) {
            const res = await fetch(this.#url(path), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            this.#error_handler(res);

            return await res.json();
        }

        async post(path, body, auth = false) {
            const headers = { 'Content-Type': 'application/json' };
            
            if (!auth) {
                headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
            }

            const res = await fetch(this.#url(path), {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            this.#error_handler(res);

            return await res.json();
        }

        async put(path, body) {
            const res = await fetch(this.#url(path), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            this.#error_handler(res);

            return await res.json();
        }

        async delete(path) {
            const res = await fetch(this.#url(path), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });
            this.#error_handler(res);

            return await res.json();
        }

        async upload(path, file) {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(this.#url(path), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            });
            this.#error_handler(res);

            return await res.json();
        }

        #url(path) {
            return this.url + (path.startsWith('/') ? path : '/' + path);
        }

        #error_handler(res) {
            if (!res.ok) {
                if (res.status === 401) {
                    logout();
                    return;
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            }
        }
    }

    return ApiClass;
})();

const api = new Api(ApiConfig.getConfig());
