/*
    TURTLE.JS - DB NODEJS
*/


'use strict';


const db = require('../db.js');

// Restituisce tutti gli avvistamenti
exports.getAllSightings = function() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT tartarughe.id AS id, tartarughe.codice AS code, tartarughe.nome AS name, avvistamenti.data AS data, utenti.nome AS nameU, utenti.cognome AS cognomeU FROM tartarughe INNER JOIN avvistamenti ON tartarughe.id = avvistamenti.tartaruga INNER JOIN utenti ON avvistamenti.avvistatore = utenti.id WHERE avvistamenti.confermato = "s" ORDER BY 1 ';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const sightings = rows.map((e) => (
        {
          id: e.id, 
          code: e.code, 
          name: e.name, 
          data: e.data, 
          sighted: e.nameU + " " + e.cognomeU 
        }
      ));
      resolve(sightings);
    });
  });
};


// Restituisce tutti gli avvistamenti non ancora confermati
exports.getSightingsUnconfirmed = function() {
  return new Promise((resolve, reject) => {
   const sql = 'SELECT tartarughe.id AS id, tartarughe.codice AS code, tartarughe.nome AS name, avvistamenti.data AS data FROM tartarughe INNER JOIN avvistamenti ON tartarughe.id = avvistamenti.tartaruga  WHERE avvistamenti.confermato = "n" ORDER BY 1 ';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // Trasforma i risultati acquisiti dalla query in oggetti
      const unconfirmed = rows.map((e) => (
        {
          id: e.id,
          code: e.code,
          name: e.name,
          data: e.data
        }
      ));
      resolve(unconfirmed);
    });
  });
};

// Restituisce tutti gli avvistamenti di un certo utente
exports.getMySightingsById = function(id) {
  return new Promise((resolve, reject) => {
   const sql = 'SELECT tartarughe.id AS id, tartarughe.codice AS code, tartarughe.nome AS name, avvistamenti.data AS data, luoghi.nome as luogo FROM tartarughe INNER JOIN avvistamenti ON tartarughe.id = avvistamenti.tartaruga INNER JOIN luoghi ON avvistamenti.luogo = luoghi.codice WHERE avvistamenti.avvistatore = ? AND avvistamenti.confermato = "s" ORDER BY 1 ';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const mysightings = rows.map((e) => (
        {
          id: e.id,
          code: e.code,
          name: e.name,
          data: e.data,
          place: e.luogo
        }
      ));
      console.log("sono qui")
      console.log(mysightings);
      resolve(mysightings);
    });
  });
};

// Restituisce una tartaruga con un certo id
exports.getTurtleById = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT tartarughe.id, tartarughe.nome, tartarughe.descrizione, tartarughe.sesso, tartarughe.pathfoto, specie.nome as specie FROM tartarughe INNER JOIN specie ON tartarughe.specie = specie.id WHERE tartarughe.id = ?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const turtle = rows.map((e) => (
        {
          id: e.id,
          name: e.nome,
          description: e.descrizione,
          sex: e.sesso,
          foto: e.pathfoto,
          specie: e.specie
        }
      ));
      resolve(turtle);
    });
  });
};

// Restituisce una tartaruga con un certo nome
exports.getTurtleByName = function(name) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT tartarughe.id, tartarughe.codice, tartarughe.descrizione, tartarughe.sesso, tartarughe.pathfoto, specie.nome as specie FROM tartarughe INNER JOIN specie ON tartarughe.specie = specie.id WHERE tartarughe.nome = ? COLLATE NOCASE';
    db.all(sql, [name], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const turtle = rows.map((e) => (
        {
          id: e.id,
          code: e.codice,
          description: e.descrizione,
          sex: e.sesso,
          foto: e.pathfoto,
          specie: e.specie
        }
      ));
      resolve(turtle);
    });
  });
};

// Restituisce una tartaruga con un certo id non ancora confermata
exports.getUnconfirmedById = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT tartarughe.descrizione, tartarughe.sesso, tartarughe.pathfoto, specie.nome as specie, avvistamenti.data, luoghi.nome FROM tartarughe INNER JOIN specie ON tartarughe.specie = specie.id INNER JOIN avvistamenti ON tartarughe.id = avvistamenti.tartaruga INNER JOIN luoghi ON avvistamenti.luogo = luoghi.codice WHERE tartarughe.id = ? AND avvistamenti.confermato = "n"';
    // execute the query and get all the results into 'rows'
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const unconfirmed = rows.map((e) => (
        {
          description: e.descrizione,
          sex: e.sesso,
          foto: e.pathfoto,
          specie: e.specie,
          data: e.data,
          luogo: e.nome
        }
      ));
      resolve(unconfirmed);
    });
  });
};


// Aggiunge una tartaruga da confermare
exports.addUnconfirmed = function (turtle){
  return new Promise((resolve, reject)=> {
  let turtleid;
  const sql = 'INSERT INTO tartarughe (nome, descrizione, specie, sesso, pathfoto) VALUES( ?, ?, ?, ?, ?);';
  db.run(sql, [   
                  turtle.name,
                  turtle.sign,
                  turtle.specie,
                  turtle.sex
              ], function (err) {
                  if (err)
                      reject(err);  
                  else
                    {
                      const sql2 = 'INSERT INTO avvistamenti (data, tartaruga, avvistatore, luogo, confermato) VALUES( ?, ?, ?, ?, "n");';
                      db.run(sql2, [    turtle.date,
                                        this.lastID,
                                        turtle.userid,
                                        turtle.place
                                  ], function (err) {
                                      if (err)
                                          reject(err);        
                                      });
                      addPathfoto(this.lastID);
                      resolve (this.lastID);
                    }
                  });       

  
  });       

} 


// Conferma una tartaruga
exports.addConfirmed = function(id, code) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE avvistamenti SET confermato = "s" WHERE tartaruga = ?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      else
      {
        addCode(id, code);
        resolve(this.lastID);    
      }
    });
      
  });
};

// Rifiuta una tartaruga
exports.refuse = function(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM avvistamenti WHERE tartaruga = ?;';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      else
      {
        return new Promise((resolve, reject) => {
          const sql2 = 'DELETE FROM tartarughe WHERE id = ?;';
          db.all(sql2, [id], (err, rows) => {
            if (err) {
              reject(err);
              return;
            }
          });
            
        });
        resolve(this.lastID);    
      }
    });
      
  });
};

// Aggiunge il codice ad una tartaruga
function addCode(id, code){
  
  return new Promise((resolve, reject)=> {
    const sql = 'UPDATE tartarughe SET codice = ? WHERE id = ?';
    db.all(sql, [code, id], (err, rows) => {
      if (err) {
        reject(err);
      }
    });
  }); 
}


// Aggiunge il percorso foto ad una tartaruga
function addPathfoto(id){
  return new Promise((resolve, reject)=> {
  let turtleid;
  const sql = 'UPDATE tartarughe SET pathfoto = ? WHERE id = ?;';
  db.run(sql, [   "progetto/public/images/turtle/"+id,
                  id
              ], function (err) {
                  if (err)
                      reject(err);
                  });
  });       

}