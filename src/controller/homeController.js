import pool from '../configs/connectDB';

const getHomePage = async (req, res) => {
    // const [rows, fields] = await pool.execute('SELECT * FROM `trangthai`');
    const open = await pool.execute('SELECT COUNT(*) AS `countopen` FROM `trangthai` WHERE status = "open"');
    const close = await pool.execute('SELECT COUNT(*) AS `countclose FROM `trangthai` WHERE status = "close"');
    const error = await pool.execute('SELECT COUNT(*) AS `counterror` FROM `trangthai` WHERE status = "error"');
    if (req.session.daDangNhap) {
        console.log(req.session.username);
        // console.log(count);
        return res.render('index.ejs', { data: open }, { data: close }, { data: error });
    }
    else {       
        res.redirect("/sign-in");
    }
}

const getControllPanelPage = (req, res) => {
    if (req.session.daDangNhap){
        console.log(req.session.username);
        return res.render('controllPanel.ejs');
    }
    else {       
        res.redirect("/sign-in");
    }
}

const postDeleteStatus = async (req, res) => {
    console.log("Check request: ", req.body);
    await pool.execute(`DELETE FROM trangthai WHERE id = ${req.body.statusId}`)
    return res.redirect('/home');
}
const showSigninForm = async (req, res) => {
    res.render('signin.ejs');
}
const signin = async (req, res) => {
    const [rows, fields]  = await pool.execute(`SELECT * FROM user`);
    console.log(rows);
    var sess = req.session;
    for(let i=0; i<rows.length; i++){
        // console.log(rows[i].username);
        if(req.body.username == rows[i].username && req.body.password == rows[i].password){
            sess.daDangNhap = true;
            sess.username = req.body.username; 
        }
    }
    if (sess.daDangNhap){
        return res.redirect('/controll-panel');
    }
    else{
        return res.redirect('/sign-in'); 
    }
}

module.exports = {
    getHomePage,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin
}