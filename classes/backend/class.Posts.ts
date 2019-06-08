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
    public static async findById(id: number): Promise<Posts> {
        let dbh = new db();
        let sqlq = "SELECT * FROM posts WHERE id = ?";
        try {
            await dbh.exists(sqlq, [id]);
            const rows = await dbh.query(sqlq, [id]);
            return new Posts((<PostsModel>rows[0]));
        }
        catch (e) {
            throw new Error("findById: Post with id " + id + " does not exist!");
        }
    }

    public get(param: string) {
        return this.params[param];
    }

    public set(param: string, value: string | number) {
        this.params[param] = value;
    }

    public update() {
        let dbh = new db();

        let cols = [];
        let vals = [];

        for (let k in this.params) {
            // do not update the id field. this is the field we are filtering by...
            if (k == 'id') continue;

            cols.push("`" + k + "` = ?");
            vals.push(this.params[k]);
        }

        return dbh.query("UPDATE Posts SET " + cols.join(',') + " WHERE id = ?", [...vals, this.params.id])
    }

    /**
     * 
     * @param params Post parameters
     */
    public static async create(params: Pick<PostsModel, Exclude<keyof PostsModel, 'id'>>) {

        let dbh = new db();

        let cols = [];
        let vals = [];
        let placeholders = [];

        for (let k in params) {
            cols.push("`" + k + "`");
            vals.push(params[k]);
            placeholders.push("?");
        }

        return dbh.query("INSERT INTO Posts (" + cols.join(",") + ") VALUES (" + placeholders.join(",") + ")", vals);

    }

    public delete() {
        let dbh = new db();

        return dbh.query("DELETE FROM Posts WHERE id = ?", [this.params.id])
    }
}