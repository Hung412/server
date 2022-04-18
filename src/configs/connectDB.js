import mysql from 'mysql2/promise';

// create the connection to database
console.log("Creating connection pool...");
const pool = mysql.createPool({
    host: 'remotemysql.com',
    user: '6FgoF2iQ6r',
    database: '6FgoF2iQ6r',
    password: 'ZOhvm8yeew',
    port: '3306'
});
export default pool;