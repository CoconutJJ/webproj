import { db } from "./class.db";
import { PostsModel } from "../../interfaces/interface.db";

class Posts {

    private params: PostsModel

    private constructor(params: PostsModel) {
        this.params = params;
    }

    /**
     * Find the post with id `id`
     * @param id 
     * @throws {Error} If Post with `id` cannot be found
     */
    public static findById(id: number) {
        let dbh = new db();
        let sqlq = "SELECT * FROM posts WHERE id = ?";
        dbh.exists(sqlq, [id]).then(function () {

            return dbh.query(sqlq, [id]).then(function (rows: Array<PostsModel>) {


                return new Posts(<PostsModel>rows[0])
            })

        }).catch(function () {
            throw new Error("findById: Post with id " + id + " does not exist!");
        })
    }

    /**
     * 
     * @param params Post parameters
     */
    public static create(params: Pick<PostsModel, Exclude<keyof PostsModel, 'id'>>) {
        
        let dbh = new db();
        
        let cols = [];
        let vals = [];
        let placeholders = [];

        for (let k in params) {
            cols.push("`" + k + "`");
            vals.push(params[k]);
            placeholders.push("?");
        }

        return dbh.query("INSERT INTO Posts (" + cols.join(",") + ") VALUES (" + placeholders.join(",") + ")", vals).then(function () {
            
        })

    }




}