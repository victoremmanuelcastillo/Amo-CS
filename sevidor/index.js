const net = require('net');
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const server = net.createServer();
const app = express();
app.use(express.json());
const usuarios = {};

server.on('connection', (socket) => {
    let usuario = null;

    socket.on('data', async (data) => {
        const mensaje = data.toString().trim();

        if (mensaje.startsWith('/inicio:')) {
            usuario = mensaje.replace('/inicio:', '');
            usuarios[usuario] = socket;
            await db.collection('usuarios').doc(usuario).set({
                usuario: usuario,
                email: `${usuario}@chat.com`,
                full_name: usuario,
                password_hash: ''
            });
            socket.write('OK\n');
            console.log(`${usuario} se unio`);
        } else if (mensaje.startsWith('/chat:')) {
            const texto = mensaje.replace('/chat:', '');
            await db.collection('mensajes').add({
                usuario: usuario,
                mensaje: texto,
                fecha: new Date()
            });
            console.log(`[CHAT] ${usuario}: ${texto}`);
            Object.keys(usuarios).forEach(u => {
                usuarios[u].write(`${usuario}: ${texto}\n`);
            });
        }
    });

    socket.on('end', () => {
        if (usuario) {
            delete usuarios[usuario];
            console.log(`${usuario} se desconecto`);
        }
    });

    socket.on('error', (err) => {
        console.error('Socket error: ', err);
    });
});

app.get('/inicio', (req, res) => {
    res.sendFile(__dirname + '/inicio.html');
});

app.post('/inicio', async (req, res) => {
    const {usuario} = req.body;
    await db.collection('usuarios').doc(usuario).set({
        usuario: usuario,
        email: `${usuario}@chat.com`,
        full_name: usuario,
        password_hash: ''
    });
    res.json({ok: true});
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

app.post('/chat', async (req, res) => {
    const {usuario, mensaje} = req.body;
    await db.collection('mensajes').add({
        usuario: usuario,
        mensaje: mensaje,
        fecha: new Date()
    });
    res.json({ok: true});
});

app.get('/mensajes', async (req, res) => {
    const mensajes = await db.collection('mensajes').orderBy('fecha').get();
    const data = [];
    mensajes.forEach(doc => data.push(doc.data()));
    res.json(data);
});

app.get('/', async (req, res) => {
    const mensajes = await db.collection('mensajes').orderBy('fecha').get();
    const usuarios = await db.collection('usuarios').get();

    let html = '<html><head><title>Chat Server</title></head><body>';
    html += '<h1>Usuarios</h1><ul>';
    usuarios.forEach(doc => {
        const u = doc.data();
        html += `<li>${u.usuario}</li>`;
    });
    html += '</ul><h1>Mensajes</h1><ul>';
    mensajes.forEach(doc => {
        const m = doc.data();
        html += `<li><b>${m.usuario}:</b> ${m.mensaje}</li>`;
    });
    html += '</ul></body></html>';
    res.send(html);
});

app.listen(8000, () => {
    console.log('HTTP server on http://localhost:8000');
});

server.listen(8080, () => {
    console.log('Socket server on port 8080');
});