import * as express from 'express';
import { db } from '../../classes/backend/class.db';
import { HTTP } from '../../classes/definitions/HTTP';
import '../../classes/class.definitions';

const app = express.Router();

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