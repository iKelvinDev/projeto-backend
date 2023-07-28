const express = require('express');
const router = express.Router();
const con = require('./dbconnection');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'

router.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token');
  res.sendStatus(200);
});

// Select de todos os pokemons
router.get('/', verificarToken, (req, res) => {
  con.query('SELECT * FROM tabela_pokemon', (sqlCommandError, result, fields) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }
    res.status(200).send(result);
  });
});

// Select de pokemon por ID
router.get('/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM tabela_pokemon WHERE pokemon_id = ?';
  con.query(sql, [id], (sqlCommandError, result, fields) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }

    if (result.length > 0) {
      res.status(200).send(result[0]);
    } else {
      res.status(404).send('Pokemon não encontrado');
    }
  });
});

// Insert de um novo pokemon
router.post('/', verificarToken, (req, res) => {
  const pokemon = req.body;
  if (!pokemon.usuario_id || isNaN(pokemon.usuario_id)) {
    res.status(400).json({ message: 'ID do usuário inválido' });
    return;
  }
  const sql = 'INSERT INTO tabela_pokemon (base_attack, base_defense, base_stamina, form, pokemon_id, usuario_id, pokemon_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [
    pokemon.base_attack,
    pokemon.base_defense,
    pokemon.base_stamina,
    pokemon.form,
    pokemon.pokemon_id,
    pokemon.usuario_id,
    pokemon.pokemon_name,
  ];

  con.query(sql, values, (sqlCommandError, result) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }
    res.status(200).json({ message: 'Pokemon criado com sucesso' });
  });
});

// Update de pokemon
router.put('/:id', verificarToken, (req, res) => {
  const id = req.params.id; 
  const pokemon = req.body;
  const sql = 'UPDATE tabela_pokemon SET base_attack = ?, base_defense = ?, base_stamina = ?, form = ?, pokemon_id = ?, usuario_id = ?, pokemon_name = ? WHERE id = ?';
  const values = [
    pokemon.base_attack,
    pokemon.base_defense,
    pokemon.base_stamina,
    pokemon.form,
    pokemon.pokemon_id,
    pokemon.usuario_id,
    pokemon.pokemon_name,
    id,
  ];

  con.query(sql, values, (updateError, result) => {
    if (updateError) {
      throw updateError;
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Pokemon atualizado com sucesso' });
    } else {
      res.status(404).json({ message: 'Pokemon não encontrado' });
    }
  });
});

// Delete de pokemon
router.delete('/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM tabela_pokemon WHERE id = ?';
  con.query(sql, [id], (sqlCommandError, result, fields) => {
    if (sqlCommandError) {
      throw sqlCommandError;
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Pokemon excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Pokemon não encontrado' });
    }
  });
});

// Função para verificar o token de autenticação
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
          req.usuario = decoded.email; 
          next();
        }
      });
    }
  }


module.exports = router;
