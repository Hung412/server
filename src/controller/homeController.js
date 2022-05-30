import pool from '../configs/connectDB';

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

// const getHomePage = async(req, res) =>{
//     const [count, fields] = await pool.execute('SELECT COUNT(*) AS `countstatus` FROM `trangthai` WHERE status = "open" UNION SELECT COUNT(*) AS `countclose` FROM `trangthai` WHERE status = "close" UNION SELECT COUNT(*) AS `counterror` FROM `trangthai` WHERE status = "error"');
//     const countstatus = [];
//     if (req.session.daDangNhap) {
//         for(let i=0; i<count.length; i++){
//             countstatus.push(count[i].countstatus);
//         }
//         // console.log(countstatus);
//         console.log(req.session.fullname);
//         return res.render('index.ejs', {data : count});
//     }
//     else {       
//         res.redirect("/sign-in");
//     }
// }

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
    console.log("Check request: ", req.body);
    const [rows, fields] = await pool.execute(`SELECT * FROM trangthai WHERE timestatus BETWEEN CURRENT_DATE - 2 AND CURRENT_DATE`)
    return res.render('homedata.ejs', { data: rows });
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
            sess.username = req.body.username; 
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

module.exports = {
    getHomePage,
    // getCount,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin
}