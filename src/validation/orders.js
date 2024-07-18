const orderValidation = (order) => {

  // Validação do payload
  const fields = [
    { key: 'clientId', label: 'ID do Cliente' },
    { key: 'productId', label: 'ID do Produto' },
    { key: 'paymentMethodId', label: 'ID do Método de Pagamento' }
  ];

  for (const field of fields) {
    let value = order[field.key];
    let label = field.label;

    if (!value || typeof value !== 'number') {
      return `O campo "${label}" é obrigatório`;
    }
  };
};

module.exports = { orderValidation };