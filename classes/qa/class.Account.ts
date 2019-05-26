import * as db from "../class.db";

export class Account {

    private userProps;

    /**
     * Create
     * @param userProps
     */
    constructor (userProps) {
        this.userProps = userProps;
    }

    public getFirstName(firstName: string) {
        return this.getUserProperty('FIRSTNAME')
    }

    public getUserProperty(propertyName: string) {
        return this.userProps[propertyName];
    }

    public getLastName(lastname: string) {
        return this.getUserProperty("LASTNAME");
    }

}