/*
    SIGNUP.JS - ROUTE NODEJS
*/

let express = require('express');
const bodyParser = require('body-parser');
const userDao = require('../models/user-dao.js');
const { check, validationResult} = require('express-validator');
const User = require('./../user');
let router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended:false });

// Rendering pagina di SignUp
router.get('/', function(req, res, next) {
    res.render('signup');
});


// Controllo dei valori inseriti nel form e creazione nuovo utente
router.post('/', urlencodedParser, [
    check('email', 'This username must be 3+ characters long')
        .exists()
        .isLength({ min: 3 })
        .custom(async (email) => {
            const existingUser = await userDao.getUser({ email });
            if (!existingUser) {
                throw new Error('Email already in use')
            }
        }),
    check('password', 'Password is requried')
        .isLength({ min: 4 })
        .custom((val, { req, loc, path }) => {
            if (val !== req.body.re_password) {
                throw new Error("Passwords don't match");
            } else {
                return val;
            }
        }),    
], (req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
       const alert = errors.array()
        res.render('signup', {
            alert
        })
    }
    else 
    {
        const user = new User(req.body.name, req.body.surname, req.body.email, req.body.password);
        userDao.insertUser(user);
        res.render('login');
    }

})

module.exports = router;
