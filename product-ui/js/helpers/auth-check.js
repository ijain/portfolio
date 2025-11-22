class AuthRedirect {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.fromLogout = this.urlParams.has('logout');
        this.authToken = localStorage.getItem('auth_token');
        this.currentPage = this.getCurrentPage();
    }

    getCurrentPage() {
        let page = window.location.pathname.split('/').pop();
        page = page.replace('.html', '');
        return page || 'index';
    }

    redirect() {
        if (!this.authToken && this.currentPage !== 'login') {
            window.location.replace('login.html');
        } else if (this.authToken && !this.fromLogout && this.currentPage !== 'index') {
            window.location.replace('index.html');
        }
    }
}

const authRedirect = new AuthRedirect();
authRedirect.redirect();

