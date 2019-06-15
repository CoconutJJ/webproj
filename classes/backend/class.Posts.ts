// import { db } from "./class.db";
import { PostsModel } from "../../interfaces/interface.db";
import { Controller } from "./class.Controller";


export class Posts extends Controller<PostsModel>{

    private static TABLE_NAME: string = "posts";

    protected constructor(params: PostsModel) {
        super("posts", "id");

        this.params = params;
    }
    /**
     * Returns all Posts which match the filter. If no filter is provided,
     * it will return every single Post that exists
     * @param filter filter posts by conditions.
     * 
     * filter rules:
     * 
     * [{A:K},{B:H}]: A = K OR B = H
     * 
     * [{A:K,B:H}] A = K AND B = H
     */
    public static async allPosts(filter?: (Partial<PostsModel>)[]): Promise<Posts[]> {
        return Controller.all(Posts.TABLE_NAME, filter).then(function (post_data) {
            var posts = [];

            for (let i = 0; i < post_data.length; i++) {
                posts.push(new Posts(post_data[i]));
            }
            return posts;
        });
    }

    /**
     * Get the respective columnNames with respect to the filter
     * @param columnNames all columns to fetch
     * @param filter filter rows by conditions
     */
    public static async getColumns(columnNames: (keyof PostsModel)[], filter?: (Partial<PostsModel>)[]): Promise<Posts[]> {
        return Controller.columns(Posts.TABLE_NAME, columnNames, filter).then(function (post_data) {
            var posts = [];

            for (let i = 0; i < post_data.length; i++) {
                posts.push(new Posts(post_data[i]));
            }
            return posts;
        })
    }

    /**
     * Create a new post
     * @param params post data
     */
    public static async createPost(params: Pick<PostsModel, Exclude<keyof PostsModel, 'id' | 'updated_at' | 'created_at'>>) {
        let timestamp = Math.floor(Date.now()/1000)
        return Controller.create<PostsModel>(Posts.TABLE_NAME, { 
            ...params, 
            created_at: timestamp, 
            updated_at: timestamp 
        });
    }
    
    public updatePost(params: Partial<Pick<PostsModel, Exclude<keyof PostsModel, 'id' | 'updated_at' | 'created_at'>>>) {
        for (let k in params) {
            this.set(<keyof PostsModel>k, params[k]);
        }

        this.set('updated_at', Math.floor(Date.now() / 1000));
        return this.update()
    }

    public query(sql: string, values: any[]) {
        return this.db.query(sql, values);
    }

    public toJSON(): string {
        return JSON.stringify(this.params);
    }
    public getModel(): PostsModel {
        return this.params;
    }

}