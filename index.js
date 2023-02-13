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

    socket.on('addTable', (tableName) => {
        console.log('addTable: ' + tableName);
        const json = {
          name: tableName,
          score: 0
        }
        tables.push(json);
        io.emit('addTable', JSON.stringify(json));
    });

    socket.on('removeAllTables', () => {
        console.log('removeAllTables: ');
        tables = [];
        io.emit('removeAllTables');
    });

    socket.on('addPoints', (data) => {
        console.log('addPoints: ' + JSON.stringify(data));

        tables.forEach(table => {
          if (table.name === data.name) {
            table.score += data.pointsToAdd;
          }
        });

        io.emit('addPoints', tables);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

const PORT = process.env.PORT || 3001;
server.listen(PORT , () => {
  console.log('App started');
});