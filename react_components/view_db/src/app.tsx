import * as React from "react";
import * as Table from './table';
class App extends React.Component {
    state = {
        
    }

    render(): React.ReactNode {
        
        return (
            <div className="container">
                <Table.default/>
            </div>
        )

    }

}

export default App;