import * as React from 'react';

interface IProps {

}

interface IState {

}

class CardTwo extends React.Component<IProps, IState> {

    constructor (props: Readonly<IProps>) {
        super(props);
    }


    render() : React.ReactNode {
        return (
            <div className="card">
                <div className="card-content">
                    <span className="card-title"></span>
                </div>
            </div>
        )
    }
}
export default CardTwo;