import mysql from 'mysql2'
import 'dotenv/config'

const db = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
})

db.getConnection((err) => {
    if (err) throw err;
    console.log('Terhubung ke database MYSQL')
})

export default db;