/*
  /api/clientes/
   - Nome
   - CPF
   - Endereço
   - E-mail
   - CEP
*/
const getParamId = require('../utils/getParamId');
const { clientValidation } = require('../validation/clients');

// Endpoint atual
const endpoint = '/api/clients';

// Dados local
let clientsDb = require('../data/clients');

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === endpoint) {
    res.statusCode = 200;
    res.end(JSON.stringify(clientsDb));
  } else if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = clientsDb.findIndex(client => client.id === paramId);

    if (index === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Cliente não existe' }));
    }

    const client = clientsDb[index];
    res.statusCode = 200;
    res.end(JSON.stringify(client));

  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newClient = JSON.parse(body);
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
    });
  } else if (method === 'PUT' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = clientsDb.findIndex(client => client.id === paramId);

    if (index !== -1) {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedClient = JSON.parse(body);
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
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Cliente não existe' }));
    }
  } else if (method === 'DELETE' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const index = clientsDb.findIndex(client => client.id === paramId);

    if (index !== -1) {
      const client = clientsDb[index]; // Salva o produto
      clientsDb.splice(index, 1);

      res.statusCode = 200;
      res.end(JSON.stringify({ msg: 'Cliente excluído', client }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Cliente não existe' }));
    }
  }
};