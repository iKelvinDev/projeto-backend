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
        console.log('Método acessado por ' + decoded.email);
        req.usuario = decoded.email; // Armazena o nome do usuário no objeto de solicitação (request)
        next();
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

// Insert de usuário (acesso público)
users.post('/', (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = 'INSERT INTO TbUsuarios (nome, email, senha) VALUES (?, ?, ?)';
  con.query(sql, [nome, email, senha], (sqlCommandError, result) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }
    res.status(200).json({ message: 'Usuário criado com sucesso' });
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
      res.status(200).json({ message: 'Usuário alterado com sucesso' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
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
      res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  });
});

module.exports = users;
