import { db } from "./class.db";
import { PostsModel } from "../../interfaces/interface.db";
import { Controller } from "./class.Controller";


export class Posts extends Controller<PostsModel>{

    private static TABLE_NAME: string;
    
    protected constructor(params: PostsModel) {
        super("posts", "id");
        Posts.TABLE_NAME = "posts";
        this.params = params;
    }

    public static async allPosts(filter?: (Partial<PostsModel>)[]): Promise<Posts[]> {
        return Controller.all(Posts.TABLE_NAME, filter).then(function (post_data) {
            var posts = [];

            for (let i = 0; i < post_data.length; i++) {
                posts.push(new Posts(post_data[i]))
            }
            return posts;
        });
    }

    public static async createPost(params: Pick<PostsModel, Exclude<keyof PostsModel, 'id'>>) {
        return Controller.create<PostsModel>(Posts.TABLE_NAME, params);
    }

    public toJSON(): string {
        
        return JSON.stringify(this.params);

    }

}