import { CurrentUser } from "./backend/class.CurrentUser";


declare global {
    namespace Express {
        interface Request {
            ContextUser: CurrentUser;
        }

    }
}