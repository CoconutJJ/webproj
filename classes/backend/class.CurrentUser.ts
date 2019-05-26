export class CurrentUser {

    private sess: Express.Session;

    constructor (session: Express.Session) {
        this.sess = session;
    }


    public getFirstName() {
        return this.sess['firstname'];
    }

    public getLastName() {
        return this.sess['lastname'];
    }

    public getUserName() {
        return this.sess['username'];
    }

    public getPassword() {
        return this.sess['password'];
    }

    public getEmail() {
        return this.sess['email'];
    }

    public isLoggedIn() {
        return typeof this.sess['loggedIn'] !== "undefined" && this.sess['loggedIn'] !== false;
    }

    


}