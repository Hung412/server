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

const getCount = async(req, res) =>{
    const [count, fields] = await pool.execute('SELECT COUNT(*) AS `countstatus` FROM `trangthai` WHERE status = "open" UNION SELECT COUNT(*) AS `countclose` FROM `trangthai` WHERE status = "close" UNION SELECT COUNT(*) AS `counterror` FROM `trangthai` WHERE status = "error"');
    const countstatus = [];
    if (req.session.daDangNhap) {
        console.log(req.session.fullname);
        return res.render('index.ejs', { data: count });
    }
    else {       
        res.redirect("/sign-in");
    }
    //Chart
    for(let i=0; i<count.length; i++){
        countstatus.push(count[i].countstatus);
        console.log(countstatus);
    }
    let myChart = document.getElementById('myChart').getContext('2d');
      // Global Options
      Chart.defaults.global.defaultFontFamily = 'Lato';
      Chart.defaults.global.defaultFontSize = 18;
      Chart.defaults.global.defaultFontColor = '#777';
      let massPopChart = new Chart(myChart, {
      type:'line', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
      data:{
        labels:['Open', 'Close', 'Error'],
        datasets:[{
          label:'Status',
          data:[
            countstatus[0],
            countstatus[1],
            countstatus[2],
          ],
          //backgroundColor:'green',
          backgroundColor:[
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderWidth:1,
          borderColor:'#777',
          hoverBorderWidth:3,
          hoverBorderColor:'#000'
        }]
      },
      options:{
        title:{
          display:true,
          text:'Status Chart',
          fontSize:25
        },
        legend:{
          display:true,
          position:'right',
          labels:{
            fontColor:'#000'
          }
        },
        layout:{
          padding:{
            left:50,
            right:0,
            bottom:0,
            top:0
          }
        },
        tooltips:{
          enabled:true
        }
      }
    });
    //end chart
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
    getCount,
    getControllPanelPage,
    postDeleteStatus,
    showSigninForm,
    signin
}