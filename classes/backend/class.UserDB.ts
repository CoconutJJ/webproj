import * as db from './class.db';
import * as acc from '../qa/class.Account';
import * as accbuilder from '../qa/class.AccountBuilder';
class UserDB {

    private dbh: db.db;

    constructor() {
        this.dbh = new db.db();
    }

    private async getUserAccountByProperty(property: string, value: string) {
        try {
            let rows = await this.dbh
                .query('SELECT * FROM users WHERE ' + property + ' = ?', [value]);
            if (rows.length == 1) {
                rows = rows[0];
                var accountBuilder = new accbuilder.AccountBuilder();
                var account: acc.Account = accountBuilder.firstName(rows['firstname'])
                    .lastName(rows['lastname'])
                    .userName(rows['username'])
                    .password(rows['password'])
                    .email(rows['email'])
                    .create();
                return account;
            }
            else {
                throw new Error('UserDB: getUserAccountByProperty: no such user with ' + property + ': ' + value);
            }
        }
        catch (err) {
            throw new Error('UserDB: getUserAccountByProperty: ' + err);
        }
    }

    public getUserAccountById(id: string): Promise<acc.Account> {
        return this.getUserAccountByProperty('id', id);
    }

    public getUserAccountByUsername(username: string): Promise<acc.Account> {
        return this.getUserAccountByProperty('username', username);
    }
}