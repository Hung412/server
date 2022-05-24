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
const get_data = async () => {
    const [rows, fields]  = await pool.execute(`SELECT * FROM nguoidung`);
    // const face = [];
    // console.log(rows);
    // console.log(face);
    return rows;
}

ws.on('connection', function (socket, req, res) {

    clients.push(socket);
    //const a = "";
    socket.on('message', function (message) {
        console.log('Message: %s', message);
        if(message=="close successfully" || message=="close error"){
            broadcast(socket, "CLOSE CONFIRM");
        }
        // if(message=="DinhVanKhoa"){
        //     broadcast(socket, "FACE_RECOGNITION_CONFIRM");
        // }else{
        //     broadcast(socket, message);
        // }
        console.log(get_data(), get_data().length);
        // console.log(data_user, data_user.length);
        // for(let i=0; i<data_user.length; i++){
        //     if(message == data_user[i].name){
        //         console.log('Recognition: %s', message);
        //     }
        // }
    });

    socket.on('close', function () {

        var index = clients.indexOf(socket);

        clients.splice(index, 1);

        console.log('Client disconnected!');

    });
});
server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`));






