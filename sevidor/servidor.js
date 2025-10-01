const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/login', async (req, res) => {
    const {usuario} = req.body;
    await db.collection('usuarios').doc(usuario).set({
        usuario: usuario,
        email: `${usuario}@chat.com`,
        full_name: usuario,
        password_hash: ''
    });
    console.log(`Usuario: ${usuario}`);
    res.json({ok: true});
});

app.post('/mensaje', async (req, res) => {
    const {usuario, mensaje, tipo, destino} = req.body;
    await db.collection('mensajes').add({
        usuario: usuario,
        mensaje: mensaje,
        tipo: tipo,
        destino: destino || null,
        fecha: new Date()
    });
    console.log(`[${tipo}] ${usuario}: ${mensaje}`);
    res.json({ok: true});
});

app.get('/mensajes', async (req, res) => {
    try {
        const {tipo, usuario} = req.query;
        const mensajes = await db.collection('mensajes').get();
        const data = [];

        mensajes.forEach(doc => {
            const m = doc.data();
            if (tipo === 'grupal' && m.tipo === 'grupal') {
                data.push(m);
            } else if (tipo === 'privado' && m.tipo === 'privado' && usuario) {
                if (m.usuario === usuario || m.destino === usuario) {
                    data.push(m);
                }
            }
        });

        data.sort((a, b) => a.fecha - b.fecha);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: error.message});
    }
});

app.listen(8080, () => {
    console.log('Servidor API en http://localhost:8080');
});
