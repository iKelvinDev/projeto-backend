const express = require('express');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
const router = express.Router();
const con = require('./db');
// Método de login para usuários
router.post('/', (req, res) => {
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
  });

module.exports = router;