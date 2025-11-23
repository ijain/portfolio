class Login {
    constructor(form, api) {
        this.form = document.querySelector(form);
        this.api = api;

        this.email_input = this.form.querySelector('#email');
        this.password_input = this.form.querySelector('#password');
        this.login_message = this.form.querySelector('#login-message');
    }

    init() {
        this.email_input.addEventListener('input', () => this.#validateEmail());
        this.password_input.addEventListener('input', () => this.#validatePassword());
        this.form.addEventListener('submit', (e) => this.#handleSubmit(e));
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

        this.login_message.textContent = '';
        this.login_message.classList.remove('error');
    }

    #validateEmail() {
        const value = this.email_input.value.trim();
        if (!value) {
            this.#showError(this.email_input, 'Email is required.');
            return false;
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
            this.#showError(this.email_input, 'Enter a valid email.');
            return false;
        } else {
            this.#clearError(this.email_input);
            return true;
        }
    }

    #validatePassword() {
        const value = this.password_input.value.trim();
        if (!value) {
            this.#showError(this.password_input, 'Password is required.');
            return false;
        } else if (value.length < 6) {
            this.#showError(this.password_input, 'Password must be at least 6 characters.');
            return false;
        } else {
            this.#clearError(this.password_input);
            return true;
        }
    }

    async #handleSubmit(e) {
        e.preventDefault();

        const email_valid = this.#validateEmail();
        const password_valid = this.#validatePassword();

        if (!email_valid || !password_valid) return;

        await this.#handleLogin();
    }

    async #handleLogin() {
        const email = this.email_input.value.trim();
        const password = this.password_input.value.trim();

        this.login_message.textContent = 'Logging in…';
        this.login_message.className = '';
        this.login_message.style.display = 'block';

        try {
            const res = await this.api.post('/token', { email, password }, true);
            localStorage.setItem('auth_token', res.token);

            this.login_message.textContent = 'Login successful! Redirecting…';
            this.login_message.classList.add('success');

            setTimeout(() => window.location.replace('/index.html'), 150);
        } catch (err) {
            localStorage.removeItem('auth_token');
            this.login_message.textContent = err.message || err;
            this.login_message.classList.add('error');
        }
    }
}

const login = new Login('.login-form', api);
login.init();
