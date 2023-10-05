/*
    SESSION.JS - ROUTE NODEJS
*/

'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const dao = require('../models/turtle-dao');
const daoU = require('../models/user-dao');
const User = require('./../user');


// Rendering pagina di login
router.get('/login', function(req, res, next) {
  res.render('login');
});

// Esegue il login
router.post('/sessions', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
        // Visualizza eventuali messaggi di errore
        return res.render('login', {
          info
      })
    }
    // Esegue il login
    req.login(user, function(err) {
      if (err) { return next(err); }
      if(req.user.tipe == 'u')
      {
        dao.getAllSightings().then((sightings) =>{
          daoU.getUserById(user.id).then((user) =>{
            dao.getMySightingsById(user.id).then((mysightings) =>{
              res.render('avvistatore', {title: 'Avvistatore', sightings, user, mysightings});
            });
          });
        });
      }
      else
      {
        dao.getAllSightings().then((sightings) =>{
          daoU.getUserById(user.id).then((user) =>{
            dao.getSightingsUnconfirmed().then((unconfirmed) =>{
                res.render('amministratore', {title: 'Amministratore', sightings, user, unconfirmed});
            });
          });
        });
      }
    });
  })(req, res, next);
});

// Modifica dei dati dell'utente
router.post('/session/modifyUser/', function(req, res, next) {
  daoU.modifyUser(req.body).then((id) =>{
      res.json(id);
  });
});

// Eliminazione dell'attuale sessione
router.delete('/sessions/current', function(req, res, next) {
  req.logout();
  res.end();
});

module.exports = router;
