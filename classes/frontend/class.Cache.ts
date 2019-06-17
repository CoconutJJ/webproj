import { Store } from "express-session";

class StoreCache {

    private static cacheInstance: StoreCache = null;
    private sessionStore: Storage;
    private constructor () {
        this.sessionStore = sessionStorage;
        

    }

    public static getInstance(): StoreCache {

        if (StoreCache.cacheInstance == null) {
            return StoreCache.cacheInstance;
        } else {
            StoreCache.cacheInstance = new StoreCache();
            return StoreCache.cacheInstance;
        }
    }


    public sessionCache(name: string, item: object|Array<object>) {
        
        this.sessionStore.setItem(name, JSON.stringify(item))
        
    }

    
}