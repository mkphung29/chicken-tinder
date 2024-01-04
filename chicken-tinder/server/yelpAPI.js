const axios = require('axios');

const API_HOST = 'https://api.yelp.com';
const SEARCH_PATH = '/v3/businesses/search';
const BUSINESS_PATH = '/v3/businesses/';
const API_KEY = 'API_KEY';

const searchYelp = async (term, location) => {
    const url = `${API_HOST}${SEARCH_PATH}`;
    const params = {
      term: term,
      location: location,
      limit: 1, 
    };
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        params: params,
      });
  
      return response.data.businesses;
    } catch (error) {
      console.error('Error during Yelp search:', error);
      throw error;
    }
  };
  
  module.exports = { searchYelp };