export class CurrentUser {

    private sess: Express.Session;

    constructor (session: Express.Session) {
        this.sess = session;
    }

    public get id() {
        return this.sess['user']['id'];
    }

    public get firstName() {
        return this.sess['user']['firstname'];
    }

    public get lastName() {
        return this.sess['user']['lastname'];
    }

    public get userName() {
        return this.sess['user']['username'];
    }

    public get password() {
        return this.sess['user']['password'];
    }

    public get email() {
        return this.sess['user']['email'];
    }

    public isLoggedIn() {
        return typeof this.sess['loggedIn'] !== "undefined" && this.sess['loggedIn'] !== false;
    }

    


}