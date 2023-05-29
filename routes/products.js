const express = require('express');
const products = express.Router();
const con = require('./dbconnection');

const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'


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

// Select de todos os produtos
products.get('/', verificarToken, (req, res) => {
    con.query('SELECT * FROM TbProdutos', (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
        res.status(200).send(result);
    });
});

// Select de produtos por id
products.get('/:id', verificarToken, (req, res) => {
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

// Insert de produto
products.post('/', verificarToken, (req, res) => {
    const { id, nome, preço, descrição, quantidade_estoque, fabricante } = req.body;
    const sql = 'INSERT INTO TbProdutos (id, nome, preço, descrição, quantidade_estoque, fabricante) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(sql, [id, nome, preço, descrição, quantidade_estoque, fabricante], (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }

        if (result.affectedRows > 0) {
            res.status(200).send('Produto cadastrado com sucesso');
        } else {
            res.status(400).send('Erro ao cadastrar produto');
        }
    });
});

// Update de produto
products.put('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const { nome, preço, descrição, quantidade_estoque, fabricante } = req.body;
    const sql = 'UPDATE TbProdutos SET nome = ?, preço = ?, descrição = ?, quantidade_estoque = ?, fabricante = ? WHERE id = ?';
    con.query(sql, [nome, preço, descrição, quantidade_estoque, fabricante, id], (updateError, result) => {
        if (updateError) {
            throw updateError;
        }

        if (result.affectedRows > 0) {
            res.status(200).send('Produto alterado com sucesso');
        } else {
            res.status(404).send('Produto não encontrado');
        }
    });
});

// Delete de produto
products.delete('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM TbProdutos WHERE id = ?';
    con.query(sql, [id], (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }

        if (result.affectedRows > 0) {
            res.status(200).send('Produto excluído com sucesso');
        } else {
            res.status(404).send('Produto não encontrado');
        }
    });
});

module.exports = products;
