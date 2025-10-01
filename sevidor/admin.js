const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json');

const db = admin.firestore();
const app = express();

app.get('/', async (req, res) => {
    const mensajes = await db.collection('mensajes').orderBy('fecha').get();
    const usuarios = await db.collection('usuarios').get();

    let html = '<html><head><title>Admin</title></head><body>';
    html += '<h1>Usuarios</h1><ul>';
    usuarios.forEach(doc => {
        const u = doc.data();
        html += `<li>${u.usuario}</li>`;
    });
    html += '</ul><h1>Mensajes</h1><ul>';
    mensajes.forEach(doc => {
        const m = doc.data();
        if (m.tipo === 'grupal') {
            html += `<li>[GRUPAL] <b>${m.usuario}:</b> ${m.mensaje}</li>`;
        } else {
            html += `<li>[PRIVADO ${m.usuario} -> ${m.destino}] ${m.mensaje}</li>`;
        }
    });
    html += '</ul></body></html>';
    res.send(html);
});

app.listen(8000, () => {
    console.log('Admin en http://localhost:8000');
});
