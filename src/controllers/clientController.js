let clientsDb = require('../data/clients');
const { clientValidation } = require('../validation/clients');

const getAllClients = (res) => {
  res.statusCode = 200;
  res.end(JSON.stringify(clientsDb));
};

const getClientById = (paramId) => {
  const index = clientsDb.findIndex(
    client => client.id === paramId
  );

  if (index === -1) return;

  return clientsDb[index];
};

const createClient = (newClient, res) => {
  const validationError = clientValidation(newClient);

  if (validationError) {
    res.statusCode = 400; // req.body inválido
    res.end(JSON.stringify({ error: validationError }));
    return;
  }

  newClient.id = clientsDb.length + 1;
  clientsDb.push(newClient);

  res.statusCode = 201; // Criado com sucesso
  res.end(JSON.stringify({ msg: 'Cliente cadastrado com sucesso', newClient }));
};

const updateClient = (paramId, updatedClient, res) => {
  const index = clientsDb.findIndex(client => client.id === paramId);

  if (index === -1) {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Cliente não existe' }));
    return;
  }

  const validationError = clientValidation(updatedClient);

  if (validationError) {
    res.statusCode = 400; // req.body inválido
    res.end(JSON.stringify({ error: validationError }));
    return;
  }

  updatedClient.id = paramId;
  clientsDb[index] = updatedClient;

  res.statusCode = 200; // Editado com sucesso
  res.end(JSON.stringify({ msg: 'Cliente atualizado com sucesso', updatedClient }));
};

const deleteClient = (paramId, res) => {
  const index = clientsDb.findIndex(client => client.id === paramId);

  if (index !== -1) {
    const client = clientsDb[index]; // Salva o registro
    clientsDb.splice(index, 1);

    res.statusCode = 200;
    res.end(JSON.stringify({ msg: 'Cliente excluído', client }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: 'Cliente não existe' }));
  }
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};