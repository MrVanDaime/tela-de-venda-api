const paymentMethodValidation = (paymentMethod) => {
  const fields = [
    { key: 'title', label: 'Título', type: 'string', min: 5, max: 25 },
    { key: 'installments', label: 'Parcelas', type: 'number', min: 1, max: 30 }
  ];

  for (const field of fields) {
    let value = paymentMethod[field.key];
    let label = field.label;

    if (!value) {
      return `O campo "${label}" é obrigatório`;
    }

    if (typeof value !== field.type) {
      return `O campo "${label}" foi preenchido incorretamente`;
    }

    if (field.type === 'string') {
      if (value.length < field.min || value.length > field.max) {
        return `O campo "${label}" deve ter entre ${field.min} e ${field.max} caracteres`;
      }
    }

    if (field.type === 'number') {
      if (value < field.min || value > field.max) {
        return `O campo "${label}" deve ter valor entre ${field.min} e ${field.max}`;
      }
    }
  }
};

module.exports = { paymentMethodValidation };