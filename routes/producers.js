const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
const producers = express.Router();

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

// Select de todos os fabricantes
producers.get('/', verificarToken, (req, res) => {
    con.query('SELECT * FROM TbFabricantes', (sqlCommandError, result, fields) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
        res.status(200).send(result);
    });
});

// Select de fabricante por id
producers.get('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM TbFabricantes WHERE id = ?';
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

producers.post('/', verificarToken, (req, res) => {
    const { nome, endereco, telefone } = req.body;
    const sql = 'INSERT INTO TbFabricantes (nome, endereco, telefone) VALUES (?, ?, ?)';
    con.query(sql, [nome, endereco, telefone], (sqlCommandError, result) => {
        if (sqlCommandError) {
            throw sqlCommandError;
        }
        res.status(200).send('Fabricante adicionado com sucesso');
    });
});

module.exports = producers;
