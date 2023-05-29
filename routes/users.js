const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
//var userEx = express.Router();
//const userEx = express();
//const app = express();
//app.use(express.json());
const router = express.Router();
const con = require('./db');



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

// Rota para cadastrar um novo usuário
router.post('/', (req, res) => {
  const { codigo, nome, email, senha } = req.body;
  const query = 'INSERT INTO tbusuarios (codigo, nome, email, senha) VALUES (?, ?, ?, ?)';
  con.query(query, [codigo, nome, email, senha], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    } else {
      res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
    }
  });
});

// Rota para obter todos os usuários
router.get('/', verificarToken, (req, res) => {
  const query = 'SELECT * FROM tbusuarios';
  con.query(query, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao obter usuários' });
    } else {
      res.json(result);
    }
  });
});

router.get('/:codigo', verificarToken, (req, res) => {
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

router.put('/:codigo', verificarToken, (req, res) => {
    const codigo = req.params.codigo;
    const { nome, email, senha } = req.body;
    const query = 'UPDATE tbusuarios SET nome = ?, email = ?, senha = ? WHERE codigo = ?';
    con.query(query, [ nome, email, senha, codigo], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
      } else {
        res.json({ message: 'Usuário atualizado com sucesso' });
      }
    });
  });

router.delete('/:codigo', verificarToken, (req, res) => {
    const codigo = req.params.codigo;
    const query = 'DELETE FROM tbusuarios WHERE codigo = ?';
    con.query(query, [codigo], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao excluir usuário' });
      } else {
        res.json({ message: 'Usuário excluído com sucesso' });
      }
    });
  });

//userEx.post

/* userEx.get('/list', verificarToken, (req, res) => {
  con.query('SELECT * FROM tbusuarios', (erroComandoSQL, result, fields) => {
    if(erroComandoSQL) {
      throw erroComandoSQL;
    }

    console.log(result);
    res.status(200).send(result);
  })
}); */

module.exports = router;
//module.exports = userEx;
