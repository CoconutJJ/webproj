import * as bcrypt from 'bcrypt';
import { User } from '../../interfaces/interface.db'
import * as db from './class.db'


export class Login {
  private static database: db.DatabaseConnectionManager = new db.db();

  public static async login(username: string, password: string):
    Promise<boolean> {
    try {
      const rows = await this.database.query(
        'SELECT username, password FROM users WHERE username = ?',
        [username]);
      if (rows.length == 1) {
        return this._verifyPassword(password, rows[0].password);
      } else {
        return false;
      }
    } catch (err) {
      return err;
    }
  }


  /**
   * Create a new user in the database
   * Resolves True if user was created successfully
   *          False if username or email already exists
   * Rejects  Error if creation process failed unexpectedly.
   * @param userInfo User information object
   */
  public static async createUser(userInfo: User): Promise<boolean> {

    // generate the hashed password
    let hashedPassword =
      bcrypt.hashSync(userInfo.password, bcrypt.genSaltSync());

    try {

      // must check if username or email exists before we enter into database
      const chk = await this.database.query("SELECT * FROM users WHERE username = ? OR email = ?", [userInfo.username, userInfo.email]);

      // check there are zero matching records
      if (chk.length > 0) {

        return false;
      } else {

        const row = await this.database.query(
          'INSERT INTO users (firstname, lastname, username, password, email) VALUES (?, ?, ?, ?, ?)',
          [
            userInfo.firstname, userInfo.lastname, userInfo.username,
            hashedPassword, userInfo.email
          ]);
        return true;
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Initialize the session for the user with username.
   *
   * @param username User's username
   */
  public static async startSession(username: string, session: Express.Session):
    Promise<boolean> {
    let database = new db.db();

    return database.query('SELECT * FROM users WHERE username = ?', [username])
      .then(function (rows) {
        if (rows.length != 1) {
          return false;
        }

        if (session.loggedIn) {
          session.destroy(function (err) {
            session.regenerate(function (err) {

              session['user'] = <User>{
                'firstname': rows[0]['firstname'],
                'lastname': rows[0]['lastname'],
                'username': rows[0]['username'],
                'password': rows[0]['password'],
                'email': rows[0]['email']
              };
            })
          })
        } else {
          session['user'] = <User>{
            'firstname': rows[0]['firstname'],
            'lastname': rows[0]['lastname'],
            'username': rows[0]['username'],
            'password': rows[0]['password'],
            'email': rows[0]['email']
          };
        }
        session.loggedIn = true;
        return true;
      })
  }

  private static _verifyPassword(clearPassword: string, hashedPassword: string):
    boolean {
    return bcrypt.compareSync(clearPassword, hashedPassword)
  }
}