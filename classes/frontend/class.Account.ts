import HTTPRequest from './class.HTTPRequest';
import { HTTP } from '../definitions/HTTP';


class Account {

    private static MIN_USERNAME_LEN = 3;
    private static MIN_PASSWORD_LEN = 8;

    private static cache = {};



    public static isLoggedIn() {
        return Account.getSessionInfo().then(function (ret) {
            if (ret['code'] == '') {

                return true;
            } else {

                return false;
            }
        });
    }

    /**
     * 
     * @param username Login Username
     * @param password Login Password
     */
    public static login(username: string, password: string): Promise<object> {

        let req = new HTTPRequest("POST", "/qa/login");


        return req.execAsJSON({
            "uname": username,
            "pword": password,

        }, HTTP.RESPONSE.ACCEPTED);
    }

    /**
     * Create a new account.
     * @param firstname User Firstname
     * @param lastname User Lastname
     * @param username User Username
     * @param password User Password
     * @param email User Email
     */
    public static createAccount(firstname: string,
        lastname: string, username: string, password: string, email: string): Promise<object> {
        let req = new HTTPRequest("POST", "/qa/signup");
        var errors = [];

        return req.execAsJSON({
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "password": password,
            "email": email
        }, HTTP.RESPONSE.CREATED);

    }

    public static async isUserNameTaken(username: string): Promise<boolean> {

        let req = new HTTPRequest("GET", "/qa/auth/valid?username=" + encodeURIComponent(username));
        try {
            const data = await req.execVoid();

            if (data['code'] == 'OK') {
                return data['username'];
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }

    }
    

    public static getSessionInfo() {

        let req = new HTTPRequest("GET", '/qa/login/info');

        return req.execVoid(HTTP.RESPONSE.OK).then(function () {

        });

    }

}
export default Account;