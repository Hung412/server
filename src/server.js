import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import configViewEngine from './configs/viewEngine';
import initWebRouter from './routes/web';
import pool from './configs/connectDB';

require('dotenv').config();
const PORT = process.env.PORT || 3000

// create http server
const app = express();
const server = http.createServer(app);
const ws = new WebSocket.Server({
    server
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup view engine
configViewEngine(app);

// Init web route
initWebRouter(app);


var clients = [];

function broadcast(socket, data) {
    try {

        for (var i = 0; i < clients.length; i++) {

            if (clients[i] != socket) {

                clients[i].send(data);
            }
        }
    } catch (error) {
        console.log(error)
    }
}

ws.on('connection', function (socket, req, res) {

    clients.push(socket);
    const a = "";
    socket.on('message', function (message) {
        const rows = pool.execute(`SELECT * FROM nguoidung`);
        for(let i=0; i<rows.length; i++){
        //     if(rows[i].name == message){
        //         broadcast(socket, message);
        //         console.log('Recognition: %s', message);
            a = rows[i].name;
        //     }
        }
        broadcast(socket, message);
        broadcast(socket, a);
        console.log('Message: %s', message);
        console.log('Test: %s', a);
    });

    socket.on('close', function () {

        var index = clients.indexOf(socket);

        clients.splice(index, 1);

        console.log('Client disconnected!');

    });
});
server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`));






