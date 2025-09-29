const net = require('net');
const server = net.createServer();

server.on('connection', (socket) => {
    socket.on('data',(data)=>{
        console.log('mensaje recibido: ', data.toString())
        socket.write('Mensaje recibido\n');
    })
    socket.on('end', () => {
        console.log('client disconnected');
    })
    socket.on('error', (err) => {
        console.error('Socket error: ', err);
    });
})
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});