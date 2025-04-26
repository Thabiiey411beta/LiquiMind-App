const express = require('express');
const cors = require('cors');
const { fetchSupraPrice } = require('./oracle.js');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/price/:pair', async (req, res) => {
  const pair = req.params.pair || 'ETH_USD';
  const price = await fetchSupraPrice(pair);
  if (price) {
    res.json({ pair, price });
  } else {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
