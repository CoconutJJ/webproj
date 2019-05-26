import * as express from 'express';
import * as path from 'path';
import * as qa from './forum';
import * as form from './form';
// import * as db from '../classes/backend/class.db';
import * as session from 'express-session';
import * as mysql_store from 'express-mysql-session';
import * as fs from 'fs';
import * as bodyparser from 'body-parser'
import * as currUser from '../classes/backend/class.CurrentUser';
import * as crypto from 'crypto'
const app: express.Application = express();

var mysqlstore = new mysql_store({ 
  host: "localhost",
  port: 3306, 
  database: "site",
  user: "root",
  password: ""
});

var SECRET = fs.readFileSync(__dirname + '/../../SESSION_SECRET', { encoding: 'UTF-8' }).toString().replace('\n', '');

app.set('view engine', 'ejs');

app.use(session({
  secret: SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
  store: mysqlstore as any,
  name: 'sess'
}));

app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(bodyparser.json());

// app.get('*', function(req, res, next){
//   req.session.loggedIn = false;
//   next();
// });


app.use(function (req, res, next) {
  
  
  req['currentUser'] = new currUser.CurrentUser(req.session);

  app.locals = {

    site: {
      loggedIn: req['currentUser'].isLoggedIn(),
      user: req.session['user']

    },

  };

  req.session['VALID_REQUEST'] = (req.method !== "GET" && req.session['CSRF_TOKEN'] === req.headers['CSRF_TOKEN']);

  if (req.method == "GET") {
    let csrf_tok = crypto.randomBytes(128, function (err, buf) {
      res.setHeader("CSRF-Token", buf.toString('hex'));
      res.cookie('CSRF_TOKEN', buf.toString('hex'), {
        path: '/',
        expires: new Date("January 1, 2119 00:00:00"),
        sameSite: "Strict"
        
      });
      req.session['CSRF_TOKEN'] = buf.toString('hex');
      next();
    })
  } else {
    next();
  }
});


app.use('/qa', qa);

app.use('/form', form);


app.get('/', function (req, res) {
  res.render('../pages/index.ejs');
});

app.get('/about', function (req, res) {
  res.render('../pages/about.ejs');
});

app.get('/contact', function (req, res) {
  res.render('../pages/contact.ejs');
});

app.get('/ta', function (req, res) {
  res.render('../pages/courses.ejs');
});

app.get('/notes', function (req, res) {
  res.render('../pages/notes.ejs')
});

app.get('/404', function (req, res) {
  res.send("<h1>404</h1><p>Page not found.</p>");
});

app.get('/css/:fn', function (req, res) {
  res.header('Content-Type', 'text/css');

  var requestPath: string = path.resolve(__dirname + '/../css/' + req.params.fn);


  if (requestPath.indexOf("/css") !== -1) {
    res.sendFile(requestPath);
  } else {
    res.redirect('/');
  }

});

app.get('/js/:fn', function (req, res) {
  res.header('Content-Type', 'text/javascript');

  let requestPath: string = path.resolve(__dirname + '/../js/' + req.params.fn);

  if (requestPath.indexOf("/js") !== -1) {
    res.sendFile(requestPath);
  } else {
    res.redirect('/');
  }

});

app.get('/lib/:fn([a-zA-Z0-9\/\\-\\.]+)', function (req, res) {
  let requestPath: string = path.resolve(__dirname + '/../../lib/' + req.params.fn);

  if (requestPath.indexOf("/lib") !== -1) {
    res.sendFile(requestPath);
  } else {
    res.redirect('/');
  }
});

app.use(function (req, res, next) {
  res.redirect('/404');
});

app.listen(3000, '127.0.0.1');
