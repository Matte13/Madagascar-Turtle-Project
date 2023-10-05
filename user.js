'use strict';

/*
    MODULO CREAZIONE UTENTE
*/

class User  {
   

    constructor(nome, cognome, email, password){

        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
 
    }
}

module.exports = User;
