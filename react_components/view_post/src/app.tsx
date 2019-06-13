import * as React from "react";
import HTTPRequest from "../../../classes/frontend/class.HTTPRequest";
import { HTTP } from "../../../classes/class.definitions";
import Post from "./post";

interface IProps {

}

interface IState {
    posts: any[]
}


class App extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {
            posts: []
    
        }
    }

    componentWillMount = () => {
        var req = new HTTPRequest("GET", "/qa/posts")

        req.execVoid(HTTP.RESPONSE.OK).then(function (data: []) {
            
            var posts = [];

            data.forEach(function (entry, index) {

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

            
            this.updatePosts(posts)
            
        }.bind(this))

    }

    updatePosts = (posts: Array<any>) => {

        if (posts.length == 0) {
            posts.push(
                <div className="card" key={1}>
                    <div className="card-content">
                        No posts to show :)
                    </div>
                </div>
            )
        }

        this.setState({
            posts: posts
        })


    }

    deleteComponent = (key: number) => {
        let posts = this.state.posts.filter(function (value, index) {
            return index != key;
        })

        this.updatePosts(posts);
    }

    componentDidMount = () => {
        

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