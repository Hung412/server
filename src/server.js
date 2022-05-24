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
    const get_data = async() =>{
        const [rows, fields]  = await pool.execute(`SELECT * FROM nguoidung`);
        const face = [];
        // console.log(rows);
        for(let i=0; i<rows.length; i++){
            face.push(rows[i].name);
        }
        console.log(face);
        // return face;
    }
    clients.push(socket);
    //const a = "";
    socket.on('message', function (message) {
        const get_data = async() =>{
            const [rows, fields]  = await pool.execute(`SELECT * FROM nguoidung`);
            const face = [];
            // console.log(rows);
            for(let i=0; i<rows.length; i++){
                face.push(rows[i].name);
            }
            console.log(face);
            // return face;
            console.log('Message: %s', message);
            if(message=="close successfully" || message=="close error"){
                broadcast(socket, "CLOSE CONFIRM");
            }
            // if(message=="DinhVanKhoa"){
            //     broadcast(socket, "FACE_RECOGNITION_CONFIRM");
            // }else{
            //     broadcast(socket, message);
            // }
            // get_data();
            for(let i=0; i<face.length; i++){
                if(message == face[i]){
                    console.log('Recognition: %s', message);
                }
            }
        }
        get_data();
        
    });

    socket.on('close', function () {

        var index = clients.indexOf(socket);

        clients.splice(index, 1);

        console.log('Client disconnected!');

    });
});
server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`));






