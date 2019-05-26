/// <reference path="../classes/frontend/class.Account.ts"/>
(function(document, window) {


function login() {
  let username_input: HTMLInputElement =
      <HTMLInputElement>document.getElementById('username');
  let password_input: HTMLInputElement =
      <HTMLInputElement>document.getElementById('password');

  Account.login(username_input.value, password_input.value)
      .then(function(ret) {
        switch (ret['code']) {
          case 'LOGIN_SUCCESS':
            window.location.replace(ret['redirect']);
            break;
        }
      })
      .catch(function(ret) {
        switch (ret['code']) {
          case 'LOGIN_FAILED':
            alert(ret['msg']);
            break;
          case 'LOGIN_INTERNAL_ERROR':
            alert(ret['msg']);
            break;
          case 'INVALID_USERNAME':
            alert(ret['msg']);
            break;
          case 'INVALID_PASSWORD':
            alert(ret['msg']);
            break;
        }
      });
}

document.addEventListener('DOMContentLoaded', function() {
  let login_btn = document.getElementById('submit-btn');


  login_btn.addEventListener('click', login);

  document.addEventListener("keydown", function(ev) {
    if (ev.key == "Enter") {
      login();
    }
  })
})
})(document, window);