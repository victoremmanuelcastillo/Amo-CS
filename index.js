const http = require('http');
const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'appication/json' });
    res.end('Hello, world!');
});

const PORT = 6000;
app.listen(PORT)
console.log(`Server is running on port`);