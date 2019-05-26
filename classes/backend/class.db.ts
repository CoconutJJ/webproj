import * as mysql from 'mysql';
import * as interf from '../../interfaces/interface.db';

export interface DatabaseConnectionManager {
  query(sql: string, values: string[]): Promise<any>;
}





export class db implements DatabaseConnectionManager {
  
  /**
   * @static
   * @var {mysql.Pool} sql
   */
  static sql: mysql.Pool;


  constructor() {
    if (!db.sql) {
      db.sql = mysql.createPool({
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
  public query(sql: string, values: any[]): Promise<any> {
    return new Promise(function(resolve, reject) {
      // attempt to get a connection
      db.sql.getConnection(function(
          err: mysql.MysqlError, conn: mysql.PoolConnection) {
        
        // check if there is an error
        if (err) {
          reject(err);
        } else {
          // query the database
          conn.query(sql, values, function(err: mysql.MysqlError, rows) {
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
  

  /**
   * Get a list of column names
   * @param tableName Name of table
   * @returns {Promise<string[]>}
   */
  public getColumns(tableName: string): Promise<string[]> {
    return this.query("SHOW COLUMNS FROM ?", [tableName]).then(function(rows: Array<interf.DatabaseMetaInfo>) {
      var columns: string[] = [];

      for (var i = 0; i < rows.length; i++) {
        columns.push(rows[i].Field);
      }

      return columns;
    });
  }

  
}