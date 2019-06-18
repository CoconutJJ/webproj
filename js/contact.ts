import HTTPRequest from '../classes/frontend/class.HTTPRequest';
import DataSanityCheck from '../classes/frontend/class.DataSanityCheck';
import { HTTP } from '../classes/definitions/HTTP';

document.addEventListener('DOMContentLoaded', function () {
  let send_btn: HTMLInputElement =
    <HTMLInputElement>document.querySelector('#send');

  send_btn.addEventListener('click', function () {
    let firstname: HTMLInputElement =
      <HTMLInputElement>document.getElementById('first-name');
    let lastname: HTMLInputElement =
      <HTMLInputElement>document.getElementById('last-name');
    let email: HTMLInputElement =
      <HTMLInputElement>document.getElementById('email');
    let body: HTMLInputElement =
      <HTMLInputElement>document.getElementById('body');


    var http = new HTTPRequest('POST', '/form/contact');



    if (!DataSanityCheck.containsHTMLTags(
      firstname.value, lastname.value, email.value, body.value)) {
      alert('Please remove \'<\' and \'>\' from your message!');
    } else if (!DataSanityCheck.isEmpty(
      firstname.value, lastname.value, email.value, body.value)) {
      alert('All fields must be filled in.');
    } else {
      // send the request off
      http.execAsJSON(
        {

          'fname': firstname.value,
          'lname': lastname.value,
          'email': email.value,
          'body': body.value

        },
        HTTP.RESPONSE.CREATED)
        .then(function (data) {
          // check if message was sent successfully
          if (data['success']) {
            firstname.value = lastname.value = email.value = body.value =
              null;

            // create a success message to display after the send button
            let success_box = document.createElement('div')
            success_box.style.backgroundColor = 'green';
            success_box.style.padding = '10px';
            success_box.style.color = 'white';
            success_box.innerText =
              'Your message has been sent! You will recieve a reply at: ' +
              email.value;
            send_btn.after(success_box);

            // allow message to be removed.
            success_box.addEventListener('click', function () {
              this.parentNode.removeChild(this);
            })
          }
        })
        .catch(function (status) {
          let error_box = document.createElement('div');
          error_box.style.backgroundColor = 'red';
          error_box.style.padding = '10px';
          error_box.style.color = 'white';
          error_box.innerText = 'Error. '
          console.error('error: POST /contact results in status: ' + status);
        });

    }
  });
});

