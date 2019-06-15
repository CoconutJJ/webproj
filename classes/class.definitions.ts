import { CurrentUser } from "./backend/class.CurrentUser";

const HTTP = {

    RESPONSE: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        FOUND: 302,
        UNAUTHORIZED: 401,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503
    }
}

type HTTP_METHOD = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

namespace Permissions {

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

declare global {
    namespace Express {
        interface Request {
            ContextUser: CurrentUser;
        }

    }
}

export { HTTP, HTTP_METHOD, Permissions, Express };