import * as express from 'express';
import * as db from '../classes/backend/class.db';
import * as DataSanitizer from '../classes/backend/class.DataSanitizer';

const app = express.Router();

app.post('/contact', function(req, res, next) {

  let database = new db.db();

  let fname = req.body['fname'], lname = req.body['lname'],
      email = req.body['email'], msg = req.body['body'];

  fname = DataSanitizer.DataSanitizer.DS(fname).escapeHTMLAngleBrackets().val();
  lname = DataSanitizer.DataSanitizer.DS(lname).escapeHTMLAngleBrackets().val();
  email = DataSanitizer.DataSanitizer.DS(email).escapeHTMLAngleBrackets().val();
  msg   = DataSanitizer.DataSanitizer.DS(msg).escapeHTMLAngleBrackets().val();



  database
      .query(
          'INSERT INTO `contacts` (firstname, lastname, email, message) VALUES (?, ?, ?, ?)',
          [fname, lname, email, msg])
      .then(function(status) {
        console.log(status);
        res.status(201).send(JSON.stringify({'success': true}))
        res.end();
      })
      .catch(function(err) {
        console.log('error:' + err);
      })
});


app.post('/register', function (req, res, next) {
  
  let database = new db.db();
  
  let fname = req.body['fname']
  let lname = req.body['lname']
  let email = req.body['email']
  let uname = req.body['uname']
  let pword = req.body['pword']
  


})

export = app;