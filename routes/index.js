/*
    INDEX.JS - ROUTE NODEJS
*/

let express = require('express');
let router = express.Router();

// Renderizza la pagina di index
router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;
