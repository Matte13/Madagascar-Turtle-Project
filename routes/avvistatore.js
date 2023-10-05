/*
    AVVISTATORE.JS - ROUTE NODEJS
*/

let express = require('express');
let mv = require('mv');
let router = express.Router();
const dao = require('../models/turtle-dao');
const path = require("path");
const fs = require('fs');
const multer = require("multer");
let count = 0;

//Gestione del caricamento delle foto con Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'public/images/turtle');
  },
  filename: function(req, file, cb) {
      count++;
      cb(null, file.fieldname + count + path.extname(file.originalname));
  }
});

let upload = multer({ storage: storage })

// Renderizza la home page per l'avvistatore
router.get('/', function(req, res, next) {
    res.render('avvistatore', {title: 'Avvistatore'});
});


// Aggiunge un nuovo avvistamento
router.post('/addSighting/', function(req, res, next) {
    dao.addUnconfirmed(req.body).then((id) =>{   
        fs.mkdir('../progetto/public/images/turtle/'+id, (err) => {
            if (err) {
                throw err;
            }
        });
        res.json(id);
    });
});


// Esegue il caricamento delle foto attraverso la funzione upload()
router.post('/', upload.array('foto'), (req, res) => {
  count = 0;
  res.json(200);
});

// Sposta le foto appena caricate nella corretta cartella attraverso l'uso dell'id
router.post('/move/:id', function(req, res, next) {
  const dir = 'public/images/turtle';
  const fs = require('fs')
  const files = fs.readdirSync(dir)

  for (const file of files) {
    if (file.endsWith('.jpg')) {
      fs.rename(
        dir + '/' + file,
        dir + '/' + req.params.id + '/' + file,
        err => {
          console.log(err);
        }
      )
    }
  }
  res.json(200);
});

// Restituisce un'immagine di una certa tartaruga
router.get('/video', function(req, res){
  res.sendFile('public/images/video/spiegazione.mp4', { root: '.' });
})


module.exports = router;
