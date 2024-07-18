// Utils
const getParamId = require('../utils/getParamId');

// Controller
const {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} = require('../controllers/paymentMethodController');

// Endpoint atual
const endpoint = '/api/payment-methods';

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === endpoint) {
    getAllPaymentMethods(res);
  } else if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const paymentMethod = getPaymentMethodById(paramId, res);

    if (!paymentMethod) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Método de Pagamento não existe' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(paymentMethod));
  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newPaymentMethod = JSON.parse(body);
      createPaymentMethod(newPaymentMethod, res);
    });
  } else if (method === 'PUT' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);

    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updatedPaymentMethod = JSON.parse(body);
      updatePaymentMethod(paramId, updatedPaymentMethod, res);
    });
  } else if (method === 'DELETE' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    deletePaymentMethod(paramId, res);
  }
};