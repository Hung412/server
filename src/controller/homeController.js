import pool from '../configs/connectDB';

const getHomePage = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `trangthai`');
    return res.render('index.ejs', { data: rows });
}

const getControllPanelPage = (req, res) => {
    return res.render('controllPanel.ejs');
}

const postDeleteStatus = async (req, res) => {
    console.log("Check request: ", req.body);
    await pool.execute(`DELETE FROM trangthai WHERE id = ${req.body.statusId}`)
    return res.redirect('/home');
}
const showSigninForm = async (req, res) => {
    return res.render('signin.ejs');
}
const signin = async (req, res) => {
    await pool.execute(`SELECT * FROM user WHERE username = ${req.body.uname} AND password = ${req.body.psw}`)
    return res.redirect('/home')
}

module.exports = {
    getHomePage,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin
}