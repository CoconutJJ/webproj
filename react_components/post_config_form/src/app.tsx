import * as React from "react";

class App extends React.Component {
    state = {
        customPostDateEnabled: false
    }

    customDateToggle = () => {
        this.setState({
            customPostDateEnabled: !this.state.customPostDateEnabled
        })
    }

    render(): React.ReactNode {

        return (
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Submission Settings</span>

                            <div className="row">
                                <div className="col s6">
                                    <label>
                                        <input type="checkbox" className="filled-in"/>
                                        <span>Show Author Name</span>
                                    </label>

                                </div>
                                <div className="col s6">
                                    <label>
                                        <input type="checkbox" className="filled-in"/>
                                        <span>Show Date</span>
                                    </label>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col s6">
                                    <label>
                                        <input type="checkbox" className="filled-in" onClick={this.customDateToggle}/>
                                        <span>Custom Post Date</span>
                                    </label>
                                    <input type="text" className="datepicker" disabled={!this.state.customPostDateEnabled} />
                                    
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )

    }

}

export default App;