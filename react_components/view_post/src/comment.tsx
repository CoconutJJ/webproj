import * as React from 'react';
import { HTTP } from '../../../classes/definitions/HTTP';
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import CommentStrip from './comment_strip';
interface IProps {
  post_id: number
  updateCache: (comments: any) => void;
  getCache: () => [];
}

interface IState {
  comments: any[],
  currentComment: string
}


class Comment extends React.Component<IProps, IState> {
  key: number;

  constructor(props: Readonly<IProps>) {
    super(props)
    this.state = {
      comments: [],
      currentComment: "",

    }
    this.key = 0;

  }

  componentDidMount() {
    let comments = this.props.getCache();

    if (comments == null) {

      var req = new HTTPRequest("GET", "/qa/posts/" + this.props.post_id + "/comments");
      req.execVoid(HTTP.RESPONSE.OK).then(function (data: object[]) {

        data.forEach((comment, index) => {

          this.addComment(
            comment['id'],
            comment['firstname'],
            comment['lastname'],
            comment['username'],
            comment['comment']
          )
        });



      }.bind(this))
    } else {
      this.setState({
        comments: comments
      })
    }
  }

  addComment = (id: number, commentAuthorFirstName: string, commentAuthorLastName: string, commentAuthorUsername: string, commentText: string) => {
    let comments = this.state.comments.slice();
    let key = this.key;
    comments.push(
      <CommentStrip
        commentId={id}
        commentAuthorFirstName={commentAuthorFirstName}
        commentAuthorLastName={commentAuthorLastName}
        commentAuthorUsername={commentAuthorUsername}
        commentDate={this.convertToReadableDate(Date.now() / 1000)}
        commentText={commentText}
        commentUpdated={this.convertToReadableDate(Date.now() / 1000)}
        key={this.key}
        delete={() => {
          this.deleteCommentStrip(id, key)
        }}
      />
    );
    
    this.key++;

    this.setState({
      comments: comments,
    }, () => {
      this.props.updateCache(comments.slice());
    })

  }

  deleteCommentStrip(id: number, index: number) {
    let req = new HTTPRequest("DELETE", "/qa/posts/comments/" + id);
    req.execVoid(HTTP.RESPONSE.OK).then(function (ret: any) {
      M.toast({
        html: ret['msg'],
        classes: 'green'
      })
    }.bind(this))
  }

  convertToReadableDate(unix_timestamp: number) {
    return new Date(unix_timestamp * 1000).toISOString().split("T")[0]
  }


  handleCommentText = (e: { target: { value: string; }; }) => {
    this.setState({
      currentComment: e.target.value
    })
  }

  handleCommentSubmit = (e: any) => {
    let req = new HTTPRequest("POST", "/qa/posts/comments");
    req.execAsJSON({
      comment: this.state.currentComment,
      post: this.props.post_id
    }, HTTP.RESPONSE.ACCEPTED).then(function (ret: { [x: string]: string; }) {
      this.addComment(
        ret['data']['id'],
        ret['data']['author']['firstName'],
        ret['data']['author']['lastName'],
        ret['data']['author']['username'],
        this.state.currentComment
      );
      this.setState({
        currentComment: ""
      })
      M.toast({ html: ret['msg'], classes: 'green' });
    }.bind(this))
  }

  render(): React.ReactNode {

    return (
      <div className="">
        {this.state.comments}
        <div className="row">
          <div className="input-field col l11 s12 m12">
            <textarea id="comment-box" className="materialize-textarea" onChange={this.handleCommentText} value={this.state.currentComment}></textarea>
            <label htmlFor="commentbox">Comment:</label>
          </div>
          <div className="input-field col l1 s12 m12">
            <button className="btn green waves-effect" onClick={this.handleCommentSubmit} disabled={this.state.currentComment.length == 0}>Submit</button>
          </div>
        </div>

      </div>
    )

  }


}

export default Comment;