/// <reference path="../classes/frontend/class.Account.ts"/>
(function (document, window) {

    function createAccount() {
        let firstname = <HTMLInputElement>document.getElementById('firstname');
        let lastname = <HTMLInputElement>document.getElementById('lastname');
        let username = <HTMLInputElement>document.getElementById('username');
        let password = <HTMLInputElement>document.getElementById('password');
        let email = <HTMLInputElement>document.getElementById('email');

        Account
            .createAccount(
                firstname.value, lastname.value, username.value, password.value,
                email.value)
            .then(function (ret) {
                if (ret['code'] == 'ACCOUNT_CREATED') {
                    window.location.replace(ret['redirect']);
                }
            }).catch(function (ret) {
                if (ret['code'] == 'ACCOUNT_EXISTS') {
                    alert("Your username or email has already been taken");
                }
            })
    }



    document.addEventListener('DOMContentLoaded', function () {

        /**
         * Form Submission: Processes form data on submission and 
         */
        let submit_btn = <HTMLInputElement>document.getElementById('submit');
        submit_btn.addEventListener('click', createAccount);

        let username_input = <HTMLInputElement>document.getElementById('username');

        // dynamically check if username has been taken with server.
        username_input.addEventListener("blur", function () {
            Account.isUserNameTaken(username_input.value).then(function (free) {
                if (!free) {
                    username_input.style.borderColor = 'red';
                    submit_btn.setAttribute("disabled", "disabled");
                } else {
                    username_input.style.borderColor = null;
                    submit_btn.removeAttribute("disabled");
                }
            });
        });

        /**
          Allow the form to be submitted on press of ENTER key
        */
        document.addEventListener('keydown', function (ev) {
            if (ev.keyCode == 13) {
                createAccount();
            }
        });
    })
})(document, window);