/*
  /api/products/
   - title
   - quantity
   - price
*/

const getParamId = require('../utils/getParamId');
const { productValidation } = require('../validation/products');

// Endpoint atual
const endpoint = '/api/products';

// Dados local
let productsDb = require('../data/products');

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === endpoint) {
    res.statusCode = 200;
    res.end(JSON.stringify(productsDb));
  } else if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = productsDb.findIndex(product => product.id === paramId);

    if (index === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Produto não existe' }));
    }

    const product = productsDb[index];
    res.statusCode = 200;
    res.end(JSON.stringify(product));
  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newProduct = JSON.parse(body);
      const validationError = productValidation(newProduct);

      if (validationError) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: validationError }));
        return;
      }

      newProduct.id = productsDb.length + 1;
      productsDb.push(newProduct);

      res.statusCode = 201;
      res.end(JSON.stringify({ msg: 'Produto cadastrado com sucesso', newProduct }))
    });
  } else if (method === 'PUT' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = productsDb.findIndex(product => product.id === paramId);

    if (index !== -1) {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedProduct = JSON.parse(body);
        const validationError = productValidation(updatedProduct);

        if (validationError) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: validationError }));
          return;
        }

        updatedProduct.id = paramId;

        productsDb[index] = updatedProduct;

        res.statusCode = 200;
        res.end(JSON.stringify({ msg: 'Produto atualizado com sucesso', updatedProduct }))
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Produto não existe' }));
    }
  } else if (method === 'DELETE' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = productsDb.findIndex(product => product.id === paramId);

    if (index !== -1) {
      const product = productsDb[index];
      productsDb.splice(index, 1);

      res.statusCode = 200;
      res.end(JSON.stringify({ msg: 'Produto excluído', product }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Produto não existe' }));
    }
  }
};