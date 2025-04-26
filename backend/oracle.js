cat <<EOF > backend/oracle.js
require("dotenv").config();
const axios = require("axios");

async function fetchOraclePrice(pair = "ETH/USD") {
  try {
    const response = await axios.get("https://supra.com/data", {
      params: { crypto_category: pair },
    });
    console.log(\`Price for \${pair}: \${response.data.price}\`);
    return response.data.price;
  } catch (error) {
    console.error("Error fetching oracle price:", error.message);
    return null;
  }
}

fetchOraclePrice();
EOF```javascript
async function fetchMultipleOraclePrices(pairs = ["ETH/USD", "BTC/USD"]) {
  const prices = {};
  for (const pair of pairs) {
    const price = await fetchOraclePrice(pair);
    if (price !== null) {
      prices[pair] = price;
    }
  }
  return prices;
}

fetchMultipleOraclePrices().then(prices => {
  console.log("Fetched prices:", prices);
});