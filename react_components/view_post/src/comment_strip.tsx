import * as React from 'react';

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
}


class CommentStrip extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            ...this.props,
            changeEnabled: false,
            deleted: false,
            editComment: this.props.commentText,
            editEnabled: false
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
                    <a href="#!" className="green-text" onClick={this.handleUpdateComment}>Submit</a>
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