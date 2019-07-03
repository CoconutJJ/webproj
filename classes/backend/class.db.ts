import { MysqlError, PoolConnection, createPool, Pool, Query} from 'mysql';
import { DatabaseMetaInfo, QueryData } from '../../interfaces/interface.db';

export interface DatabaseConnectionManager {
  query(sql: string, values: string[]): Promise<any>;
}

export class db implements DatabaseConnectionManager {

  /**
   * @static
   * @var {Pool} sql
   */
  static sql: Pool;


  constructor() {

    if (!db.sql) {
      db.sql = createPool({
        host: 'localhost',
        port: 3306,
        database: 'site',
        user: 'root',
        password: ''
      });
    }
  }


  /**
   * Query the database
   * @param sql SQL Prepared Query String
   * @param values Query Values
   * @returns {Promise<any>}
   */
  public query<T = object>(sql: string, values: any[]): Promise<Array<T>> {
    return new Promise(function (resolve, reject) {
      // attempt to get a connection
      db.sql.getConnection(function (
        err: MysqlError, conn: PoolConnection) {

        // check if there is an error
        if (err) {
          reject(err);
        } else {
          // query the database
          conn.query(sql, values, function(err: MysqlError, rows, fields) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        }

        // release the connection
        conn.release();
      });
    });
  }

  public async exists(sql: string, values: any[]): Promise<void> {

    const rows = await this.query(sql, values);
    return rows.length > 0 ? Promise.resolve() : Promise.reject();

  }

  /**
   * Get a list of column names
   * @param tableName Name of table
   * @returns {Promise<string[]>}
   */
  public async getColumns(tableName: string): Promise<string[]> {
    let rows = await this.query("SHOW COLUMNS FROM ?", [tableName]);

    var columns: string[] = [];
    for (var i = 0; i < rows.length; i++) {
      columns.push((<DatabaseMetaInfo>rows[i]).Field);
    }
    return columns;
  }


}