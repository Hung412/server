import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import configViewEngine from './configs/viewEngine';
import initWebRouter from './routes/web';
import pool from './configs/connectDB';

require('dotenv').config();
const PORT = process.env.PORT || 3000
var temp = 0;
var tempError = 0;

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
    socket.on('message', function (message) {
        console.log(message.length);
        const get_data = async() =>{
            const [rows, fields]  = await pool.execute(`SELECT * FROM nguoidung`);
            const face = [];
            for(let i=0; i<rows.length; i++){
                face.push(rows[i].name);
                // if(message.length == 22 && rows[i].quyenhan == 0){
                //     console.log(message);
                // }
            }
            console.log(face);
            console.log('Message: %s', message);
            if(message=="close successfully" || message=="close error"){
                broadcast(socket, "CLOSE CONFIRM");
            }
            for(let i=0; i<face.length; i++){
                if(message == face[i]){
                    console.log('Recognition: %s', message);
                    broadcast(socket, "FACE_RECOGNITION_CONFIRM");
                }else if(rows[i].quyenhan == 1){
                    broadcast(socket, "SUPER_USER");
                }
                else{
                    broadcast(socket, message);
                }  
            }
        }
        get_data();

        if (message == "open successfully" && temp == 0) {

            pool.execute("INSERT INTO trangthai (status) VALUES ('open')", function (err, result) {

                if (err) throw err;

                console.log('Insert data open successfully');
            });

            temp = 1;
            tempError = 1;

        }
        else if (message == "close successfully" && temp == 1) {

            pool.execute("INSERT INTO trangthai (status) VALUES ('close')", function (err, result) {

                if (err) throw err;

                console.log('Insert data close successfully');
            });

            temp = 0;
            tempError = 1; 
        }
        else if ((message == "open error" || message == "close error") && tempError == 1) {

            pool.execute("INSERT INTO trangthai (status) VALUES ('error')", function (err, result) {

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
server.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`));






