// Utils
const getParamId = require('../utils/getParamId');

// Controller
const { getOrdersByClientId, createOrder } = require('../controllers/orderController');

// Endpoint atual
const endpoint = '/api/orders';

module.exports = (req, res) => {
  const { method, url } = req;

  // Get todos os pedidos por cliente
  if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const orders = getOrdersByClientId(paramId);

    if (orders.length === 0) {
      res.end(JSON.stringify({ error: 'Nenhuma compra foi feita este cliente' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(orders));
  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const newOrder = JSON.parse(body);
      createOrder(newOrder, res);
    });
  }
};