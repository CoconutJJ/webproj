import * as React from 'react';
import CommentStrip from './comment_strip'
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import { HTTP } from '../../../classes/class.definitions';
interface IProps {
    post_id: number
}

interface IState {
    comments: CommentStrip[],
    currentComment: string
}


class Comment extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            comments: [],
            currentComment: ""
        }
        
        var req = new HTTPRequest("GET", "/qa/posts/" + this.props.post_id + "/comments");
        req.execVoid(HTTP.RESPONSE.OK).then(function (data: object[]) {
            var comments = [];
            data.forEach((comment, index) => {
                comments.push(
                    <CommentStrip 
                    commentId={comment['id']}
                    commentAuthorFirstName={comment['firstname']}
                    commentAuthorLastName={comment['lastname']}
                    commentAuthorUsername={comment['username']}
                    commentDate={this.convertToReadableDate(comment['created_at'])}
                    commentText={comment['comment']}
                    commentUpdated={comment['updated_at']}
                    key={index}
                    />
                )
            });
            this.setState({
                comments: comments
            })
        }.bind(this))
    }

    componentDidMount() {
        
    }

    convertToReadableDate(unix_timestamp: number) {
        return new Date(unix_timestamp).toISOString().split("T")[0]
    }


    handleCommentText = (e) => {
        this.setState({
            currentComment: e.target.value
        })
    }

    render(): React.ReactNode {

        return (
            <div>
                {this.state.comments}
                <div className="input-field col s12">
                    <textarea id="comment-box" className="materialize-textarea"></textarea>
                    <label htmlFor="commentbox">Comment:</label>
                </div>
            </div>


        )

    }


}

export default Comment;