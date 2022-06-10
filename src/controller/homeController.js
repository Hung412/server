import pool from '../configs/connectDB';

const passport = require('passport');
const passportfb = require('passport-facebook').Strategy;

const getHomePage = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `trangthai` ORDER BY `timestatus` DESC');
    // const [count, fields] = await pool.execute('SELECT COUNT(*) AS `count` FROM `trangthai` WHERE status = "open" UNION SELECT COUNT(*) AS `countclose` FROM `trangthai` WHERE status = "close" UNION SELECT COUNT(*) AS `counterror` FROM `trangthai` WHERE status = "error"');
    if (req.session.daDangNhap) {
        console.log(req.session.fullname);
        return res.render('index.ejs', { data: rows });
    }
    else {       
        res.redirect("/sign-in");
    }
}

const getControllPanelPage = (req, res) => {
    if (req.session.daDangNhap){
        console.log(req.session.fullname);
        return res.render('controllPanel.ejs');
    }
    else {       
        res.redirect("/sign-in");
    }
}

const postDeleteStatus = async (req, res) => {
    // console.log("Check request: ", req.body);
    await pool.execute(`DELETE FROM trangthai WHERE id = ${req.body.statusId}`)
    return res.redirect('/home');
}

const editUser = async (req, res) => {
    // console.log("Check request: ", req.body);
    await pool.execute(`UPDATE user SET username = '${req.body.username}',tendaydu = '${req.body.fullname}',password='${req.body.password}' WHERE username = '${req.session.username}'`)
    return res.redirect('/user');
}

const users = async (req, res) => {
    
    if (req.session.daDangNhap){
        const [rows, fields] = await pool.execute(`SELECT * FROM user WHERE username = '${req.session.username}'`);
        return res.render('users.ejs', { data: rows });
    }
    else {       
        res.redirect("/sign-in");
    }
}

const postHomeData = async (req, res) => {
    // console.log("Check request: ", req.body);
    const [rows, fields] = await pool.execute(`SELECT * FROM trangthai WHERE timestatus BETWEEN '${req.body.date_start}' AND DATE_ADD('${req.body.date_end}', INTERVAL 1 DAY)`);
    if (req.session.daDangNhap){
        return res.render('homedata.ejs', { data: rows });
    }else {       
        res.redirect("/sign-in");
    }
}

const showSigninForm = async (req, res) => {
    res.render('signin.ejs');
}
const signin = async (req, res) => {
    const [rows, fields]  = await pool.execute(`SELECT * FROM user`);
    console.log(rows);
    var sess = req.session;
    for(let i=0; i<rows.length; i++){
        if(req.body.username == rows[i].username && req.body.password == rows[i].password){
            sess.daDangNhap = true;
            // sess.id = rows[i].id;
            sess.username = rows[i].username;  
            sess.password = rows[i].password;
            sess.fullname = rows[i].tendaydu;
        }
    }
    if (sess.daDangNhap){
        return res.redirect('/controll-panel');
    }
    else{
        return res.redirect('/sign-in'); 
    }
}

const showRegisterForm = async (req, res) => {
    res.render('register.ejs');
}
const register = async (req, res) => {
    await pool.execute(`INSERT INTO user (username,password,tendaydu) VALUES ('${req.body.username}','${req.body.password}','${req.body.fullname}')`);
    return res.redirect('/sign-in');
}
module.exports = {
    getHomePage,
    postHomeData,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin,
    showRegisterForm,
    register,
    users,
    editUser
}