const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/thredds',
        createProxyMiddleware({
            target: 'http://127.0.0.1:80',
            changeOrigin: true,
            pathRewrite: {
                '^/thredds': ''
            }
        })

    );
};