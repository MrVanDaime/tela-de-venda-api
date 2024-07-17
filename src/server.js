const http = require('http');

const hostname = 'localhost';
const PORT = process.env.PORT || 3000;

const clientsRoute = require('./routes/clients');
const productsRoute = require('./routes/products');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // Clientes
  if (req.url.startsWith('/api/clients')) {
    clientsRoute(req, res);
  } else if (req.url.startsWith('/api/products')) {
    productsRoute(req, res);
  } else {
    req.statusCode = 404;
    res.end("Route not found");
  }
});

server.listen(PORT, hostname, () => {
  console.log(`Running on http://${hostname}:${PORT}`);
});