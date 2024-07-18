// Utils
const getParamId = require('../utils/getParamId');

// Controllers
const {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

// Endpoint atual
const endpoint = '/api/clients';

module.exports = (req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === endpoint) {
    getAllClients(res);
  } else if (method === 'GET' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    const client = getClientById(paramId, res);

    if (!client) {
      res.statusCode = 404;
      res.end(JSON.stringify({ msg: 'Cliente não existe' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify(client));
  } else if (method === 'POST' && url === endpoint) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newClient = JSON.parse(body);
      createClient(newClient, res);
    });
  } else if (method === 'PUT' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updatedClient = JSON.parse(body);
      updateClient(paramId, updatedClient, res);
    });
  } else if (method === 'DELETE' && url.startsWith(`${endpoint}/`)) {
    const paramId = getParamId(url);
    deleteClient(paramId, res);
  }
};