const mysql = require('mysql');


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dblojahardware'
});

con.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

module.exports = con;