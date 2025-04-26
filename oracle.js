const axios = require('axios');

async function fetchSupraPrice(pair = 'ETH_USD') {
  try {
    const response = await axios.get('https://api.supraoracles.com/v1/price', {
      params: { pair }
    });
    return response.data.price;
  } catch (error) {
    console.error('Error fetching price from Supra Oracle:', error);
    return null;
  }
}

module.exports = { fetchSupraPrice };
