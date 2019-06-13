import { db } from "./class.db";

export abstract class Controller<T> {
    
    private tableName: string;
    private primaryKey: keyof T;
    protected params: T;
    protected db: db;

    protected constructor(tableName: string, primaryKey: keyof T) {
        this.tableName = tableName;
        this.primaryKey = primaryKey;
        this.db = new db();
    }


    public get(param: keyof T) {
        return this.params[param];
    }

    

    public set(param: keyof T, value: T[keyof T]) {
        
        if (param == this.primaryKey) {
            throw new Error("error: Updating the primary key of the Model is not allowed!")
        }

        this.params[param] = value;

    }
    /**
     * Process the filter
     * @param filter T
     */
    private static proccessFilter<T>(filter: (Partial<T>)[]): { clause: string, values: (string | number)[] } {
        if (filter.length > 0) {
            let assignments, filter_clauses = [], values = [];

            for (let i = 0; i < filter.length; i++) {
                assignments = this.getConjunctiveSQLAssignment<T>(filter[i])
                filter_clauses.push('(' + assignments.clause + ')')
                values.push(...assignments.values)
            }

            return {
                clause: filter_clauses.join(' OR '),
                values: values
            }
        } else {
            return null;
        }
    }

    private static getConjunctiveSQLAssignment<T>(filter: Partial<T>): { clause: string, values: (string | number)[] } {
        let filter_clauses = [];
        let values = [];
        for (let key in filter) {
            filter_clauses.push("`" + key + "` = ?");
            values.push(filter[key]);
        }
        return {
            clause: filter_clauses.join(' AND '),
            values: values
        }
    }

    

    protected static all<T>(tableName: string, filter?: Partial<T>[]): Promise<T[]> {

        let values = [];
        let dbh = new db();

        let sqlq = "SELECT * FROM " + tableName;

        if (filter !== undefined) {
            let processed_stmt = Controller.proccessFilter(filter)
            values = processed_stmt.values;
            sqlq += " WHERE " + processed_stmt.clause;
        }
        
        return dbh.query<T>(sqlq, values);

    }

    protected static columns<T>(tableName: string, columnNames:(keyof T)[], filter?: Partial<T>[]): Promise<T[]> {
        let values = [];
        let dbh = new db();
        let esc_cols = columnNames.map(function (entry) {
            return "`" + entry + "`";
        })
        let sqlq = "SELECT " + esc_cols.join(',') + " FROM " + tableName;

        if (filter !== undefined) {
            let processed_stmt = Controller.proccessFilter(filter)
            values = processed_stmt.values;
            sqlq += " WHERE " + processed_stmt.clause;
        }
        
        return dbh.query<T>(sqlq, values);
    }

    public static async create<T>(tableName: string, params: Partial<T>) {

        let dbh = new db();

        let cols = [];
        let vals = [];
        let placeholders = [];

        for (let k in params) {
            cols.push("`" + k + "`");
            vals.push(params[k]);
            placeholders.push("?");
        }
        console.log(cols, vals);
        return dbh.query("INSERT INTO " + tableName + " (" + cols.join(",") + ") VALUES (" + placeholders.join(",") + ")", vals);

    }
    public update(): Promise<object[]> {
        let dbh = new db();

        let cols = [];
        let vals = [];

        for (let k in this.params) {
            if (k == this.primaryKey) continue;

            cols.push("`" + k + "` = ?");
            vals.push(this.params[k]);
        }

        return dbh.query("UPDATE" + this.tableName + " SET " + cols.join(',') + " WHERE `" + this.primaryKey + "` = ?", [...vals, this.params[this.primaryKey]])
    }
    public delete() {
        let dbh = new db();

        return dbh.query("DELETE FROM " + this.tableName + " WHERE " + this.primaryKey + " = ?", [this.params[this.primaryKey]])
    }

    public abstract getModel(): T;

    public abstract toJSON(): string;

}