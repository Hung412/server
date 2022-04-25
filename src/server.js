import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import configViewEngine from './configs/viewEngine';
import initWebRouter from './routes/web';
const session = require('express-session');
var storage = require('node-persist');


// Setup .env
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

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
}));

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

    socket.on('message', function (message) {

        broadcast(socket, message);

        console.log('Message: %s', message);
        if (message == "open successfully" && temp == 0) {

            con.query("INSERT INTO trangthai (status) VALUES ('open')", function (err, result) {

                if (err) throw err;

                console.log('Insert data open successfully');
            });

            temp = 1;
            tempError = 1;

        }
        else if (message == "close successfully" && temp == 1) {

            con.query("INSERT INTO trangthai (status) VALUES ('close')", function (err, result) {

                if (err) throw err;

                console.log('Insert data close successfully');
            });

            temp = 0;
            tempError = 1; 
        }
        else if ((message == "open error" || message == "close error") && tempError == 1) {

            con.query("INSERT INTO trangthai (status) VALUES ('error')", function (err, result) {

                if (err) throw err;

                console.log('Insert data error successfully');
            }); 

            tempError = 0;
        }

    });

    socket.on('close', function () {

        var index = clients.indexOf(socket);

        clients.splice(index, 1);

        console.log('Client disconnected!');

    });
});
require('.src/routes/auth.js')(app);

server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`));






