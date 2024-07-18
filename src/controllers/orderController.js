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
    { data: client, msg: 'Cliente inválido' },
    { data: product, msg: 'Produto inválido' },
    { data: paymentMethod, msg: 'Método de Pagamento inválido' }
  ].filter(error => !error.data);

  if (errors.length > 0) {
    res.statusCode = 400;
    res.end(JSON.stringify(errors[0]));
    return;
  }

  // Diminui 1 estoque do produto
  let updatedProduct = { ...product }; // Cria uma cópia do produto original
  if (updatedProduct.quantity > 0) {
    updatedProduct.quantity -= 1;
    updateProduct(productId, updatedProduct, res);
  } else {
    res.end(JSON.stringify({ msg: 'Produto sem estoque' }));
    return;
  }

  // [] - Exibir cálculo do total da venda
  // [] - Salvar venda

  // Salvar venda
  // orders.push(newOrder);

  res.statusCode = 302;
  res.end(JSON.stringify(updatedProduct));
};

module.exports = {
  createOrder
};