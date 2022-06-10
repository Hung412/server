import http from 'http';
import express from 'express';
import WebSocket from 'ws';
import configViewEngine from './configs/viewEngine';
import initWebRouter from './routes/web';
import pool from './configs/connectDB';

const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;
const session = require('express-session');
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

app.use(session({
    secret: "hung"
}))
app.use(passport.initialize());
app.use(passport.session());
// app.get('/auth/fb', passport.authenticate('facebook'));
// app.get('/auth/fb/cb', passport.authenticate('facebook',{
//     successRedirect: '/controll-panel'
// }) );

passport.use(new passportfb(
    {
        clientID: "1837310443125273",
        clientSecret: "e1b7da8d3c2dbbc363bbc6c629f50884",
        callbackURL: "https://ahkiot.herokuapp.com/auth/fb/cb",
    },
    (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const [rows, fields] = pool.execute(`SELECT id FROM user`);
        console.log(rows);
        for(let i=0; i<rows.length; i++){
            if(rows[i] == profile._json.id ){
                done(null,user)
            }else{
                pool.execute(`INSERT INTO user (id,username,tendaydu) VALUES (${profile._json.id},'${profile._json.name}','${profile._json.name}')`);
            }
        } 
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    const [rows, fields] = pool.execute(`SELECT id FROM user`);
    for(let i=0; i<rows.length; i++){
        if(rows[i] == id ){
            done(null,user)
        }
    } 
})

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
            }
            // console.log('Message: %s', message);
            for(let i=0; i<face.length; i++){
                if(String(message).split("-")[1] == face[i]){
                    console.log('Recognition: %s', String(message).split("-")[0]);
                    console.log('Message: %s', message);
                    broadcast(socket, message);
                }else if(String(message).split("-")[1] == face[i] && rows[i].quyenhan == 1){
                    console.log('Message: %s', "SUPER_USER-"+message);
                    broadcast(socket, "SUPER_USER-"+message);
                }
                else if(message != face[i]){
                    broadcast(socket, message);
                }  
            }
        }
        get_data();

        //insert data

        if (message == "open successfully" && temp == 0) {

            pool.execute("INSERT INTO trangthai (status,timestatus) VALUES ('open',CURRENT_TIMESTAMP)");
            temp = 1;
            tempError = 1;

        }
        else if (message == "close successfully" && temp == 1) {

            pool.execute("INSERT INTO trangthai (status,timestatus) VALUES ('close',CURRENT_TIMESTAMP)");
            temp = 0;
            tempError = 1; 
        }
        else if ((message == "open error" || message == "close error") && tempError == 1) {

            pool.execute("INSERT INTO trangthai (status,timestatus) VALUES ('error',CURRENT_TIMESTAMP)"); 

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