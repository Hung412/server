import pool from '../configs/connectDB';
var storage = require('node-persist');
storage.init().then(function signin(req, res){
    const [rows, fields]  = await pool.execute(`SELECT * FROM user`)
    // console.log({data: rows});
    for(var i=0; i<rows.length; i++){
        if(req.body.username == rows[i].username && req.body.password == rows[i].password){
            storage.setItem('username', req.body.username);
            storage.setItem('password', req.body.password);
            return res.redirect('/controll-panel');
        }else{
            return res.redirect('/sign-in');
        }
    }
})

storage.init().then(function getHomePage(req, res){
    if(storage.getItem('username') && storage.getItem('password')){
        const [rows, fields] = await pool.execute('SELECT * FROM `trangthai`');
        return res.render('index.ejs', { data: rows });
    }
});


const getControllPanelPage = (req, res) => {
    return res.render('controllPanel.ejs');
}

const postDeleteStatus = async (req, res) => {
    console.log("Check request: ", req.body);
    await pool.execute(`DELETE FROM trangthai WHERE id = ${req.body.statusId}`)
    return res.redirect('/home');
}
const showSigninForm = async (req, res) => {
    res.render('signin.ejs');
}
// const signin = async (req, res) => {
//     const [rows, fields]  = await pool.execute(`SELECT * FROM user`)
//     // console.log({data: rows});
//     for(var i=0; i<rows.length; i++){
//         if(req.body.username == rows[i].username && req.body.password == rows[i].password){
//             return res.redirect('/controll-panel');
//         }else{
//             return res.redirect('/sign-in');
//         }
//     }
// }

module.exports = {
    getHomePage,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin
}