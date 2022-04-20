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

const signin = async (req, res) => {
    // const [rows, fields] = await pool.execute('SELECT * FROM `user`');
    res.render('signin.ejs');
    // if(req.body.uname == "admin" && req.body.psw == "admin"){
    //     return res.redirect('/controll-panel');
    // }
    // else{
    //     alert("Again!")
    // }     
    pool.query("SELECT * FROM user",(err, data) => {
        if(req.body.uname == data[0].username){
            return res.redirect('/controll-panel');
        }
        else{
                alert("Again!")
            }            
    });
}

module.exports = {
    getHomePage,
    getControllPanelPage,
    postDeleteStatus,
    signin
}