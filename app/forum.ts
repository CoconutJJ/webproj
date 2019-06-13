import * as express from 'express';
import { Login } from '../classes/backend/class.Login';
import * as auth from './auth';
import { HTTP } from '../classes/class.definitions';
import { CurrentUser } from '../classes/backend/class.CurrentUser';
import { Posts } from '../classes/backend/class.Posts';
import { PostsModel } from '../interfaces/interface.db';

const app = express.Router();

var currUser: CurrentUser;


app.use('/auth', auth);

app.use(function(req, res, next) {
    currUser = req['currentUser'];
    next();
})

app.get('/', function (req, res) {
    res.render('../pages/qa/qa_home.ejs', { title: 'Home' })
});


app.get('/posts/:id(\\d+)?', function (req, res) {
    if (!req['currentUser'].isLoggedIn()) {
        res.redirect('/qa/login');
    } else {
        Posts.getColumns(["id", "title", "body", "created_at", "showDate", "author"]).then(function (posts) {
            
            var allPosts = [];
            for (let i = 0; i < posts.length; i++) {

                var curr: PostsModel = posts[i].getModel();

                allPosts.push(curr);
            }

            res.status(HTTP.RESPONSE.OK).send(JSON.stringify(allPosts))
        })

    }

});

app.get('/posts/view', function (req, res) {
    
    res.render('../pages/qa/qa_view_post.ejs', {title: 'All Posts'})

})

app.post('/posts', function (req, res) {

    var post = Posts.createPost({
        title: req.body['title'],
        author: currUser.id,
        body: req.body['body'],
        created_at: Math.floor(Date.now()/1000),
        updated_at: Math.floor(Date.now()/1000),
        showAuthor: req.body['showAuthor'],
        showDate: req.body['showDate']
    }).then(function () {

        res.status(HTTP.RESPONSE.ACCEPTED).send(JSON.stringify({
            code: "OK",
            msg: "Post successfully created"
        }))

    }).catch(function (err) {
        res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(JSON.stringify({
            code: "ERR",
            msg: err.toString()
        }))
    })
})

app.patch('/posts/:id(\\d+)', function (req, res) {
    Posts.allPosts([{id: req.params['id']}]).then(function (posts) {
        if (posts.length == 1) {
            posts[0].set('title', req.body['title']);
            posts[0].set('body', req.body['body']);
            return posts[0].update();
        } else {
            return Promise.reject("An error has occurred. Error Code: 1");
        }
    }).then(function () {
        res.status(HTTP.RESPONSE.ACCEPTED).send(JSON.stringify({
            code: 'OK',
            msg: 'Post has been successfully updated'
        }))
    }).catch(function (msg) {
        res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(JSON.stringify({
            code: 'ERR',
            msg: msg
        }))
    })
})

app.delete('/posts/:id(\\d+)', function(req, res) {
    Posts.allPosts([{id: req.params['id']}]).then(function (posts){
        if (posts.length == 1) {
            posts[0].delete();
            res.status(HTTP.RESPONSE.OK).send(JSON.stringify({
                code: 'OK',
                msg: 'Post has been successfully deleted'
            }))
        } else {
            res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(JSON.stringify({
                code: 'ERR',
                msg: 'An error has occurred. Error Code: 1'
            }))
        }
    }).catch(function(){
        res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(JSON.stringify({
            code: 'ERR',
            msg: 'An error has occurred. Error Code: 2'
        }))
    })
})

app.get('/posts/create', function (req, res) {

    if (req['currentUser'].isLoggedIn()) {
        res.render('../pages/qa/qa_create_post.ejs', { title: 'Create Post' });
    } else {
        res.redirect('/qa/login');
    }
})


app.get('/signup', function (req, res) {
    if (!req['currentUser'].isLoggedIn()) {
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

    if (!currUser.isLoggedIn()) {
        res.render('../pages/qa/qa_login.ejs', { title: 'Login' })
    } else {
        res.redirect(HTTP.RESPONSE.FOUND, '/')
    }
})

app.get('/login/info', function (req, res) {
    if (currUser.isLoggedIn()) {
        console.log(currUser.userName);

        if (req.xhr) {
            res.send(JSON.stringify({
                username: currUser.userName,
                firstname: currUser.firstName,
                lastname: currUser.lastName,
                email: currUser.email
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
    req.session.destroy(function () {
        res.redirect(HTTP.RESPONSE.FOUND, '/qa/login');
    });
})


app.all('*', function (req, res) {
    res.redirect('/404');
})
export = app;