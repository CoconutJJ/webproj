import * as React from "react";
import Account from "../../../classes/frontend/class.Account";
import * as M from 'materialize-css'
class App extends React.Component {
    state = {
        username: "",
        password: "",
        LoginBtnDisabled: true,
        progressBar: false
    }

    componentDidMount = () => {
        document.addEventListener("keydown", function (ev) {
            if (ev.key == "Enter") {
                if (!this.state.LoginBtnDisabled) {
                    this.handleSubmit();
                }
            }
        }.bind(this))
    }

    handleInputChange = (e) => {


        this.setState({
            [e.target.id]: e.target.value
        })

        if (this.state.username.length > 3 && this.state.password.length >= 8) {
            this.enableLoginBtn();
        } else {
            this.disableLoginBtn();
        }

    }

    enableLoginBtn = () => {
        this.setState({
            LoginBtnDisabled: false
        })
    }

    disableLoginBtn = () => {
        this.setState({
            LoginBtnDisabled: true
        })
    }

    enableProgressBar = () => {
        this.setState({
            progressBar: true
        })
    }

    disableProgressBar = () => {
        this.setState({
            progressBar: false
        })
    }

    handleSubmit = () => {
        this.enableProgressBar();
        Account.login(this.state.username, this.state.password)
            .then((ret) => {
                switch (ret['code']) {
                    case 'LOGIN_SUCCESS':
                        this.disableProgressBar();
                        M.toast({html: "Logging in...", classes: "green"})
                        window.location.replace(ret['redirect']);
                        break;
                }
            })
            .catch((ret) => {
                this.disableProgressBar();
                this.disableLoginBtn();
                M.toast({ html: ret['msg'], classes: 'red' })
            });
    }

    render(): React.ReactNode {

        return (
            <form className="form">
                <input type="text" className="form-control" id="username" placeholder="Username" value={this.state.username} onChange={this.handleInputChange} />
                <input type="password" className="form-control" id="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} /><br />
                <button id="submit-btn" type="button" className="btn waves-effect blue" onClick={this.handleSubmit} disabled={this.state.LoginBtnDisabled}><i className="material-icons left">account_circle</i>Login</button>
                <div className="progress" style={{ display: this.state.progressBar ? null : 'none' }}>
                    <div className="indeterminate"></div>
                </div>
            </form>
        )
    }

}

export default App;