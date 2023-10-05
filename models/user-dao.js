/*
    USER.JS - DB NODEJS
*/

'use strict';

const db = require('../db.js');
const bcrypt = require('bcrypt');

// Restituisce un utente rispetto all'id
exports.getUserById = function(id) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utenti WHERE id = ?';
      db.get(sql, [id], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
              const user = 
                {
                  id: row.id, 
                  name: row.nome,
                  surname: row.cognome,
                  email: row.email
                }
              resolve(user);
          }
      });
  });
};

// Restituisce un utente attraverso emael password
exports.getUser = function(email, password) {
  return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM utenti WHERE email = ?';
      db.get(sql, [email], (err, row) => {
          if (err) 
              reject(err);
          else if (row === undefined)
              resolve({error: 'User not found.'});
          else {
            const user = {id: row.id, username: row.email, tipe: row.tipo};
            let check = false;
            
            if(bcrypt.compareSync(password, row.password))
              check = true;

            resolve({user, check});
          }
      });
  });
};

// Inserisce un nuovo utente
exports.insertUser = function (user){
    return new Promise((resolve, reject)=> {
    const sql = 'INSERT INTO utenti(nome, cognome, email, password, tipo)  VALUES (?,?,?,?,?)';
    user.password = bcrypt.hashSync(user.password, 10);
    db.run(sql, [   user.nome,
                    user.cognome,
                    user.email, 
                    user.password, 
                    'u'
                ], function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this.lastID);                                
                             
                    });
    });       

}

// Modifica un utente esistente 
exports.modifyUser = function (user){
    return new Promise((resolve, reject)=> {
    
    const sql = 'UPDATE utenti SET nome = ?, cognome = ?, email = ?, password = ? WHERE id = ?';
    user.password = bcrypt.hashSync(user.password, 10);
    db.run(sql, [   user.nome,
                    user.cognome,
                    user.email, 
                    user.password,
                    user.id
                ], function (err) {
                    if (err)
                        reject(err);
                    else
                        resolve(this.lastID);                                
                             
                    });
    });       

}