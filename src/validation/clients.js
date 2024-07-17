const clientValidation = (client) => {

  // Validação do payload
  const fields = [
    { key: 'name', label: 'Nome', minLength: 5, maxLength: 50 },
    { key: 'cpf', label: 'CPF', minLength: 11, maxLength: 14 },
    { key: 'address', label: 'Endereço', minLength: 5, maxLength: 50 },
    { key: 'email', label: 'Email', minLength: 10, maxLength: 50 },
    { key: 'zip', label: 'CEP', minLength: 8, maxLength: 9 }
  ];

  for (const field of fields) {
    let value = client[field.key];
    let label = field.label;

    if (!value || typeof value !== 'string') {
      return `O campo "${label}" é obrigatório`;
    }

    if (value.length < field.minLength || value.length > field.maxLength) {
      return `O campo "${label}" deve ter entre ${field.minLength} e ${field.maxLength} caracteres`;
    }
  };

  return null; // O cliente é válido
};

module.exports = { clientValidation };