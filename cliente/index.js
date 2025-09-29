const net = require('net');
const readline = require('readline-sync');
const server = {
    port: 8080,
    host: 'localhost'
}
const client = net.createConnection(server);

function sendMessage() {
    const message = readline.question('Escribe: ');
    client.write(message);
    sendMessage();
}

client.on('connect', () => {
    console.log('Connected to server');
    sendMessage();
})
client.on('data', (data) => {
    console.log('Server says:', data.toString());
})
client.on('error', (err) => {
    console.error('Connection error:', err);
})