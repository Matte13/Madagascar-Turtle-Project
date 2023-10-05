/*
    APP.JS - NODEJS
*/

// Import moduli
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const moment = require('moment');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDao = require('./models/user-dao.js');
const { Passport } = require('passport');
let requirejs = require('requirejs');

// Creazione dei router
const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const avvistatoreRouter = require('./routes/avvistatore');
const amministratoreRouter = require('./routes/amministratore');
const sessionsRouter = require('./routes/sessions');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});



let app = express();

// Utilizzo di EJS come motore per le view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Variabili di default per le view
app.use(function (req, res, next) {
  app.locals.moment = moment;
  app.locals.title = '';
  app.locals.message = '';
  app.locals.active = '';
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// Implementazione logica login
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));

// Serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userDao.getUserById(id).then(user => {
    done(null, user);
  });
});

// Gestione della sessione
app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// Inizializzazione passport
app.use(passport.initialize());
app.use(passport.session());

// Funzione per determinare se l'utente è loggato o meno
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    next();
  else
    res.redirect('/login');
}

// Gestione delle rotte
app.use('/', sessionsRouter);
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/avvistatore', isLoggedIn, avvistatoreRouter);
app.use('/amministratore', isLoggedIn, amministratoreRouter);


// Intercetta l'errore 404 e crea l'errore
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestione dell'errore
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Rendering pagina di errore
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
