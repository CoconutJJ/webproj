import * as express from 'express';
import {db} from '../classes/backend/class.db';
const app = express.Router();

app.get('/valid', function (req, res) {


    let database = new db();
    let response = {};
    let workers = [];

    for (let k in req.query) {

        switch (k) {

            case "username":
                let op = database.query("SELECT COUNT(*) as 'count' FROM users WHERE username = ?", [req.query[k]]).then(function (data) {

                    if (data[0]['count'] == 0) {
                        response['username'] = true;
                    } else {
                        response['username'] = false;
                    }

                });
                
                workers.push(op);
                break;
            default:
                workers.push(Promise.reject("Unknown key: " + k))
                break;

        }


    }

    Promise.all(workers).then(function () {
        response['code'] = "OK";
        res.send(JSON.stringify(response));
    }).catch(function (msg) {
        res.send(JSON.stringify({ "code": "ERR", "msg": msg }))
    })
});

export = app;