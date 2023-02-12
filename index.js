const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/client/build'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
});

let tables=[];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('initTables', tables);

    socket.on('addTable', (data) => {
        console.log('addTable: ' + data);
        tables.push(data);
        io.emit('addTable', data);
    });

    socket.on('removeAllTables', () => {
        console.log('removeAllTables: ');
        tables = [];
        io.emit('removeAllTables');
    });

    socket.on('addPoint', (data) => {
        console.log('addPoint: ' + data);
        io.emit('addPoint', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

const PORT = process.env['PORT'];
server.listen(PORT || 30001 , () => {
  console.log('App started');
});