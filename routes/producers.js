const express = require('express');
const producers = express.Router();
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

// Insert para fabricante
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

// Update para fabricante
producers.put('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const { nome, endereco, telefone } = req.body;
    const sql = 'UPDATE TbFabricantes SET nome = ?, endereco = ?, telefone = ? WHERE id = ?';
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

// Delete para fabricante
producers.delete('/:id', verificarToken, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM TbFabricantes WHERE id = ?';
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

module.exports = producers;
