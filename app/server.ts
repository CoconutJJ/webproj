import * as express from 'express';
import * as qa from './forum';
import * as form from './form';
import * as api from './api';
import * as session from 'express-session';
import * as mysql_store from 'express-mysql-session';
import * as fs from 'fs';
import * as bodyparser from 'body-parser'
import { CurrentUser } from '../classes/backend/class.CurrentUser';
import * as compress from 'compression';
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

app.use(compress());

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


  req.ContextUser = new CurrentUser(req.session);

  app.locals = {

    site: {
      loggedIn: req.ContextUser.isLoggedIn(),
      user: req.session['user'],
      env: app.get('env')
    },

  };
  next();
});

app.use('/api', api)

app.use('/qa', qa);

app.use('/form', form);

/**
  All React Component assets are mounted on this static route.
*/
app.use('/react_assets', express.static('react_components'));

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

app.use('/css', express.static('build/css'));

app.use('/js', express.static('build/js'));

app.use('/lib', express.static('lib'));

app.use(function (req, res, next) {
  res.redirect('/404');
});

app.listen(3000, '127.0.0.1');
