/*
    AMMINISTRATORE.JS - ROUTE NODEJS
*/

var express = require('express');
var router = express.Router();
const dao = require('../models/turtle-dao');
const fs = require('fs');
var rimraf = require("rimraf");


// Renderizza la home page per l'amministratore
router.get('/', function(req, res, next) {
    res.render('amministratore', {title: 'Amministratore'});
});

// Restituisce una tartaruga rispetto all'id passato
router.post('/turtle/:id', function(req, res, next) {
    dao.getTurtleById(req.params.id).then((turtle) =>{
        res.json(turtle);
    });
});

// Restituisce una tartaruga rispetto al nome passato
router.post('/getTurtle/:name', function(req, res, next) {
    dao.getTurtleByName(req.params.name).then((turtle) =>{
        res.json(turtle);
    });
});

// Restituisce tutte le tartarughe non ancora confermate
router.post('/unconfirmed/:id', function(req, res, next) {
    dao.getUnconfirmedById(req.params.id).then((unconfirmed) =>{
        res.json(unconfirmed);
    });
});

// Restituisce un'immagine di una certa tartaruga
router.get('/image/:id:fotoname', function(req, res){
    res.sendFile('public/images/turtle/' + req.params.id + '/' + req.params.fotoname +'.jpg' , { root: '.' });
})

// Restituisce il numero di immagini di una determinata tartaruga
router.post('/getNumFile/:id', function(req, res, next) {
    const dir = 'public/images/turtle/'+ req.params.id;
    fs.readdir(dir, (err, files) => {
        res.json(files.length);
    })
});

router.post('/confirm/:id:cod', function(req, res, next) {
    dao.addConfirmed(req.params.id, req.params.cod).then((id) =>{
        res.json(id);
    });
});

// Gestisce il rifiuto di un avvistamento
router.post('/refuse/:id', function(req, res, next) {
    dao.refuse(req.params.id).then((id) =>{
        res.json(id);
    });
});

// Rimuove una directory rispetto all'id
router.post('/remove/:id', function(req, res, next) {
    rimraf("public/images/turtle/" + req.params.id, function () { console.log("done"); });
});






module.exports = router;
