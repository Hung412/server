import pool from '../configs/connectDB';

const getHomePage = async (req, res) => {
    const [rows, fields] = await pool.execute('SELECT * FROM `trangthai`');
    if (req.session.daDangNhap) {
        console.log(req.session.username);
        return res.render('index.ejs', { data: rows });
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
    const [rows, fields]  = await pool.execute(`SELECT * FROM user`)
    // console.log({data: rows});
    for(let i=0; i<=10; i++){
        console.log(rows[i].username);
        // if(req.body.username == rows[i].username && req.body.password == rows[i].password){
        //     var sess = req.session;  //initialize session variable
        //     sess.daDangNhap = true;
        //     sess.username = req.body.username; 
        //     return res.redirect('/controll-panel');
        // }else{
        //     return res.redirect('/sign-in'); 
        // }
        return res.redirect('/controll-panel');
    }
}

module.exports = {
    getHomePage,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin
}