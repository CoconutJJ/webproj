import * as Account from "./class.Account"
export class AccountBuilder {

    private userProps;

    constructor () {
        
    }

    /**
     * firstName
     */
    public firstName(firstName: string): AccountBuilder {
        this.setProperty('FIRSTNAME', firstName);
        return this;
    }

    /**
     * lastName
     * 
     * Set the lastName of the Account
     * 
     * @param lastName 
     */
    public lastName(lastName: string): AccountBuilder {
        this.setProperty('LASTNAME', lastName);
        return this;
    }

    /**
     * userName
     * 
     * Set the userName of the Account
     * 
     * @param userName 
     */
    public userName(userName: string): AccountBuilder {
        this.setProperty('USERNAME', userName);
        return this;
    }
    /**
     * password
     * 
     * Set the password of the Account
     * 
     * @param password 
     */
    public password(password: string): AccountBuilder {
        this.setProperty('PASSWORD', password);
        return this;
    }

    /**
     * email
     * 
     * Set the email of the Account
     * 
     * @param email 
     */
    public email(email: string): AccountBuilder {
        this.setProperty('EMAIL', email);
        return this;
    }

    /**
     * setProperty
     * 
     * Set an Account property to value
     * 
     * @param property 
     * @param value 
     */
    private setProperty(property: string, value: string|number) {
        this.userProps[property] = value;
    }

    /**
     * create
     * 
     * Create the account
     * 
     */
    public create(): Account.Account {
        return new Account.Account(this.userProps);
    }

}