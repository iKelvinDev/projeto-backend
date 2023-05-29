const express = require('express');
const router = express.Router();
const con = require('./db');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'

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

// Select de todos os fabricantes
router.get('/', verificarToken, (req, res) => {
    con.query('SELECT * FROM tbfabricantes', (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
        res.status(200).send(result);
    });
  });
  
  // Select de fabricantes por id
router.get('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM tbfabricantes WHERE id = ?';
    con.query(sql, [id], (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
  
        if (result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send('Fabricante não encontrado');
        }
    });
  });
  
  // Insert de fabricantes
router.post('/', (req, res) => {
    const { nome, endereco, telefone } = req.body;
    const sql = 'INSERT INTO tbfabricantes (nome, endereco, telefone) VALUES (?, ?, ?)';
    con.query(sql, [nome, endereco, telefone], (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
  
        if (result.affectedRows > 0) {
            res.status(200).send('Fabricante cadastrado com sucesso');
        } else {
            res.status(400).send('Erro ao cadastrar fabricante');
        }
    });
  });
  
  // Update de fabricantes
router.put('/:id', verificarToken,(req, res) => {
    const id = req.params.id;
    const { nome, endereco, telefone } = req.body;
    const sql = 'UPDATE tbfabricantes SET nome = ?, endereco = ?, telefone = ? WHERE id = ?';
    con.query(sql, [nome, endereco, telefone, id], (updateError, result) => {
        if (updateError) {
            throw updateError;
        }
  
        if (result.affectedRows > 0) {
            res.status(200).send('Fabricante alterado com sucesso');
        } else {
            res.status(404).send('Fabricante não encontrado');
        }
    });
  });
  
  // Delete de fabricantes
router.delete('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM tbfabricantes WHERE id = ?';
    con.query(sql, [id], (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
  
        if (result.affectedRows > 0) {
            res.status(200).send('Fabricante excluído com sucesso');
        } else {
            res.status(404).send('Fabricante não encontrado');
        }
    });
  });

module.exports = router;