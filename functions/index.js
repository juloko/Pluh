const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const developer = express();
const cors = require('cors');
const { errors } = require('celebrate')

const routes = require('./src/routes')

const app = express();

//Init firebase.
admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

// Automatically allow cross-origin requests
app.use(cors({
    // credentials: true,
    // origin: true
}));

// Automatically allow cross-origin for local host.
app.put((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true'); // vital
    res.set('Access-Control-Allow-Methods', 'PUT','GET', 'POST', 'DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
});


//Routers requires and calls.
app.use(express.json())
app.use(routes)
app.use(errors())

exports.app = functions
    .runWith({
        timeoutSeconds: 300,
        memory: '1GB'
    })
    .https.onRequest(app)




/**
* Métodos HTTP:
*
* GET: Buscar uma informação no back-end.
* POST: Criar uma informação no back-end.
* PUT: Alterar uma informação no back-end.
* DELETE: Deletar umas informação no back-end.
*/

/**
*
*
* Query Params: Parâmetros nomeados enviados na rota após "?" (filtros, paginação).
* Route Params: Parâmetros utilizados para identificar recursos após "/:".
* Request Body: Corpo da requisição, utilizado para criara ou alterar recursos.
*/


/**
 * SQL: MySQL, SQLite, PostfreeSQL, Oracle, Microsoft SQL Server.
 * NoSQL: MongoDB, CouchDB, etc.
*/

/**
 * Driver: SELECT *FROM users
 * Query Builder: table('user').select('*').where()
*/
