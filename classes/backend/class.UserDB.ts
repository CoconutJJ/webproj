import { db } from './class.db';
import { Account } from '../qa/class.Account';
import { AccountBuilder } from '../qa/class.AccountBuilder';
class UserDB {

    private dbh: db;

    constructor() {
        this.dbh = new db();
    }

    private async getUserAccountByProperty(property: string, value: string) {
        try {
            let rows = await this.dbh
                .query('SELECT * FROM users WHERE ' + property + ' = ?', [value]);
            if (rows.length == 1) {
                let currRow: {} = rows[0];
                var accountBuilder = new AccountBuilder();
                var account: Account = accountBuilder.firstName(rows['firstname'])
                    .lastName(currRow['lastname'])
                    .userName(currRow['username'])
                    .password(currRow['password'])
                    .email(currRow['email'])
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

    public getUserAccountById(id: string): Promise<Account> {
        return this.getUserAccountByProperty('id', id);
    }

    public getUserAccountByUsername(username: string): Promise<Account> {
        return this.getUserAccountByProperty('username', username);
    }
}