import * as express from 'express';
import { db } from '../classes/backend/class.db';
import { HTTP } from '../classes/definitions/HTTP';

const app = express.Router();

app.get('/db/:tableName/datatables', function (req, res) {

    let dbh = new db();

    dbh.query("SELECT * FROM posts", []).then(function (rows) {
        res.status(HTTP.RESPONSE.OK).send(JSON.stringify(rows))
    })

})

export = app;