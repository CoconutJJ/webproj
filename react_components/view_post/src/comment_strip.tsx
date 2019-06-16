import * as React from 'react';

interface IProps {
    commentId: number,
    commentAuthorFirstName: string,
    commentAuthorLastName: string,
    commentAuthorUsername: string,
    commentText: string,
    commentDate: string,
    commentUpdated: string,
}

interface IState {
    commentId: number,
    commentAuthorFirstName: string,
    commentAuthorLastName: string,
    commentAuthorUsername: string,
    commentText: string,
    commentDate: string,
    commentUpdated: string
}


class CommentStrip extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props)
        this.state = {
            ...this.props
        }

    }

    render(): React.ReactNode {

        return (
            <div className="row">
                <div className="col s12">
                    
                    <div className="chip">
                        {this.state.commentAuthorFirstName + " " + this.state.commentAuthorLastName + " (" + this.state.commentAuthorUsername + ")"}
                    </div>
                    {this.state.commentText} <span className="grey-text">on {this.state.commentDate}</span>
                </div>
            </div>


        )

    }


}

export default CommentStrip;