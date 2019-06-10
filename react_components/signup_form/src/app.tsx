import * as React from "react";
import * as M from 'materialize-css';
import Account from "../../../classes/frontend/class.Account";
class App extends React.Component {
    state = {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        email: "",

        CreateAccountButtonDisabled: true,
        UsernameInputClassList: [],
    }

    enableCreateButton = () => {
        this.setState({
            CreateAccountButtonDisabled: false
        })
    }

    disableCreateButton = () => {
        this.setState({
            CreateAccountButtonDisabled: true
        })
    }

    markUsernameInvalid = () => {

    }

    createAccount = () => {

        
        Account
            .createAccount(
                this.state.firstname, this.state.lastname, this.state.username, this.state.password,
                this.state.email)
            .then(function (ret) {
                if (ret['code'] == 'ACCOUNT_CREATED') {
                    window.location.replace(ret['redirect']);
                }
            }).catch(function (ret) {
                if (ret['code'] == 'ACCOUNT_EXISTS') {
                    M.toast({html:"Your username or email has already been taken"});
                } else {
                    M.toast({html: ret['msg'], classes: 'red'});
                }
            })
    }
    
    handleSubmit = () => {
        Account.isUserNameTaken(this.state.username).then(function (free) {
            if (!free) {
                M.toast({html: "Username already taken"})
                this.disableCreateButton();
            } else {
                this.createAccount();
            }
        }.bind(this))
    }

    handleInputBlur = (e: any) => {
        var errors = [];
        var fields = ["firstname", "lastname", "username", "password", "email"];
        var hasBlankField = false;
        var userNameTaken = false;
        for (var i = 0; i < fields.length; i++) {
            if (this.state[fields[i]].length == 0) {
                hasBlankField = true;
                break;
            }
        }

        if (this.state.username.length != 0 && this.state.username.length < 3) {
            errors.push("Username must be at least 3 characters in length");
        }

        if (this.state.password.length < 8 && this.state.password.length != 0) {
            errors.push("Password must be at least 8 characters in length");
        }

        if ((this.state.email.length < 3 || this.state.email.indexOf('@') == -1) && this.state.email.length != 0) {
            errors.push("Email is not valid")
        }

        if (errors.length != 0) {
            this.disableCreateButton();
            for (var i = 0; i < errors.length; i++) {
                M.toast({ html: errors[i] })
            }
        } else {
            if (hasBlankField) {
                this.disableCreateButton();
            } else {

                
                this.enableCreateButton();
            }
        }

    }

    handleInputChange = (e: { target: { id: any; value: any; }; }) => {

        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render(): React.ReactNode {

        return (
            <div className="row">
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s4">
                            <input type="text" id="firstname" placeholder="First Name" value={this.state.firstname} onChange={this.handleInputChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="input-field col s4">
                            <input type="text" id="lastname" value={this.state.lastname} placeholder="Last Name" onChange={this.handleInputChange} onBlur={this.handleInputBlur}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s4">
                            <input type="text" id="username" className={this.state.UsernameInputClassList.join(' ')} value={this.state.username} placeholder="Username" onChange={this.handleInputChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="input-field col s4">
                            <input type="password" id="password" className="" value={this.state.password} placeholder="Password" onChange={this.handleInputChange} onBlur={this.handleInputBlur} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s8">
                            <input type="email" id="email" className="" value={this.state.email} placeholder="Email" onChange={this.handleInputChange} onBlur={this.handleInputBlur} />
                            <span className="helper-text">Email will be verified</span>
                        </div>
                    </div>
                    <button type="button" className="btn waves-effect blue" id="submit" disabled={this.state.CreateAccountButtonDisabled} onClick={this.handleSubmit}>Create Account</button>
                </form>
                <p>
                    Already have an account? <a href="/qa/login">Login.</a>
                </p>
            </div>
        )

    }

}

export default App;