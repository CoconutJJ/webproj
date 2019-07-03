import * as express from 'express';
import { db } from '../../classes/backend/class.db';
import { HTTP } from '../../classes/definitions/HTTP';
import '../../classes/class.definitions';
import * as mysql from 'mysql'
const app = express.Router();

app.use(function (req, res, next) {
    if (!req.ContextUser.isLoggedIn()) {
        if (!req.xhr) {
            res.status(HTTP.RESPONSE.UNAUTHORIZED).send();
        } else {
            res.redirect('/qa/login');
        }
    } else {
        next();
    }

})

app.post('/', function (req, res) {
    let dbh = new db();
    let timestamp = Math.floor(Date.now() / 1000);
    dbh.query(
        "INSERT INTO comments\
        (comment, author, post, created_at, updated_at)\
        VALUES (?,?,?,?,?)", [req.body['comment'], req.ContextUser.id(), req.body['post'], timestamp, timestamp]
    ).then(function (rows) {

        res.status(HTTP.RESPONSE.ACCEPTED).send(JSON.stringify({
            code: "OK",
            msg: "Your comment was posted",
            data: {
                id: rows['insertId'],
                timestamp: timestamp,
                author: {
                    firstName: req.ContextUser.firstName(),
                    lastName: req.ContextUser.lastName(),
                    username: req.ContextUser.userName()
                }
            }

        }))
    })
})

app.patch('/:id(\\d+)', function (req, res) {

    let dbh = new db();

    dbh.query(
        "UPDATE comments SET comment = ?, updated_at = ? WHERE id = ?",
        [req.body["comment"], Math.floor(Date.now() / 1000), req.params["id"]])
        .then(function (result) {

            // console.log(result);

            res.status(HTTP.RESPONSE.ACCEPTED).send(
                JSON.stringify({
                    code: "OK",
                    msg: "Your comment was updated"
                })
            );

        });

})

app.delete('/:id(\\d+)', function (req, res) {

    let dbh = new db();

    dbh.query(
        "DELETE FROM comments WHERE id = ?",
        [req.params['id']]
    ).then(function () {
        res.status(HTTP.RESPONSE.OK).send(JSON.stringify({
            code: "OK",
            msg: "Comment was deleted"
        }))
    })

})
export = app;