const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
const products = express.Router();

// db connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dblojahardware'
});

con.connect((connectionError) => {
    if (connectionError) {
        throw connectionError;
    }
});

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
    con.query('SELECT * FROM TbProdutos', (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

// Select de produtos por id
products.get('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM TbProdutos WHERE id = ?';
    con.query(sql, [id], (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }

        if (result.length > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send('Não encontrado');
        }
    });
});

// Insert de produto
products.post('/', verificarToken, (req, res) => {
    const { id, nome, preço, descrição, quantidade_estoque, fabricante } = req.body;
    const query = 'INSERT INTO TbProdutos (id, nome, preço, descrição, quantidade_estoque, fabricante) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(query, [id, nome, preço, descrição, quantidade_estoque, fabricante], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao cadastrar produto' });
        } else {
            res.status(201).json({ message: 'Produto cadastrado com sucesso' });
        }
    });
});

module.exports = products;
