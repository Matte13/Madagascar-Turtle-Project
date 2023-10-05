/*
    DB.JS - NODEJS
*/

'use strict';

const sqlite = require('sqlite3');

// Apertura del database 
const db = new sqlite.Database('turtleproject.db', (err) => {
  if (err) throw err;
});

module.exports = db;