const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');;

const searchYelp = async (term, location) => {

  // Proxy middleware for Yelp API
  app.use('/api/yelp', createProxyMiddleware({
      target: 'https://api.yelp.com/v3',
      changeOrigin: true,
      pathRewrite: {
          '^/api/yelp': '', // Remove the '/api/yelp' prefix
      },
  }));
};

module.exports = { searchYelp };