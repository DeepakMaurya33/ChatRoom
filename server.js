const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public')); 

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('newuser', (username) => {
        console.log(`${username} has joined the chat`);
        socket.broadcast.emit('update', `${username} has joined the chat`);
    });

    socket.on('chat', (message) => {
        console.log(`Message from ${message.username}: ${message.text}`);
        io.emit('chat', message); // Broadcast the message to all connected clients
    });

    socket.on('exituser', (username) => {
        console.log(`${username} has left the chat`);
        socket.broadcast.emit('update', `${username} has left the chat`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
