let paymentMethodsDb = require('../data/paymentMethods');
const { paymentMethodValidation } = require('../validation/paymentMethods');

const getAllPaymentMethods = (res) => {
  res.statusCode = 200;
  res.end(JSON.stringify(paymentMethodsDb));
};

const getPaymentMethodById = (paramId) => {
  const index = paymentMethodsDb.findIndex(paymentMethod => paymentMethod.id === paramId);

  if (index === -1) return;

  return paymentMethodsDb[index];
};

const createPaymentMethod = (newPaymentMethod, res) => {
  const validationError = paymentMethodValidation(newPaymentMethod);

  if (validationError) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: validationError }));
    return;
  }

  newPaymentMethod.id = paymentMethodsDb.length + 1;
  paymentMethodsDb.push(newPaymentMethod);

  res.statusCode = 201;
  res.end(JSON.stringify({ msg: 'Método de Pagamento cadastrado com sucesso', newPaymentMethod }));
};

const updatePaymentMethod = (paramId, updatedPaymentMethod, res) => {
  const index = paymentMethodsDb.findIndex(paymentMethod => paymentMethod.id === paramId);

  if (index === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Método de Pagamento não existe' }));
    return;
  }

  const validationError = paymentMethodValidation(updatedPaymentMethod);

  if (validationError) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: validationError }));
    return;
  }

  updatedPaymentMethod.id = paramId;
  paymentMethodsDb[index] = updatedPaymentMethod;

  res.statusCode = 200;
  res.end(JSON.stringify({ msg: 'Método de Pagamento atualizado com sucesso', updatedPaymentMethod }));
};

const deletePaymentMethod = (paramId, res) => {
  const index = paymentMethodsDb.findIndex(
    paymentMethod => paymentMethod.id === paramId
  );

  if (index !== -1) {
    const paymentMethod = paymentMethodsDb[index];
    paymentMethodsDb.splice(index, 1);

    res.statusCode = 200;
    res.end(JSON.stringify({ msg: 'Método de Pagamento excluído', paymentMethod }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Método de Pagamento não existe' }));
  }
};

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
};