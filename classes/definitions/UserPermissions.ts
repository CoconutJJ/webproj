namespace UserPermissions {

    export const Account = {
        /**
            Login to account
        */
        login: 'account.login',

        /**
            Delete own account
        */
        delete: 'account.delete'
    }


    export const System = {

        account: {
            /**
                Delete own or another user's account without authentication
            */
            delete: 'system.account.delete'

        }

    }

    export const Posts = {

        owner: {
            create: 'posts.owner.create',
            delete: 'posts.owner.delete',
            edit: 'posts.owner.edit',
        },

        admin: {
            create: 'posts.admin.create',
            delete: 'posts.admin.delete',
            edit: 'posts.admin.edit'
        }
        
        
    }
}

export {UserPermissions}