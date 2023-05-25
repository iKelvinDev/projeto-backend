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


function verificarToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
      res.status(401).json({auth: false, message:'Nenhum token de autenticação informado'});

  }else{
      jwt.verify(token, MinhaSenha, function(err, decoded){
          if (err) {
              return res.status(500).json({auth: false, message: 'Token Inválido'});
          }else{
              console.log('Método acessado por ' + decoded.nome);
              next()
          }
      });
  }
}

//userEx.post

userEx.get('/list', verificarToken, (req, res) => {
  con.query('SELECT * FROM tbusuarios', (erroComandoSQL, result, fields) => {
    if(erroComandoSQL) {
      throw erroComandoSQL;
    }

    console.log(result);
    res.status(200).send(result);
  })
});


module.exports = userEx;
