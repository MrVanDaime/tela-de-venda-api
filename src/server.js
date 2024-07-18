const http = require('http');
const clientsRoute = require('./routes/clients');
const productsRoute = require('./routes/products');
const paymentMethodsRoute = require('./routes/paymentMethods');
const ordersRoute = require('./routes/orders');

const hostname = 'localhost';
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  // Normal header
  res.setHeader('Content-Type', 'application/json');

  // Routes
  if (req.url.startsWith('/api/clients')) {
    clientsRoute(req, res);
  } else if (req.url.startsWith('/api/products')) {
    productsRoute(req, res);
  } else if (req.url.startsWith('/api/payment-methods')) {
    paymentMethodsRoute(req, res);
  } else if (req.url.startsWith('/api/orders')) {
    ordersRoute(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ msg: "Route not found" }));
  }
});

server.listen(PORT, hostname, () => {
  console.log(`Running on http://${hostname}:${PORT}`);
});