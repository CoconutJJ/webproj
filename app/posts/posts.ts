import * as express from 'express';
import { Posts } from '../../classes/backend/class.Posts';
import { HTTP } from '../../classes/definitions/HTTP';
import { UserPermissions } from '../../classes/definitions/UserPermissions';
import { PostsModel } from '../../interfaces/interface.db';
import * as comments from './comments';
import { db } from '../../classes/backend/class.db';
import '../../classes/class.definitions';
import { IncomingForm, Files, Fields } from 'formidable';

const app = express.Router();

app.use('/comments', comments);

app.use(function (req, res, next) {

    // var form = new IncomingForm();
    // form.parse(req, function (err, fields: Fields, files: Files) {
    //     files['ce'].
    // });
    if (!req.ContextUser.isLoggedIn()) {
        if (req.xhr) {
            res.status(HTTP.RESPONSE.UNAUTHORIZED).send();
        } else {
            res.redirect("/qa/login");
        }
    } else {

        switch (req.method) {

            case "GET":
                next();
                break;

            case "POST":
                if (!req.ContextUser.hasPermission(UserPermissions.Posts.admin.create) && !req.ContextUser.hasPermission(UserPermissions.Posts.owner.create)) {
                    res.status(HTTP.RESPONSE.UNAUTHORIZED).send(JSON.stringify({
                        code: "EPERM",
                        msg: "You are not authorized to perform this action"
                    }))
                } else {
                    next();
                }
                break;

            case "PATCH":
                if (!req.ContextUser.hasPermission(UserPermissions.Posts.admin.edit) && !req.ContextUser.hasPermission(UserPermissions.Posts.owner.edit)) {
                    res.status(HTTP.RESPONSE.UNAUTHORIZED).send(JSON.stringify({
                        code: "EPERM",
                        msg: "You are not authorized to perform this action"
                    }))
                } else {
                    next();
                }
                break;

            case "DELETE":
                if (!req.ContextUser.hasPermission(UserPermissions.Posts.admin.delete) && !req.ContextUser.hasPermission(UserPermissions.Posts.owner.delete)) {
                    res.status(HTTP.RESPONSE.UNAUTHORIZED).send(JSON.stringify({
                        code: "EPERM",
                        msg: "You are not authorized to perform this action"
                    }))
                } else {
                    next();
                }
                break;

            default:
                next();
                break;
        }

    }

})

app.post('/', function (req, res) {

    if (req.ContextUser.validateCSRF()) {


        var post = Posts.createPost({
            title: req.body['title'],
            author: req.ContextUser.id(),
            body: req.body['body'],
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
    } else {
        res.status(HTTP.RESPONSE.UNAUTHORIZED).send(JSON.stringify({
            code: "ERR",
            msg: "Invalid Request"
        }))
    }
})

app.get('/:id(\\d+)?', function (req, res) {

    Posts.getColumns(["id", "title", "body", "created_at", "showDate", "author"]).then(function (posts) {

        var allPosts = [];
        for (let i = 0; i < posts.length; i++) {

            var curr: PostsModel = posts[i].getModel();

            allPosts.push(curr);
        }

        res.status(HTTP.RESPONSE.OK).send(JSON.stringify(allPosts))
    })


});

app.get('/view', function (req, res) {
    res.render('../pages/qa/qa_view_post.ejs', { title: 'All Posts' })
})
app.get('/create', function (req, res) {
    res.render('../pages/qa/qa_create_post.ejs', { title: 'Create Post' });
})

app.patch('/:id(\\d+)', function (req, res) {

    Posts.allPosts([{ id: req.params['id'] }]).then(function (posts) {
        if (posts.length == 1) {
            return posts[0].updatePost({
                title: req.body['title'],
                body: req.body['body']
            });
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

app.delete('/:id(\\d+)', function (req, res) {

    Posts.allPosts([{ id: req.params['id'] }]).then(function (posts) {
        if (posts.length == 1) {
            posts[0].delete();
            res.status(HTTP.RESPONSE.OK).send(
                JSON.stringify({
                    code: 'OK',
                    msg: 'Post has been successfully deleted'
                })
            )
        } else {
            res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(
                JSON.stringify({
                    code: 'ERR',
                    msg: 'An error has occurred. Error Code: 1'
                })
            )
        }
    }).catch(function () {
        res.status(HTTP.RESPONSE.INTERNAL_SERVER_ERROR).send(
            JSON.stringify({
                code: 'ERR',
                msg: 'An error has occurred. Error Code: 2'
            })
        )
    })
})




app.get('/:id(\\d+)/comments', function (req, res) {
    let dbh = new db();
    dbh.query(
        "SELECT comments.*, users.firstname, users.lastname, users.username\
         FROM comments \
         INNER JOIN users \
         ON comments.author = users.id\
         AND comments.post = ?",
        [req.params['id']]
    ).then(function (rows) {
        res.status(HTTP.RESPONSE.OK).send(JSON.stringify(rows));
    })
})

export = app;