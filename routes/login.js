const express = require('express');
const login = express.Router();
const con = require('./dbconnection');

const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23';

login.post('/', (req, res) => {
    const { email, senha } = req.body;
  
    const sql = 'SELECT * FROM TbUsuarios WHERE email = ? AND senha = ?';
    con.query(sql, [email, senha], (error, result) => {
      if (error) {
        console.error('Erro ao realizar a consulta:', error);
        res.status(500).json({ message: 'Erro ao processar o login. Por favor, tente novamente.' });
      } else {
        if (result.length > 0) {
          // Usuário encontrado, gera o token
          const token = jwt.sign({ email: email }, MinhaSenha, { expiresIn: '1h' }); // Gera um token válido por 1 hora
          res.status(200).json({ token });
        } else {
          // Usuário não encontrado ou senha inválida
          res.status(401).json({ message: 'Login ou senha inválidos' });
        }
      }
    });
  });

// login.post('/', (req, res) => {
//     const { usuario, senha } = req.body;
  
//     // Simule a autenticação. Substitua por suas próprias regras de autenticação.
//     if (usuario === 'admin' && senha === '1234') {
//       const token = jwt.sign({ nome: usuario }, MinhaSenha, { expiresIn: '1h' }); // Gera um token válido por 1 hora
  
//       res.status(200).json({ token });
//     } else {
//       res.status(401).json({ message: 'Login ou senha inválidos' });
//     }
//   });

// // Método de login para usuários
/* login.post('/', (req, res) => {
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM TbUsuarios WHERE email = ? AND senha = ?';
    con.query(sql, [email, senha], (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        } else {
            if (result.length > 0) {
                const token = jwt.sign({ email }, MinhaSenha, {
                    expiresIn: 60 * 10, // expires in 10 minutes (600 seconds)
                });
                res.json({ auth: true, token: token });
            } else {
                res.status(403).json({ message: 'Login inválido!' });
            }
        }
    });
}); */

module.exports = login;
