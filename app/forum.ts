import * as express from 'express';
import { Login } from '../classes/backend/class.Login';
import '../classes/class.definitions';
import { HTTP } from '../classes/definitions/HTTP';
import * as auth from './auth';
import * as posts from './posts/posts';

const app = express.Router();


app.use('/auth', auth);

app.use('/posts', posts);

app.get('/', function (req, res) {
    res.render('../pages/qa/qa_home.ejs', { title: 'Home' })
});


app.get('/db/view', function (req, res) {
    res.render('../pages/qa/qa_view_db.ejs', { title: 'View Database' });
})



app.get('/signup', function (req, res) {
    if (!req.ContextUser.isLoggedIn()) {
        res.render('../pages/qa/qa_signup.ejs', { title: 'Sign Up' });
    } else {
        res.redirect('/');
    }
});


app.post('/signup', function (req, res) {
    Login.createUser({
        firstname: req.body['firstname'],
        lastname: req.body['lastname'],
        email: req.body['email'],
        username: req.body['username'],
        password: req.body['password']
    }).then(function (success) {

        if (success) {
            res.status(HTTP.RESPONSE.ACCEPTED).send(JSON.stringify({
                'code': 'ACCOUNT_CREATED',
                'msg': 'Account has been successfully created',
                'redirect': '/qa/home'
            }))
        } else {
            res.status(HTTP.RESPONSE.CONFLICT).send(JSON.stringify({
                'code': 'ACCOUNT_EXISTS',
                'msg': 'Username or Email already exists'
            }))
        }

    }).catch(function () {
        res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(JSON.stringify({
            'code': "SIGNUP_INTERNAL_ERROR",
            'msg': 'Failed to create account'
        }));
    })
});

app.post('/login', function (req, res) {
    var username = req.body['uname'];
    var password = req.body['pword'];

    Login.login(username, password)
        .then(function (success) {
            // console.log(success);
            if (success) {
                // start the session if the password matches
                return Login.startSession(username, req.session);

            } else {
                res.status(HTTP.RESPONSE.UNAUTHORIZED).send(JSON.stringify({
                    'code': 'LOGIN_FAILED',
                    'msg': 'Incorrect Username / Password'
                }));
            }

        }).then(function (success) {
            if (success) {
                res.status(HTTP.RESPONSE.ACCEPTED).send(JSON.stringify({
                    'code': 'LOGIN_SUCCESS',
                    'msg': 'Login Successful',
                    'redirect': '/qa'
                }));
            } else {
                res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send({
                    'code': 'LOGIN_INTERNAL_ERROR',
                    'msg': 'Could not initialize user session.'
                });
            }
        })
        .catch(function (err) {
            res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send({
                'code': 'LOGIN_INTERNAL_ERROR',
                'msg': 'Something went wrong. Try again later'
            });
        });
})


app.get('/login', function (req, res) {

    if (!req.ContextUser.isLoggedIn()) {
        res.render('../pages/qa/qa_login.ejs', { title: 'Login' })
    } else {
        res.redirect(HTTP.RESPONSE.FOUND, '/')
    }
})

app.get('/login/info', function (req, res) {
    if (req.ContextUser.isLoggedIn()) {

        if (req.xhr) {
            res.send(JSON.stringify({
                username: req.ContextUser.userName(),
                firstname: req.ContextUser.firstName(),
                lastname: req.ContextUser.lastName(),
                email: req.ContextUser.email()
            }));
        } else {
            res.redirect('/404');

        }
    } else {
        res.status(HTTP.RESPONSE.SERVICE_UNAVAILABLE).send(JSON.stringify({
            'code': 'INVALID_SESSION',
            'msg': 'The user is not logged in.'
        }));
    }
})

app.get('/logout', function (req, res) {
    req.ContextUser.logout().then(function () {
        res.redirect('/qa/login');
    })
})


app.all('*', function (req, res) {
    res.redirect('/404');
})
export = app;