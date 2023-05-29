const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
const users = express.Router();

// db connection
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

// Select de todos os usuários
users.get('/', verificarToken, (req, res) => {
  con.query('SELECT * FROM TbUsuarios', (sqlCommandError, result, fields) => {
      if (sqlCommandError) {
          throw sqlCommandError;
      }
      res.status(200).send(result);
  });
});

// Select de usuário por código
users.get('/:codigo', verificarToken, (req, res) => {
  const codigo = req.params.codigo;
  const sql = 'SELECT * FROM TbUsuarios WHERE codigo = ?';
  con.query(sql, [codigo], (sqlCommandError, result, fields) => {
      if (sqlCommandError) {
          throw sqlCommandError;
      }

      if (result.length > 0) {
          res.status(200).send(result);
      } else {
          res.status(404).send('Usuário não encontrado');
      }
  });
});

module.exports = users;
