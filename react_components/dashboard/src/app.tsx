import * as React from "react";
import CardOne from './card1';
import CardTwo from './card2';
import CardThree from './card3';
import CardFour from './card4';

class App extends React.Component {
    state = {

    }

    render(): React.ReactNode {

        return (
            <>
                <div className="row">
                    <div className="col l6 s12 m12">
                        <CardOne />
                    </div>
                    <div className="col l6 s12 m12">
                        <CardTwo />
                    </div>
                </div>
                <div className="row">
                    <div className="col l6 s12 m12">
                        <CardThree />
                    </div>
                    <div className="col l6 s12 m12">
                        <CardFour />
                    </div>
                </div>
            </>
        )

    }

}

export default App;