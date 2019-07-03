import * as React from 'react';
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import * as M from 'materialize-css';
import { HTTP } from '../../../classes/definitions/HTTP';
interface IProps {
    commentId: number,
    commentAuthorFirstName: string,
    commentAuthorLastName: string,
    commentAuthorUsername: string,
    commentText: string,
    commentDate: string,
    commentUpdated: string,
    delete: () => void
}

interface IState {
    commentId: number,
    commentAuthorFirstName: string,
    commentAuthorLastName: string,
    commentAuthorUsername: string,
    commentText: string,
    commentDate: string,
    commentUpdated: string,


    changeEnabled: boolean,
    deleted: boolean
    editEnabled: boolean,
    editComment: string
    editCommentUpdateDisabled: boolean
}


class CommentStrip extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            ...this.props,
            changeEnabled: false,
            deleted: false,
            editComment: this.props.commentText,
            editEnabled: false,
            editCommentUpdateDisabled: false
        }
    }

    handleDelete = () => {

        this.props.delete();
        this.setState({
            deleted: true
        })


    }

    enableEdit = () => {
        this.setState({
            editEnabled: true
        })
    }

    disableEdit = () => {
        this.setState({
            editEnabled: false
        })
        this.disableCommentControls();
    }

    handleUpdateComment = () => {
        // disable the update button while ajax request is processing
        this.disableUpdateBtn();

        var req = new HTTPRequest("PATCH", "/qa/posts/comments/" + this.state.commentId);

        req.execAsJSON({
        
            comment: this.state.editComment
        
        }, HTTP.RESPONSE.ACCEPTED).then((data) => {
        
            if (data['code'] == "OK") {
                M.toast({ html: data['msg'], classes: "green" });
                this.setState({
                    commentText: this.state.editComment
                });
                this.disableEdit();
            } else {
                M.toast({ html: data['code'] + ": " + data['msg'], classes: "red" })
            }
        
        }).finally(() => {
            // re-enable to button regardless of outcome.
            this.enableUpdateBtn();
        
        });


    }

    handleCancelEdit = () => {
        this.disableEdit();
        this.setState({
            editComment: this.state.commentText
        })
    }

    handleEdit = () => {
        this.enableEdit();
    }

    enableCommentControls = () => {
        this.setState({
            changeEnabled: true
        })
    }

    disableCommentControls = () => {
        this.setState({
            changeEnabled: false
        })
    }

    handleEditChange = (e) => {
        this.setState({
            editComment: e.target.value
        })
    }

    disableUpdateBtn = () => {
        this.setState({
            editCommentUpdateDisabled: true
        })
    }

    enableUpdateBtn = () => {
        this.setState({
            editCommentUpdateDisabled: false
        })
    }

    editForm = () => {

        return (
            <div className="row">
                <div className="col l2 hide-on-med-and-down">
                    <div className="chip">
                        {this.state.commentAuthorFirstName + " " + this.state.commentAuthorLastName + " (" + this.state.commentAuthorUsername + ")"}
                    </div>
                </div>
                <div className="input-field col l8 s12 m12">

                    <textarea id="comment-box" className="materialize-textarea" onChange={this.handleEditChange} value={this.state.editComment}></textarea>
                    <label htmlFor="commentbox">Comment:</label>
                </div>
                <div className="input-field col l2 s12 m12">
                    <button className="green-text" onClick={this.handleUpdateComment} disabled={this.state.editCommentUpdateDisabled}>Update</button>
                    <a href="#!" className="blue-text" onClick={this.handleCancelEdit}>Cancel</a>
                </div>
            </div>
        );

    }

    viewForm = () => {
        return (
            <div className="row" onMouseOver={this.enableCommentControls} onMouseOut={this.disableCommentControls} style={{ display: this.state.deleted ? 'none' : null }}>
                <div className="col s10">

                    <div className="chip">
                        {this.state.commentAuthorFirstName + " " + this.state.commentAuthorLastName + " (" + this.state.commentAuthorUsername + ")"}
                    </div>
                    {this.state.commentText} <span className="grey-text">on {this.state.commentDate}</span>

                </div>
                <div className="col s2">
                    <a href="#!" className="blue-text" onClick={this.handleEdit} style={{ display: this.state.changeEnabled ? null : 'none' }}>Edit</a>
                    <a href="#!" className="red-text" onClick={this.handleDelete} style={{ display: this.state.changeEnabled ? null : 'none' }}>Delete</a>
                </div>
            </div>
        )
    }
    render(): React.ReactNode {
        return this.state.editEnabled ? this.editForm() : this.viewForm()
    }
}

export default CommentStrip;