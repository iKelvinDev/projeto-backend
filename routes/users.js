const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2#23'
var router = express.Router();

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dblojahardware'
});

/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
