const net = require('net');
const readline = require('readline-sync');

const client = net.createConnection({ port: 8080, host: 'localhost' });

let usuario = '';
let enChat = false;

client.on('connect', () => {
    console.log('=== PANTALLA DE INICIO ===');
    usuario = readline.question('Nombre de usuario: ');
    client.write(`/inicio:${usuario}`);
});

client.on('data', (data) => {
    const respuesta = data.toString().trim();

    if (respuesta === 'OK' && !enChat) {
        enChat = true;
        console.log('\n=== CHAT ===');
        enviarMensajes();
    } else {
        console.log(respuesta);
    }
});

function enviarMensajes() {
    const mensaje = readline.question('');
    client.write(`/chat:${mensaje}`);
    enviarMensajes();
}

client.on('error', (err) => {
    console.error('Connection error:', err);
});