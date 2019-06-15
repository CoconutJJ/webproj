export class CurrentUser {

    private sess: Express.Session;

    constructor(session: Express.Session) {
        this.sess = session;
    }

    public id() {
        return this.sess['user']['id'];
    }

    public firstName() {
        return this.sess['user']['firstname'];
    }

    public lastName() {
        return this.sess['user']['lastname'];
    }

    public userName() {
        return this.sess['user']['username'];
    }

    public password() {
        return this.sess['user']['password'];
    }

    public email() {
        return this.sess['user']['email'];
    }

    public isLoggedIn() {
        return typeof this.sess['loggedIn'] !== "undefined" && this.sess['loggedIn'] !== false;
    }

    public logout() {
        return new Promise(function (resolve, reject) {
            this.sess.destroy(function (err) {
                if (err) { reject(err); }

                resolve();
            })
        }.bind(this))

    }

    public hasPermissionToken(permissionToken: string) {
        return this.sess['user']['permissions'].indexOf(permissionToken) !== -1;
    }

    public hasPermission(permissionToken: string) {
        return this.hasPermissionToken(permissionToken) || this.sess['user']['permissions'].indexOf('root') !== -1
    }

    public executeWithPermission(permissionTokens: string[], handler: () => void) {
        let add_tokens = [];
        permissionTokens.forEach(token => {
            if (!this.hasPermissionToken(token)) {
                this.sess['user']['permissions'].push(token);
                add_tokens.push(token);
            }
        });
        handler();
        this.sess['user']['permissions'] = this.sess['user']['permissions'].filter((token: any) => {
            return add_tokens.indexOf(token) !== -1;
        });
    }


}