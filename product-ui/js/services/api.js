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

        get(path) {
            return fetch(this.#url(path), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(res => res.json().then(data => ({ res, data })))
                .then(({ res, data }) => {
                    const onLoginPage = window.location.pathname.includes('login');

                    if (!res.ok) {
                        if (res.status === 401 && !onLoginPage) {
                            logout();
                            return;
                        } else {
                            throw new Error(data.message || `HTTP ${res.status}`);
                        }
                    }

                    return data;
                })
                .catch(err => {
                    throw err;
                });
        }

        post(path, body, auth = false) {
            const headers = { 'Content-Type': 'application/json' };

            if (!auth) {
                headers['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;
            }

            return fetch(this.#url(path), {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })
                .then(res => {
                    return res.json().then(data => ({ res, data }));
                })
                .then(({ res, data }) => {
                    const onLoginPage = window.location.pathname.includes('login');

                    if (!res.ok) {
                        if (res.status === 401 && !onLoginPage) {
                            logout();
                            return;
                        } else {
                            throw new Error(data.message || `HTTP ${res.status}`);
                        }
                    }

                    return data;
                })
                .catch(err => {
                    throw err;
                });
        }

        put(path, body) {
            return fetch(this.#url(path), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(res => res.json().then(data => ({ res, data })))
                .then(({ res, data }) => {
                    const onLoginPage = window.location.pathname.includes('login');
                    if (!res.ok) {
                        if (res.status === 401 && !onLoginPage) {
                            logout();
                            return;
                        } else {
                            throw new Error(data.message || `HTTP ${res.status}`);
                        }
                    }
                    return data;
                })
                .catch(err => {
                    throw err;
                });
        }

        delete(path) {
            return fetch(this.#url(path), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
                .then(res => res.json().then(data => ({ res, data })))
                .then(({ res, data }) => {
                    const onLoginPage = window.location.pathname.includes('login');
                    if (!res.ok) {
                        if (res.status === 401 && !onLoginPage) {
                            logout();
                            return;
                        } else {
                            throw new Error(data.message || `HTTP ${res.status}`);
                        }
                    }
                    return data;
                })
                .catch(err => {
                    throw err;
                });
        }

        upload(path, file) {
            const formData = new FormData();
            formData.append('image', file);

            return fetch(this.#url(path), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: formData
            })
                .then(res => res.json().then(data => ({ res, data })))
                .then(({ res, data }) => {
                    const onLoginPage = window.location.pathname.includes('login');
                    if (!res.ok) {
                        if (res.status === 401 && !onLoginPage) {
                            logout();
                            return;
                        } else {
                            throw new Error(data.message || `HTTP ${res.status}`);
                        }
                    }
                    return data;
                })
                .catch(err => {
                    throw err;
                });
        }

        #url(path) {
            return this.url + (path.startsWith('/') ? path : '/' + path);
        }
    }

    return ApiClass;
})();

const api = new Api(ApiConfig.getConfig());
