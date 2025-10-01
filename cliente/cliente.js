const express = require('express');
const path = require('path');

const puerto = process.argv[2] || 8001;
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

app.listen(puerto, () => {
    console.log(`Cliente en http://localhost:${puerto}`);
});
