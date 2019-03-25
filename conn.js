//First, require 'pg-promise'
//Call it immediately, which gives us a configured database connector
const pgp = require('pg-promise')();
// next, define the options for the connection to the database
const options = {
    host: 'localhost',
    database: 'restaurants-app'
};

//make a connection to the database specified by the options object
const db = pgp(options);

db.any('select * from users usr where usr.id = 1;', [true])
    .then(function(data) {
        // success;
        console.log(data);
    })
    .catch(function(error) {
        // error;
    });