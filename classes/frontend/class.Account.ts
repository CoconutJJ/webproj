import HTTPRequest from './class.HTTPRequest';

class Account {

    private static MIN_USERNAME_LEN = 3;
    private static MIN_PASSWORD_LEN = 8;


    private static VALID_FIRSTNAME(firstname: string): boolean {
        return true;
    }

    private static VALID_LASTNAME(lastname: string): boolean {
        return true;
    }

    private static VALID_EMAIL(email: string): boolean {
        return true;
    }

    private static VALID_USERNAME(username: string): boolean {
        return username.length > Account.MIN_USERNAME_LEN;
    }

    private static VALID_PASSWORD(password: string): boolean {
        return password.length > Account.MIN_PASSWORD_LEN;
    }

    public static isLoggedIn() {
        return Account.getSessionInfo().then(function(ret) {
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

        if (!this.VALID_USERNAME(username)) {
            return Promise.reject<object>({ "code": "INVALID_USERNAME", "msg": "Username must be longer than " + Account.MIN_USERNAME_LEN + " characters" });
        }

        if (!this.VALID_PASSWORD(password)) {
            return Promise.reject<object>({ "code": "INVALID_PASSWORD", "msg": "Password must be longer than " + Account.MIN_PASSWORD_LEN + " characters" })
        }

        return req.execAsJSON({
            "uname": username,
            "pword": password,

        }, HTTPRequest.RESPONSE.ACCEPTED);
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

        if (!this.VALID_USERNAME(username)) {
            return Promise.reject<object>({ "code": "INVALID_USERNAME", "msg": "Username must be longer than " + Account.MIN_USERNAME_LEN + " characters" });
        } else if (!this.VALID_PASSWORD(password)) {
            Promise.reject<object>({ "code": "INVALID_PASSWORD", "msg": "Password must be longer than " + Account.MIN_PASSWORD_LEN + " characters" })
        } else if (!this.VALID_FIRSTNAME(firstname)) {

        } else if (!this.VALID_LASTNAME(lastname)) {


        } else if (!this.VALID_EMAIL(email)) {

        } else {
            return req.execAsJSON({
                "firstname": firstname,
                "lastname": lastname,
                "username": username,
                "password": password,
                "email": email
            }, HTTPRequest.RESPONSE.CREATED);
        }
    }

    public static async isUserNameTaken(username: string): Promise<boolean> {

        if (!this.VALID_USERNAME(username)) {
            return false;
        }

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

        return req.execVoid(HTTPRequest.RESPONSE.OK);

    }

}
export default Account;