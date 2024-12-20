// richiamo mysql 
const mysql = require('mysql2')

// creo un oggetto che contiene le credenziali di mysql e il database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'GhtGhtLiat1',
    database: 'blog_db'
})

// creo la connessione con la funzione di mysql
connection.connect((err) => {
    if (err) throw err
    console.log('Connected to Mysql')
})


// esporto la connessione
module.exports = connection