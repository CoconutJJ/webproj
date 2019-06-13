// import { db } from "./class.db";
import { PostsModel } from "../../interfaces/interface.db";
import { Controller } from "./class.Controller";


export class Posts extends Controller<PostsModel>{

    private static TABLE_NAME: string = "posts";
    
    protected constructor(params: PostsModel) {
        super("posts", "id");
        
        this.params = params;
    }

    public static async allPosts(filter?: (Partial<PostsModel>)[]): Promise<Posts[]> {
        return Controller.all(Posts.TABLE_NAME, filter).then(function (post_data) {
            var posts = [];

            for (let i = 0; i < post_data.length; i++) {
                posts.push(new Posts(post_data[i]));
            }
            return posts;
        });
    }

    public static async getColumns(columnNames: (keyof PostsModel)[], filter?: (Partial<PostsModel>)[]): Promise<Posts[]> {
        return Controller.columns(Posts.TABLE_NAME, columnNames, filter).then(function (post_data) {
            var posts = [];

            for (let i = 0; i < post_data.length; i++) {
                posts.push(new Posts(post_data[i]));
            }
            return posts;
        })
    }
    
    public static async createPost(params: Pick<PostsModel, Exclude<keyof PostsModel, 'id'>>) {
        return Controller.create<PostsModel>(Posts.TABLE_NAME, params);
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