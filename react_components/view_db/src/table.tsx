import * as React from 'react';
import HTTPRequest from '../../../classes/frontend/class.HTTPRequest';
import { HTTP } from '../../../classes/definitions/HTTP';


interface IState {
    rows: []
}

interface IProps {

}



class Table extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {
            rows: []
        }
    }

    componentDidMount = () => {

        var req = new HTTPRequest<[{}]>("GET", '/api/db/posts/datatables');

        req.execVoid(HTTP.RESPONSE.OK).then(function (rows) {

            if (rows.length > 0) {
                rows = rows.map(function (entry, index) {
                    return (
                        <tr key={index}>
                            <td>{entry['id']}</td>
                            <td>{entry['title']}</td>
                            <td>{entry['body']}</td>
                            <td>{entry['author']}</td>
                            <td>{entry['created_at']}</td>
                            <td>{entry['updated_at']}</td>
                            <td>{entry['showAuthor']}</td>
                            <td>{entry['showDate']}</td>
                        </tr>
                    )
                })
                console.log(rows);
                this.setState({
                    rows: rows
                })
            }
        }.bind(this))
    }

    render(): React.ReactNode {
        return (
            <div>
                <form>
                    <div className="row">
                        <div className="input-field col s10">
                            <input type="text" placeholder="SQL Query" />
                        </div>
                        <div className="input-field col s2">
                            <button type="button" className="btn green waves-effect">Run</button>
                        </div>
                    </div>

                </form>

                <table id="posts-table">
                    <thead>
                        <tr>
                            <th><a href="#">ID</a></th>
                            <th>Title</th>
                            <th>Body</th>
                            <th>Author</th>
                            <th>Created Time</th>
                            <th>Last Updated</th>
                            <th>Show Author</th>
                            <th>Show Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.rows}
                    </tbody>
                </table>
            </div>
        )
    }


}
export default Table;