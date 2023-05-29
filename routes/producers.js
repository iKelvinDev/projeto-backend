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

module.exports = producers;
