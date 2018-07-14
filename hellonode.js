// Load HTTP module
const http = require('http');
const hostname = '0.0.0.0';
const port = 3004;

// Create HTTP server and listen on port 3004 for requests
const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello world!\n');
});

// listen for request on port 3004, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
	console.log('Server running at http://203.252.99.213:3004');
});

