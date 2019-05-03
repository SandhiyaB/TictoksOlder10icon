
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './EmployeeMenuPage.css';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import AttendanceRegulation from './AttendanceRegulation';
import AttendanceDisplay from './AttendanceDisplay';
import EmployeeMenuPage from './EmployeeMenuPage';
import AttendanceRegulationSupervisor from './AttendanceRegulationSupervisor';
import './Maintenance.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import LeaveManagement from './LeaveManagement';
import CryptoJS from 'crypto-js';
import FooterText from './FooterText';
import Attendence from './Attendence';
import ManualAttendance from './ManualAttendance';


class AttendanceMenuPage extends Component {

  constructor() {
    super()
    this.state = {

    }
  }

  AttendanceFunc() {
    var permission = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('Permissions'), "shinchanbaby").toString(CryptoJS.enc.Utf8));

    var flag = 1;//false
    var i = permission.length;
    $.each(permission, function (i, item) {

      if (item.permission == "attendance") {
        flag = 0;//true
      }
    });

    if (flag == 0) {

      ReactDOM.render(
        <Router>
          <div>
            <Route path="/" component={EmployeeMenuHeader} />
            <Route path="/" component={AttendanceMenuPage} />
            <Route path="/" component={Attendence} />
            <Route path="/" component={FooterText} />

          </div>
        </Router>,
        document.getElementById('root'));

    }
    else {
      confirmAlert({
        title: 'Access Deined',                        // Title dialog
        message: 'You are not Allowed to Access this Page',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm

      })
    }
  }

  ManualAttendanceFunc() {

    var permission = JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('Permissions'), "shinchanbaby").toString(CryptoJS.enc.Utf8));

    var flag = 1;//false
    var i = permission.length;
    $.each(permission, function (i, item) {

      if (item.permission == "attendance") {
        flag = 0;//true
      }
    });

    if (flag == 0) {

      ReactDOM.render(
        <Router>
          <div>
            <Route path="/" component={EmployeeMenuHeader} />
            <Route path="/" component={AttendanceMenuPage} />
            <Route path="/" component={ManualAttendance} />
            <Route path="/" component={FooterText} />

          </div>
        </Router>,
        document.getElementById('root'));

    }
    else {
      confirmAlert({
        title: 'Access Deined',                        // Title dialog
        message: 'You are not Allowed to Access this Page',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm

      })
    }
  }
  componentDidMount() {
    var self = this;

    window.scrollTo(0, 0);

    self.AttendanceFunc();
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





  render() {
    return (




      <div className="container">
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
          <ul id='horMenunew'  style={{ backgroundColor: "#8811d6" }}  >
            <li><a  className="active" onClick={() => this.AttendanceFunc()}><span class="glyphicon glyphicon-pencil"> Attendance</span></a></li>
            <li><a  onClick={() => this.ManualAttendanceFunc()}><span class="glyphicon glyphicon-check">Manual Attendance</span></a></li>

          </ul>

        </div>


      </div>




    );
  }

}


export default AttendanceMenuPage;
