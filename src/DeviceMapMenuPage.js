import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './EmployeeMenuPage.css';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import TripListForMap from './TripListForMap';
import FooterText from './FooterText';
import DeviceListForMap from './DeviceListForMap';
import EmployeeMenuPage from './EmployeeMenuPage';
import DeviceMenuPage from './DeviceMenuPage';
import EmployeeLocationDetials from './EmployeeLocationDetails';

class DeviceMapMenuPage extends Component {

    constructor() {
        super()
        this.state = {

        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        this.TripDetailsPage();
    }
    DevicaDetailPage() {
        ReactDOM.render(
            <Router>
                <div>
                    <Route path="/" component={EmployeeMenuHeader} />
                    <Route path="/" component={DeviceMapMenuPage} />
                    <Route path="/" component={DeviceListForMap} />		
                    <Route path="/" component={FooterText} />
                </div>
            </Router>,
            document.getElementById('root'));
        registerServiceWorker();
    }

    TripDetailsPage() {
        ReactDOM.render(
            <Router>
                <div>
                    <Route path="/" component={EmployeeMenuHeader} />
                    <Route path="/" component={DeviceMapMenuPage} />
                    <Route path="/" component={TripListForMap} />
                    <Route path="/" component={FooterText} />
                </div>
            </Router>,
            document.getElementById('root'));
        registerServiceWorker();
    }

    BackbtnFunc() {
        ReactDOM.render(
            <Router>
                <div>
                    <Route path="/" component={EmployeeMenuHeader} />
                    <Route path="/" component={EmployeeMenuPage} />
                    <Route path="/" component={FooterText} />

                </div>
            </Router>,
            document.getElementById('root'));
        registerServiceWorker();
    }
    EmployeeLocationPage(){
        ReactDOM.render(
            <Router>
                <div>
                    <Route path="/" component={EmployeeMenuHeader} />
                    <Route path="/" component={DeviceMapMenuPage} />
                    <Route path="/" component={EmployeeLocationDetials} />
                    <Route path="/" component={FooterText} />
                </div>
            </Router>,
            document.getElementById('root'));
        registerServiceWorker();
    }

    render() {
        return (
            <div className="container"
                style={{ backgroundColor: "#edf5e1" }}>
                <ul class="previous disabled" id="backbutton"
                    style={{
                        backgroundColor: "#f1b6bf",
                        float: "none",
                        display: "inline-block",
                        marginLeft: "5px",
                        borderRadius: "5px",
                        padding: "3px 7px 3px 7px"
                    }}>
                    <a href="#" onClick={() => this.BackbtnFunc()}><i class="arrow left"></i></a></ul>

                <div id='horMenunew' >
                    <ul id='horMenunew' style={{ backgroundColor: "#8811d6" }}>
                        <li><a className="active" onClick={() => this.TripDetailsPage()} ><span class="glyphicon glyphicon-plus">Trip Details</span></a></li>
                        <li><a onClick={() => this.DevicaDetailPage()}><span class="fa fa-pencil">Device Details</span> </a></li>
                        <li><a onClick={() => this.EmployeeLocationPage()}><span class="fa fa-pencil">Employee History</span> </a></li>

                    </ul>

                </div>
            </div>




        );
    }

}


export default DeviceMapMenuPage;