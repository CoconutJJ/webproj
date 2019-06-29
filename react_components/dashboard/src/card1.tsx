import * as React from 'react';


interface IProps {

}

interface IState {
    title: string
    date: string
}

/* function asCard(WrappedComponent: React.ComponentType<any>, cardTitle: string) {
    interface IProps {
        
    }
    
    interface IState {
        title: string
    }
    return class extends React.Component<IProps, IState> {

        constructor (props: Readonly<IProps>) {
            super(props);
            this.state = {
                title: cardTitle
            }
        }

        setTitle = (title: string) => {
            this.setState({
                title: title
            })
        }

        render(): React.ReactNode {
            return (
                <div className="card">
                    <span className="card-title">{this.state.title}</span> 
                    <WrappedComponent setTitle={this.setTitle}/>
                </div>
            )
        }

    }
}  */

class CardOne extends React.Component<IProps, IState> {

    constructor(props: Readonly<IProps>) {
        super(props);
        this.state = {
            title: "Quick Actions",
            date: this.generateDate()
        }
    }

    generateDate = () => {
        let months = [
            "January",
            "February",
            "March",
            "May", 
            "June", 
            "July", 
            "August", 
            "September", 
            "October", 
            "November", 
            "December"
        ];

        let curr_date = new Date();

        return months[curr_date.getMonth() - 1] + " " + curr_date.getDate() + " " + curr_date.getFullYear();

    }

    componentDidMount = () => {
        
    }

    render(): React.ReactNode {
        return (
            <div className="card">
                <div className="card-content">
                    <span className="card-title">{this.state.title}</span>
                    <h6>Today is {this.state.date}</h6>
                    <ul>
                        <li><a href="/qa/posts/create">Create Post</a></li>
                        <li><a href="/qa/posts/view">View/Edit Posts</a></li>
                        <li><a href="#"></a></li>
                    </ul>
                </div>
            </div>
        )
    }

}
export default CardOne;