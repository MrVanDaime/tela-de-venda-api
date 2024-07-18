const { orderValidation } = require('../validation/orders');

// Controller
const { createOrder } = require('../controllers/orderController');

// Endpoint atual
const endpoint = '/api/orders';

// Dados local
// let clientsDb = require('../data/clients');
// let productsDb = require('../data/products');
// let paymentMethodsDb = require('../data/paymentMethods');
// let orders = [];

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'POST' && url === endpoint) {
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