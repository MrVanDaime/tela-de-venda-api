let ordersDb = require('../data/orders');
const { orderValidation } = require('../validation/orders');
const { getClientById } = require('../controllers/clientController');
const { getProductById, updateProduct } = require('../controllers/productController');
const { getPaymentMethodById } = require('../controllers/PaymentMethodController');

const createOrder = (newOrder, res) => {
  const validationError = orderValidation(newOrder);

  if (validationError) {
    res.statusCode = 400; // req.body inválido
    res.end(JSON.stringify({ error: validationError }));
    return;
  }

  const { clientId, productId, paymentMethodId } = newOrder;

  const client = getClientById(clientId);
  const product = getProductById(productId);
  const paymentMethod = getPaymentMethodById(paymentMethodId);

  // Verifica se algum get retornou vazio
  const errors = [
    { data: client, msg: 'Cliente não existe' },
    { data: product, msg: 'Produto não existe' },
    { data: paymentMethod, msg: 'Método de Pagamento não existe' }
  ].filter(error => !error.data);

  if (errors.length > 0) {
    res.statusCode = 400;
    res.end(JSON.stringify(errors[0]));
    return;
  }

  // Total da venda
  const orderInstallments = calculateOrderInstallments(product.price, paymentMethod.installments);

  // Retorna produto com -1 estoque
  const updatedProduct = reduceProductStock(productId, product, res);

  let order = updatedProduct;

  if (!updatedProduct.hasOwnProperty('error')) {
    // Informações da venda
    order = {
      product: updatedProduct,
      paymentMethod: paymentMethod,
      total: orderInstallments
    };

    // Salvar venda
    order.id = ordersDb.length + 1;
    ordersDb.push(order);
  }

  // Retorna 200 mesmo que não tenha atualizado o estoque do produto
  res.statusCode = 200;
  res.end(JSON.stringify(order));
};

// Diminui 1 estoque do produto
const reduceProductStock = (productId, originalProduct) => {
  let updatedProduct = { ...originalProduct }; // Cria uma cópia do produto original

  if (updatedProduct.quantity > 0) {
    updatedProduct.quantity -= 1;
    return updateProduct(productId, updatedProduct);
  } else {
    return { error: 'Produto sem estoque' };
  }
};

// Calcula valor total da venda
const calculateOrderInstallments = (price, installments) => {
  // product.price / paymentMethod.installments
  return (price / installments).toFixed(2);
};

module.exports = {
  createOrder
};