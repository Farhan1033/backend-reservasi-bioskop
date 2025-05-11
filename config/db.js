import mysql from 'mysql2'

const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bioskop'
})

db.connection((err) => {
    if (err) throw err;
    console.log('Terhubung ke database MYSQL')
})

export default db;