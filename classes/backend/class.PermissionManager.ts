import { db } from './class.db'
class PermissionManager {

    constructor() {
    }

    public static async getPermissions(user_id: number): Promise<string[]> {

        let dbh = new db();

        const rows = await dbh.query('SELECT permissions.permission_name FROM user_permissions LEFT JOIN permissions ON user_permissions.permission_id = permissions.id AND user_permissions.user_id = ?', [user_id]);
        let permission_tokens = [];
        rows.forEach(element => {
            permission_tokens.push(element['permission_name']);
        });
        return permission_tokens;
    }


    public static async hasPermission(user_id: number, permissionToken: string) {

        let permissions = await PermissionManager.getPermissions(user_id);

        return permissions.indexOf(permissionToken) !== -1 || permissions.indexOf('root') !== -1; 
        
    }
}

export default PermissionManager;