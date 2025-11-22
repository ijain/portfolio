const ApiConfig = (function () {
    const base_url = 'http://localhost:8000';
    const version = 'v1';
    const url = base_url + '/api/' + version;

    function getConfig() {
        return {
            getBaseUrl: () => base_url,
            getUrl: () => url
        };
    }

    return { getConfig };
})();
