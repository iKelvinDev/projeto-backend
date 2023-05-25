const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
var userEx = express.Router();
//const userEx = express();

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dblojahardware'
});

con.connect((erro) => {
  if(erro) {
    throw erro;
  }
});

/* GET users listing. */

//userEx.post

userEx.get('/lusers', verificarToken, (req, res) => {
  con.query('SELECT * FROM tbusuarios', (erroComandoSQL, result, fields) => {
    if(erroComandoSQL) {
      throw erroComandoSQL;
    }

    console.log(result);
    res.status(200).send(result);
  })
});





module.exports = userEx;
