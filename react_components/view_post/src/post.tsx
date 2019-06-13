import * as React from 'react';
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import { HTTP } from '../../../classes/class.definitions';
import * as tinymce from 'tinymce';
import 'tinymce/themes/silver';
import * as M from 'materialize-css';

interface IState {
    id: number,
    title: string,
    body: string,
    author: string,
    date: string,
    showDate: boolean
    editEnabled: boolean
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
            edit: {
                title: "",
            }
        }

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
            selector: "#edit_body",
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
                    M.toast({ html: "We have trouble deleting your post. Try again later", classes: "red" });
                    console.error(err.message);
                }.bind(this))
        }
    }

    handleEdit = () => {
        if (this.state.editEnabled) {

            this.disableEdit();
        } else {
            this.enableEdit();
            tinymce.get('edit_body').setContent(this.state.body);
        }


    }

    handleEditSave = () => {
        var req = new HTTPRequest("PATCH", "/qa/posts/" + this.state.id);
        var body_content = tinymce.get('edit_body').getContent();
        req.execAsJSON({
            title: this.state.edit.title,
            body: body_content
        }).then(function (ret) {
            this.setState({
                title: this.state.edit.title,
                body: body_content
            });
            this.disableEdit();
            M.toast({
                html: ret['msg'],
                classes: 'green'
            })
        })
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
        })
    }

    disableEdit = () => {
        this.setState({
            editEnabled: false
        })
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
                    <textarea id="edit_body"></textarea>
                </div>
            </div>
        )
    }

    actions = () => {
        if (this.state.editEnabled) {
            return (
                <div className="row">
                    <a className="btn-small green waves-effect" onClick={this.handleEditSave}><i className="material-icons left">save</i> Save</a>
                    <a className="btn-small orange waves-effect" onClick={this.handleEdit}><i className="material-icons left">cancel</i> Cancel</a>
                    <a className="btn-small red waves-effect" onClick={this.handleDelete}><i className="material-icons left">delete</i> Delete</a>
                </div>
            )
        } else {
            return (
                <div className="row">
                    <a className="btn-small orange waves-effect" onClick={this.handleEdit}><i className="material-icons left">edit</i> Edit</a>
                </div>
            )
        }
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