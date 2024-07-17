/*
  /api/payment-methods/
   - title
   - installments
*/

const getParamId = require('../utils/getParamId');
const { paymentMethodValidation } = require('../validation/paymentMethods');

// Endpoint atual
const endpoint = '/api/payment-methods';

// Dados local
let paymentMethodsDb = require('../data/paymentMethods');

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === endpoint) {
    res.statusCode = 200;
    res.end(JSON.stringify(paymentMethodsDb));
  } else if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = paymentMethodsDb.findIndex(paymentMethod => paymentMethod.id === paramId);

    if (index === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Método de Pagamento não existe' }));
    }

    const paymentMethod = paymentMethodsDb[index];
    res.statusCode = 200;
    res.end(JSON.stringify(paymentMethod));
  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newPaymentMethod = JSON.parse(body);
      const validationError = paymentMethodValidation(newPaymentMethod);

      if (validationError) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: validationError }));
        return;
      }

      newPaymentMethod.id = paymentMethodsDb.length + 1;
      paymentMethodsDb.push(newPaymentMethod);

      res.statusCode = 201;
      res.end(JSON.stringify({ msg: 'Método de Pagamento cadastrado com sucesso', newPaymentMethod }))
    });
  } else if (method === 'PUT' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = paymentMethodsDb.findIndex(paymentMethod => paymentMethod.id === paramId);

    if (index !== -1) {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedPaymentMethod = JSON.parse(body);
        const validationError = paymentMethodValidation(updatedPaymentMethod);

        if (validationError) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: validationError }));
          return;
        }

        updatedPaymentMethod.id = paramId;

        paymentMethodsDb[index] = updatedPaymentMethod;

        res.statusCode = 200;
        res.end(JSON.stringify({ msg: 'Método de Pagamento atualizado com sucesso', updatedPaymentMethod }))
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Método de Pagamento não existe' }));
    }
  } else if (method === 'DELETE' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = paymentMethodsDb.findIndex(paymentMethod => paymentMethod.id === paramId);

    if (index !== -1) {
      const paymentMethod = paymentMethodsDb[index];
      paymentMethodsDb.splice(index, 1);

      res.statusCode = 200;
      res.end(JSON.stringify({ msg: 'Método de Pagamento excluído', paymentMethod }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Método de Pagamento não existe' }));
    }
  }
};