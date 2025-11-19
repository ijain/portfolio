const urlParams = new URLSearchParams(window.location.search);
const fromLogout = urlParams.has('logout');
const authToken = localStorage.getItem('auth_token');

let currentPage = window.location.pathname.split('/').pop();
currentPage = currentPage.replace('.html', '') || 'index';

if (!authToken && currentPage !== 'login') {
    window.location.replace('login.html');
} else if (authToken && !fromLogout && currentPage !== 'index') {
    window.location.replace('index.html');
}
