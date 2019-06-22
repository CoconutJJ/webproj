import * as React from "react";
import HTTPRequest from "../../../classes/frontend/class.HTTPRequest";
import { HTTP } from "../../../classes/definitions/HTTP";
import Post from "./post";

interface IProps {

}

interface IState {
    posts: any[]
}


class App extends React.Component<IProps, IState> {

    postCount: number;

    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {
            posts: []
            
        }

        this.postCount = 0;

        var req = new HTTPRequest("GET", "/qa/posts")

        req.execVoid(HTTP.RESPONSE.OK).then(function (data: []) {

            var posts = [];

            data.forEach(function (entry, index) {
                this.postCount++;
                posts.push(
                    <Post
                        id={entry['id']}
                        title={entry['title']}
                        body={entry['body']}
                        author={entry['author']}
                        date={entry['created_at']}
                        showDate={entry['showDate']}
                        deletePost={() => this.deleteComponent(index)}
                        key={index}
                    />
                )
            }.bind(this))

            this.setState({
                posts: posts
            }, this.updatePosts)


        }.bind(this))
    }

    componentDidMount = () => {

    }

    updatePosts = () => {

        if (this.postCount == 0) {
            var posts = [];
            posts.push(
                <div className="card" key={1}>
                    <div className="card-content">
                        No posts to show :)
                    </div>
                </div>
            )

            this.setState({
                posts: posts
            })
        }

    }

    deleteComponent = (key: number) => {
        this.postCount--;

        this.updatePosts();
    }

    render(): React.ReactNode {

        return (
            <div>
                {this.state.posts}
            </div>
        )

    }

}

export default App;