import * as React from 'react';
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import { HTTP } from '../../../classes/class.definitions';
import * as tinymce from 'tinymce';
import 'tinymce/themes/silver';
import * as M from 'materialize-css';
import Comment from './comment';

interface IState {
    id: number,
    title: string,
    body: string,
    author: string,
    date: string,
    showDate: boolean
    editEnabled: boolean
    showProgressBar: boolean
    commentFormEnabled: boolean
    edit: {
        title: string,
    }
}

interface IProps {
    id: number,
    title: string,
    body: string,
    author: string,
    date: number,
    showDate: number,
    deletePost: () => void,
    key: number
}


class Post extends React.Component<IProps, IState> {
    moreBtn: React.RefObject<HTMLAnchorElement>;


    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {
            id: -1,
            title: "",
            body: "",
            author: "",
            date: "",
            showDate: true,
            editEnabled: false,
            showProgressBar: false,
            commentFormEnabled: false,
            edit: {
                title: "",
            }
        };
    }

    componentDidMount = () => {

        this.setState({
            id: this.props['id'],
            title: this.props['title'],
            body: this.props['body'],
            author: "",//this.props['author'],
            date: this.convertToReadableDate(this.props['date']),
            showDate: !!this.props['showDate'],

        })
        tinymce.init({
            selector: "#edit_body_" + this.props['id'],
            skin_url: '/lib/tinymce/skins/ui/oxide',
        })

    }

    convertToReadableDate(unix_timestamp: number): string {
        var date = new Date(unix_timestamp * 1000);

        return date.toISOString().split("T")[0];
    }

    handleDelete = () => {
        if (confirm("Are you sure you would like to delete this post?")) {
            var req = new HTTPRequest("DELETE", "/qa/posts/" + this.state.id);

            req.execVoid(HTTP.RESPONSE.OK)
                .then(function () {

                    this.props.deletePost();

                    M.toast({ html: "Your post was deleted!", classes: "green" })

                }.bind(this))
                .catch(function (err: Error) {

                    M.toast({
                        html: "We have trouble deleting your post. Try again later",
                        classes: "red"
                    });

                    console.error(err.message);

                }.bind(this))
        }
    }

    promptSaveChange = () => {
        if (this.state.title != this.state.edit.title || tinymce.get('edit_body_' + this.props.id).getContent() !== this.state.body) {
            return confirm("You have unsaved changes. Are you sure you would like to proceed?")
        } else {
            return true;
        }
    }

    handleEdit = () => {
        if (this.state.editEnabled) {
            if (this.promptSaveChange()) {
                this.disableEdit();
            }
        } else {
            this.enableEdit();
            tinymce.get('edit_body_' + this.props.id).setContent(this.state.body);
        }
    }

    resetChanges = () => {
        this.setState({
            edit: {
                title: this.state.title
            }
        })

        tinymce.get('edit_body_' + this.props.id).setContent(this.state.body);
    }

    handleEditSave = () => {
        this.showProgress();
        var req = new HTTPRequest("PATCH", "/qa/posts/" + this.state.id);
        var body_content = tinymce.get('edit_body_' + this.props.id).getContent();
        req.execAsJSON({
            title: this.state.edit.title,
            body: body_content
        }, HTTP.RESPONSE.ACCEPTED)
            .then(function (ret) {
                this.setState({
                    title: this.state.edit.title,
                    body: body_content
                });
                this.disableEdit();
                M.toast({
                    html: ret['msg'],
                    classes: 'green'
                })
            }.bind(this))
            .catch(function (err: Error) {

                console.log(err.message);
                M.toast({
                    html: "We had trouble updating the post. Try again later."
                })
            }.bind(this))
            .finally(function () {
                this.hideProgress();
            }.bind(this))
    }

    handleTitleEdit = (e) => {
        this.setState({
            edit: {
                title: e.target.value
            }
        })
    }

    enableEdit = () => {
        this.setState({
            editEnabled: true,
            edit: {
                title: this.state.title
            }
        }, function () {
        })

    }

    disableEdit = () => {
        this.setState({
            editEnabled: false
        })

    }

    showProgress = () => {
        this.setState({
            showProgressBar: true
        })
    }

    hideProgress = () => {
        this.setState({
            showProgressBar: false
        })
    }

    toggleCommentForm = () => {
        this.setState({
            commentFormEnabled: !this.state.commentFormEnabled
        })
    }

    commentForm = () => {
        if (this.state.commentFormEnabled) {
            return (
                <Comment post_id={this.props.id} />
            )
        } else {
            return (null);
        }
    }

    content = () => {
        return (
            <div>
                <div style={{ display: this.state.editEnabled ? 'none' : null }}>
                    <span className="card-title">{this.state.title}</span>
                    <div dangerouslySetInnerHTML={{ __html: this.state.body }}></div>
                    <small> {this.state.showDate ? "Posted at: " + this.state.date : ""}</small>


                </div>
                <div style={{ display: this.state.editEnabled ? null : 'none' }}>
                    <input type="text" name="title" value={this.state.edit.title} placeholder={this.state.title} onChange={this.handleTitleEdit} />
                    <textarea id={"edit_body_" + this.props.id}></textarea>
                </div>
            </div>
        )
    }

    actions = () => {

        return (
            <div>
                <div className="row" style={{ display: this.state.editEnabled ? null : 'none' }}>
                    <a className="btn-small green waves-effect" onClick={this.handleEditSave}><i className="material-icons left">save</i> Save</a>

                    <a href="#!" className="btn-flat orange-text" onClick={this.resetChanges}>Reset Changes</a>

                    <a href="#!" className="btn-flat orange-text" onClick={this.handleEdit}>Cancel</a>

                    <a href="#!" className="btn-flat red-text" onClick={this.handleDelete}>Delete</a>


                    <div className="progress" style={{ display: this.state.showProgressBar ? null : "none" }}>
                        <div className="indeterminate"></div>
                    </div>

                </div>

                <div className="row" style={{ display: this.state.editEnabled ? 'none' : null }}>
                    {this.commentForm()}
                    <a href="#!" className='blue-text' onClick={this.handleEdit}>Edit Post</a>
                    <a href="#!" className='blue-text' onClick={this.toggleCommentForm}>{this.state.commentFormEnabled ? 'Hide Comments' : 'Make a comment'}</a>
                </div>
            </div>
        )

    }

    render(): React.ReactNode {
        return (
            <div className="card">
                <div className="card-content">
                    {this.content()}
                </div>
                <div className="card-action">
                    {this.actions()}

                </div>
            </div>
        )
    }
}
export default Post;