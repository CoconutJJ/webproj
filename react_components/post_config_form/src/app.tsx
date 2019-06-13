import * as React from "react";
import * as tinymce from 'tinymce';
import 'tinymce/themes/silver';
import * as M from 'materialize-css';
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import { response } from "express";
import { HTTP } from "../../../classes/class.definitions";

class App extends React.Component {
    state = {
        customPostDateEnabled: false,
        showAuthor: true,
        showDate: true,
        title: "",
        customPostDate: ""

    }

    componentDidMount = () => {
        M.AutoInit();
        // run the tinymce editor
        tinymce.init({
            selector: "#post_editor",
            skin_url: '/lib/tinymce/skins/ui/oxide',
    
        })
    }

    handleSubmit = (e) => {
        var req = new HTTPRequest("POST", "/qa/posts");

        // bundle up the entire state of the view and body content and send it
        // off. server will filter out the useful info.
        req.execAsJSON({
            ...this.state, 
            body: tinymce.get('post_editor').getContent()
        }, HTTP.RESPONSE.ACCEPTED).then(function (ret) {
            // redirect if requested by server.
            if (typeof ret['redirect'] !== 'undefined' && ret['redirect'].length > 0) {
                window.location.replace(ret['redirect']);   
            } else {
                M.toast({html: ret['msg']});
            }

        })

    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    handleCheckBoxChange = (e) => {
        this.setState({
            [e.target.name]: !this.state[e.target.name]
        })
    }


    customDateToggle = () => {
        this.setState({
            customPostDateEnabled: !this.state.customPostDateEnabled
        })
    }

    render(): React.ReactNode {

        return (
            <div>
                <div>
                    <h1>Create Post</h1>
                    <input type="text" placeholder="Title" name="title" style={{width: "75%", fontSize: "18pt"}} onChange={this.handleInputChange} value={this.state.title} />
                    <br /><br />
                    <textarea id="post_editor"></textarea><br />


                    <button type="button" className="btn waves-effect green" onClick={this.handleSubmit}><i className="material-icons left">arrow_forward</i>Submit</button>
                    <br /><br />
                </div>
                <div className="row">
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">Submission Settings</span>

                                <div className="row">
                                    <div className="col s6">
                                        <label>
                                            <input type="checkbox" name="showAuthor" className="filled-in" checked={this.state.showAuthor}  onChange={this.handleCheckBoxChange}/>
                                            <span>Show Author Name</span>
                                        </label>

                                    </div>
                                    <div className="col s6">
                                        <label>
                                            <input type="checkbox" name="showDate" className="filled-in" checked={this.state.showDate} onChange={this.handleCheckBoxChange}/>
                                            <span>Show Date</span>
                                        </label>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col s6">
                                        <label>
                                            <input type="checkbox" className="filled-in" onClick={this.customDateToggle} />
                                            <span>Custom Post Date</span>
                                        </label>
                                        <input type="text" className="datepicker" name="customPostDate" placeholder="New Date" value={this.state.customPostDate} onChange={this.handleInputChange} disabled={!this.state.customPostDateEnabled} />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}

export default App;