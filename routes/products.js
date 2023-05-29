const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
//const products = express.Router();
//const app = express();
//app.use(express.json());
const router = express.Router();
const con = require('./db');


// função de autenticação usando jwt
function verificarToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({
            auth: false,
            message: 'Nenhum token de autenticação informado.',
        });
    } else {
        jwt.verify(token, MinhaSenha, function (err, decoded) {
            if (err) {
                res.status(500).json({ auth: false, message: 'Token inválido.' });
            } else {
                console.log('Metodo acessado por ' + decoded.nome);
                next();
            }
        });
    }
}

// Rota para cadastrar um novo produto
router.post('/', verificarToken, (req, res) => {
    const { id, nome, preço, descrição, quantidade_estoque, fabricante } = req.body;
    const query =
      'INSERT INTO tbprodutos (id, nome, preço, descrição, quantidade_estoque, fabricante) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [id, nome, preço, descrição, quantidade_estoque, fabricante], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao cadastrar produto' });
      } else {
        res.status(201).json({ message: 'Produto cadastrado com sucesso' });
      }
    });
  });
  
  // Rota para obter todos os produtos
router.get('/', verificarToken, (req, res) => {
    const query = 'SELECT * FROM tbprodutos';
    con.query(query, (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao obter produtos' });
      } else {
        res.json(result);
      }
    });
  });

  // Select de produtos por id
router.get('/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM TbProdutos WHERE id = ?';
  con.query(sql, [id], (sqlCommandError, result, fields) => {
      if (sqlCommandError) {
          throw sqlCommandError;
      }

      if (result.length > 0) {
          res.status(200).send(result);
      } else {
          res.status(404).send('Produto não encontrado');
      }
  });
});
  
  // Rota para atualizar um produto (requer autenticação)
router.put('/:id', verificarToken, (req, res) => {
      const id = req.params.id;
      const { nome, preço, descrição, quantidade_estoque, fabricante } = req.body;
      const query = 'UPDATE tbprodutos SET nome = ?, preço = ?, descrição = ?, quantidade_estoque = ?, fabricante = ? WHERE id = ?';
      con.query(query, [nome, preço, descrição, quantidade_estoque, fabricante, id], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Erro ao atualizar produto' });
        } 
        
        if (result.affectedRows > 0) {
            res.status(200).send('Registro alterado com sucesso');
        } else {
            res.status(404).send('Registro não encontrado');
        }
      });
    });
  
    // Rota para excluir um produto (requer autenticação)
router.delete('/:id', verificarToken, (req, res) => {
      const id = req.params.id;
      const query = 'DELETE FROM tbprodutos WHERE id = ?';
      con.query(query, [id], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Erro ao excluir produto' });
        } else {
          res.json({ message: 'Produto excluído com sucesso' });
        }
      });
    });

module.exports = router;
//module.exports = products;