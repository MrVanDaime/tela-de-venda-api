const getParamId = require('../utils/getParamId');

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Endpoint atual
const endpoint = '/api/products';

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === endpoint) {
    getAllProducts(res);
  } else if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const product = getProductById(paramId, res);

    if (!product) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Produto não existe' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(product));
  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newProduct = JSON.parse(body);
      createProduct(newProduct, res);
    });
  } else if (method === 'PUT' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updatedProduct = JSON.parse(body);
      const result = updateProduct(paramId, updatedProduct, res);

      res.statusCode = 200; // Editado com sucesso
      res.end(JSON.stringify(result));
    });
  } else if (method === 'DELETE' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    deleteProduct(paramId, res);
  }
};