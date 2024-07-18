let productsDb = require('../data/products');
const { productValidation } = require('../validation/products');

const getAllProducts = (res) => {
  res.statusCode = 200;
  res.end(JSON.stringify(productsDb));
};

const getProductById = (paramId, res) => {
  const index = productsDb.findIndex(
    product => product.id === paramId
  );

  if (index === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Produto não existe' }));
    return;
  }

  const product = productsDb[index];
  res.statusCode = 200;
  res.end(JSON.stringify(product));
};

const createProduct = (newProduct, res) => {
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
};

const updateProduct = (paramId, updatedProduct, res) => {
  const index = productsDb.findIndex(product => product.id === paramId);

  if (index === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Produto não existe' }));
    return;
  }

  const validationError = productValidation(updatedProduct);

  if (validationError) {
    res.statusCode = 400; // req.body inválido
    res.end(JSON.stringify({ error: validationError }));
    return;
  }

  updatedProduct.id = paramId;
  productsDb[index] = updatedProduct;

  res.statusCode = 200; // Editado com sucesso
  res.end(JSON.stringify({ msg: 'Produto atualizado com sucesso', updatedProduct }));
};

const deleteProduct = (paramId, res) => {
  const index = productsDb.findIndex(product => product.id === paramId);

  if (index !== -1) {
    const product = productsDb[index]; // Salva o registro
    productsDb.splice(index, 1);

    res.statusCode = 200;
    res.end(JSON.stringify({ msg: 'Produto excluído', product }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Produto não existe' }));
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};