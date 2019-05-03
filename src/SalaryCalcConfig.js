import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import CryptoJS from 'crypto-js';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import FooterText from './FooterText';
import EmployeeMenuPage from './EmployeeMenuPage';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import ConfigurationPage from './ConfigurationPage';
import ReductionCatagoryPage from './ReductionCatagoryPage';
import PayRollConfigPage from './PayRollConfigPage';

class SalaryCalcConfig extends Component {

  constructor() {
    super()
    this.state = {

      catagoryName: '',
      salarySelectionOption: '',
      previousVal: '',

    };
  }

  componentDidMount() {

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,

    })

    /* console.log("in compo did mount" +JSON.stringify({
       schoolId:this.state.schoolId,
     })); */

    var self = this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: self.state.schoolId,

      }),

      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/CheckSalarySelection",
      // url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/CheckSalarySelection",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        /* alert("SUCCESS");
            
         console.log("DATA in CHECK SALARY SELECTION" +data.schoolId); */

        self.state.salarySelectionOption = data.salarySelection;
     
        if (self.state.salarySelectionOption != "New_OptionOpted") {

          if (self.state.salarySelectionOption == "daysperMonth") {
            // $("#radio1").attr("true");
            $("#radio1").prop('checked', true);
            self.state.previousVal = "daysperMonth";
            self.state.salarySelection = "daysperMonth";

          } else if (self.state.salarySelectionOption == "workingDays") {
            self.state.previousVal = "workingDays";
            self.state.salarySelection = "workingDays";

            $("#radio2").prop('checked', true);
          } else {
            self.state.previousVal = "hourly";
            self.state.salarySelection = "hourly";

            $("#radio3").prop('checked', true);
          }
        }



      },
      error: function (data) {
        confirmAlert({
          title: 'No Internet',                        // Title dialog
          message: 'Network Connection Problem',               // Message dialog
          confirmLabel: 'Ok',                           // Text button confirm
        });


      },
    });



  }


  BackbtnFunc() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={ConfigurationPage} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }

  AdditionCatog() {
    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={PayRollConfigPage} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }

  ReductionCatogFunc() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={ReductionCatagoryPage} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();

  }

  SalaryCalcFunc() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={SalaryCalcConfig} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();


  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,

    });

  }

  Submit() {

    var self = this;

    if (this.state.salarySelectionOption == "New_OptionOpted") {

      // alert("Adding New Salary Option ");

      confirmAlert({
        title: 'Salary Option Confirmation ',                        // Title dialog
        message: 'Do You Want To Submit The Selected Salary Option',               // Message dialog
        confirmLabel: 'Confirm',                           // Text button confirm
        cancelLabel: 'Cancel',                             // Text button cancel    
        onConfirm: () => { self.SubmitConfirm() },    // Action after Confirm
        onCancel: () => { self.NoAction() },      // Action after Cancel

      })

    } else {
      console.log("prev val ", this.state.previousVal, " curent va ", this.state.salarySelection)
      if (this.state.salarySelection != this.state.previousVal) {

        var oldValue;
        var newValue;

        if (this.state.salarySelection == "daysperMonth") {
          newValue = "No of days / month";
          oldValue = "No of working days";
        } else if (this.state.salarySelection == "workingDays") {
          oldValue = "No of days / month";
          newValue = "No of working days";
        } else {
          oldValue = "Days";
          newValue = "Hours";
        }

        console.log(oldValue, "  old val ", newValue, " new val")
        confirmAlert({
          title: 'Salary Option Confirmation ',                        // Title dialog
          message: 'Would you like to Change the Salary Option From ' + oldValue + ' to ' + newValue
            + '  Click on Yes to proceed, NO to Cancel.',               // Message dialog
          confirmLabel: 'Yes',                           // Text button confirm
          cancelLabel: 'No',                             // Text button cancel    
          onConfirm: () => { self.SubmitConfirm() },    // Action after Confirm
          onCancel: () => { self.NoAction() },      // Action after Cancel

        })
      } else {
        confirmAlert({
          title: 'No Change',                        // Title dialog
          message: 'Please Change the Option and Submit.',               // Message dialog
          confirmLabel: 'Ok',                           // Text button confirm
        });

      }
    }

  }


  SubmitConfirm() {

    /* console.log(JSON.stringify({
      schoolId:this.state.schoolId,
      salarySelection:this.state.salarySelection})); */
    var self = this;
    this.state.previousVal = this.state.salarySelection;
    console.log("this.state. salarysele", this.state.salarySelection)
    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.schoolId,
        salarySelection: this.state.salarySelection,

      }),

      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/AddSalarySelection",
      //url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/AddSalarySelection",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {


        /*  alert("SUCCESS");
               console.log("DATA" +data.schoolId); */

        localStorage.setItem('SalarySelectionOption', CryptoJS.AES.encrypt(self.state.salarySelection, "shinchanbaby"));



      },
      error: function (data) {
        confirmAlert({
          title: 'No Internet',                        // Title dialog
          message: 'Network Connection Problem',               // Message dialog
          confirmLabel: 'Ok',                           // Text button confirm
        });


      },
    });

  }

  NoAction() {
    var self = this;

    if (self.state.previousVal == "daysperMonth") {
      // $("#radio1").attr("true");
      $("#radio1").prop('checked', true);
      $("#radio2").prop('checked', false);

      self.state.previousVal = "daysperMonth";
      self.state.salarySelection = "daysperMonth";

    } else if (self.state.previousVal == "workingDays") {

      self.state.previousVal = "workingDays";
      self.state.salarySelection = "workingDays";


      $("#radio2").prop('checked', true);
      $("#radio1").prop('checked', false);

    } else {
      $("#radio2").prop('checked', false);
      $("#radio1").prop('checked', false);


    }

    ReactDOM.render(
      <Router>
        <div>

          <Route path="/" component={EmployeeMenuHeader} />

          <Route path="/" component={SalaryCalcConfig} />
          <Route path="/" component={FooterText} />



        </div>
      </Router>, document.getElementById('root'));

  }

  render() {
    return (
      <div className="container" style={{ marginBottom: "20%" }}>
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

        <h3 className="centerAlign" style={{ marginTop: "-10px", textAlign: "center" }}>PayRoll Configurtion</h3>

        <div id='horMenu'>
          <ul id='horMenunew' style={{ backgroundColor: "#8811d6" }}>
            <li><a className="active" onClick={() => this.AdditionCatog()}><span class="glyphicon glyphicon-plus"> Allowance Category</span></a></li>
            <li><a onClick={() => this.ReductionCatogFunc()}><span class="glyphicon glyphicon-minus"> Deduction Category</span> </a></li>
            <li><a onClick={() => this.SalaryCalcFunc()}><span class="glyphicon glyphicon-minus"> Salary Calculation</span> </a></li>

          </ul>
        </div>

         <h3 className="centerAlign" style={{ textAlign: "center", marginBottom: "30px" }}>Salary Calculation</h3>

        <label style={{ marginBottom: "20px" }} for="radiobutton" >
          Select Salary Calculation To Be Opted:
      </label>
        <br />
        <input style={{ marginBottom: "20px" }} type="radio" id="radio1" name="salarySelection" value="daysperMonth" onChange={this.handleUserInput} checked={this.state.selectedOption} />No.Of.Days / Month
                          <input style={{ marginLeft: '10%', marginBottom: "30px" }} type="radio" id="radio2" name="salarySelection" value="workingDays" onChange={this.handleUserInput} />No.Of.Working Days
                          <input style={{ marginLeft: '10%', marginBottom: "30px" }} type="radio" id="radio3" name="salarySelection" value="hourly" onChange={this.handleUserInput} />Hourly
       <br />

        <button class="btn btn-primary" id="submit" onClick={() => this.Submit()} >Submit</button>


      </div>

    );
  }

}


export default SalaryCalcConfig;