import * as React from "react";

export class App extends React.Component {

    state = {
        title: "Hello"
    }

    constructor(props: Readonly<{}>) {
        super(props);

    }

    toggleText = () => {
        if (this.state.title == "Hello") {
            this.setState({
                title: "World"
            })
        } else {
            this.setState({
                title: "Hello"
            })
        }
    }


    render(): React.ReactNode {

        return (
            <div className="container">
                <h1>{this.state.title}</h1>
                <button onClick={this.toggleText}>Change</button>
            </div>
        );

    }


}
