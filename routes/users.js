const express = require('express');
const users = express.Router();
const con = require('./dbconnection');

const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'


function verificarToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).json({ auth: false, message: 'Nenhum token de autenticação informado' });

  } else {
    jwt.verify(token, MinhaSenha, function (err, decoded) {
      if (err) {
        return res.status(500).json({ auth: false, message: 'Token Inválido' });
      } else {
        console.log('Método acessado por ' + decoded.nome);
        next()
      }
    });
  }
}

// Método de login para usuários
users.post('/login', (req, res) => {
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

// Insert de usuário (acesso público)
users.post('/', (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = 'INSERT INTO TbUsuarios (nome, email, senha) VALUES (?, ?, ?)';
  con.query(sql, [nome, email, senha], (sqlCommandError, result) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }
    res.status(200).send('Usuário criado com sucesso');
  });
});

// Update de usuário
users.put('/:codigo', verificarToken, (req, res) => {
  const codigo = req.params.codigo;
  const { nome, email, senha } = req.body;
  const sql = 'UPDATE TbUsuarios SET nome = ?, email = ?, senha = ? WHERE codigo = ?';
  con.query(sql, [nome, email, senha, codigo], (updateError, result) => {
    if (updateError) {
      throw updateError;
    }

    if (result.affectedRows > 0) {
      res.status(200).send('Usuário alterado com sucesso');
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

// Delete de usuário
users.delete('/:codigo', verificarToken, (req, res) => {
  const codigo = req.params.codigo;
  const sql = 'DELETE FROM TbUsuarios WHERE codigo = ?';
  con.query(sql, [codigo], (sqlCommandError, result, fields) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }

    if (result.affectedRows > 0) {
      res.status(200).send('Usuário excluído com sucesso');
    } else {
      res.status(404).send('Usuário não encontrado');
    }
  });
});

module.exports = users;
