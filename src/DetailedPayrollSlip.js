import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './EmployeeMenuPage.css';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import Attendence from './Attendence';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import $ from 'jquery';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import CryptoJS from 'crypto-js';
import FooterText from './FooterText';
import EmployeeMenuPage from './EmployeeMenuPage';
import SalaryCalcConfig from './SalaryCalcConfig';
import ViewPayroll from './ViewPayroll';
import SelectSearch from 'react-select';
import Printpayslip from './Printpayslip';

import moment from 'moment'
import IndividualPayRoll from './IndividualPayRoll';

var i;
var printData;


class DetailedPayrollSlip extends Component {

  constructor() {
    super()
    var companyType = CryptoJS.AES.decrypt(localStorage.getItem('CompanyType'), "shinchanbaby").toString(CryptoJS.enc.Utf8);

    if (companyType == "Office") {
      companyType = "Employee";
    }
    else {
      companyType = "Student/Staff";
    }
    this.state = {
      companyType: companyType,
      salarySelectionOption: '',
      employeeId: '',
      month: ''

    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    $("#payrollTable").hide();
    $("#additionTablediv").hide();
    $("#reductionTablediv").hide();
    $("#nodata").hide();
    $("#print").hide();

    this.GetEmpId();

  }


 
  BackbtnFunc(){
    ReactDOM.render(
        <Router>
            <div>
                <Route path="/" component={EmployeeMenuHeader} />
                <Route path="/" component={IndividualPayRoll} />
                <Route path="/" component={FooterText} />

            </div>
        </Router>,
        document.getElementById('root'));
    registerServiceWorker();
}
  OrganizationPaySlip() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={ViewPayroll} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }

  DetailedPaySlip() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={DetailedPayrollSlip} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }

  dropdownFunc() {
    $('#1').hide(); $('#2').hide(); $('#3').hide();
    $('#4').hide(); $('#5').hide(); $('#6').hide();
    $('#7').hide(); $('#8').hide(); $('#9').hide();
    $('#10').hide(); $('#11').hide(); $('#12').hide();

    var today = new Date();
    var month = today.getMonth();
    if (month == "0") {
      month = 12;
    }

    //  this.state.month = month;
    var displaydate = today.getDate();
    this.setState({
      month: this.state.month,
    });
    for (i = 1; i <= month; i++) {
      $('#dropdown').show();
      $('#' + i).show();
    }
    this.state.i = i - 1;
    this.setState({
      i: this.state.i,
    });

  }


  MonthlyFunc(value) {

    $("#payrollTable").empty();
    $("#additionTable").empty();
    $("#reductionTable").empty();

    $("#payrollTable").hide();
    $("#additionTablediv").hide();
    $("#reductionTablediv").hide();
    $("#nodata").hide();

    var today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var val1 = value;
    // console.log("in month function" + value);
    this.state.month = value;
    this.state.monthName = monthNames[value - 1];
    this.setState({
      month: this.state.month,
      monthName: this.state.monthName,
      selectedEmployeeId: '',
    });


    // console.log("The current month is " + monthNames[value-1]);

    var monthName = value;

    if (monthName == "12") {
      // alert("IF PART FOR MONTH");
      monthName = 11;
    } else {
      //alert("ELSE PART FOR MONTH");

      monthName = Number(value) - 1;
    }


    var formattedMonth = moment().month(monthName).format('MMMM');
    console.log(formattedMonth)
    this.state.monthName = formattedMonth;



  }

  handleUserInput = (e) => {


    $("#payrollTable").empty();
    $("#additionTable").empty();
    $("#reductionTable").empty();


    const value = e.value;
    this.setState({
      employeeId: value,
      selectedEmployeeId: e,
      valid: true,
    },
    );
    if (this.state.month != "") {

      /* console.log("AJAX CALL DATA " + JSON.stringify({
 
         schoolId: this.state.companyId,
         month: this.state.month,
         employeeId: value
       })); */


      /*var monthName=this.state.month;
    
      if(monthName== "12"){
       // alert("IF PART FOR MONTH");
        monthName=11;
      }else{
        //alert("ELSE PART FOR MONTH");
        monthName=monthName;
      }
      
    
      var formattedMonth = moment().month(monthName).format('MMMM');
      this.state.monthName=formattedMonth;
      console.log(formattedMonth)
           
    */


      $.ajax({
        type: 'POST',
        data: JSON.stringify({

          schoolId: this.state.companyId,
          month: this.state.month,
          employeeId: value
        }),
        url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payslip/DetailedOrganizationPaySlip",
        //  url: "http://localhost:8080/EmployeeAttendenceAPI/payslip/DetailedOrganizationPaySlip",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        crossDomain: true,

        success: function (data, textStatus, jqXHR) {


          if (data.detailedOrganizationPaySlipList.length != 0) {

            /*   alert("DATA NOT NULL");
               console.log("DATA LENGTH" + data.length);
               console.log("DATA IN RETURN" + data.detailedOrganizationPaySlipList[0].employeeId);
               console.log("DATA IN RETURN" + data.additionAllowencesList[0].additionCategoryName);
               console.log("DATA IN RETURN" + data.reductionAllowencesList[0].reductionCategoryName);
             */


            $("#payrollTable").show();
            $("#additionTablediv").show();
            $("#reductionTablediv").show();
            $("#nodata").hide();
            printData = data;
            var detailedPaySlip;

            detailedPaySlip += '<thead className="headcolor" style="color: white ;  text-align: center; '
              + 'background-color: #486885;" ><tr><th>EmployeeId</th><th>EmployeeName</th><th>Role</th>'
              + '<th>Department</th><th>WorkingDays</th><th>PresentDays</th><th>AbsentDays</th>'
              + '<th>Holidays</th><th>AdvancePending</th><th>AdvanceCredited</th><th>AdvanceDebited</th><th>BasicSalary</th>'
              + '<th>NetSalary</th><th>Date</th></tr></thead>';

            $.each(data.detailedOrganizationPaySlipList, function (i, item) {

              detailedPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; text-align: center;"><tr><td>' + item.employeeId + '</td>'
                + '<td>' + item.name + '</td><td>' + item.role + '</td><td>' + item.department + '</td>'
                + '<td>' + item.companyWorkingDays + '</td><td>' + item.present + '</td>'
                + '<td>' + item.absent + '</td><td>' + item.holidayDays + '</td>'
                + '<td>' + item.grantedAdvance + '</td><td>' + item.advance + '</td>'
                + '<td>' + item.advanceDebit + '</td><td>' + item.salary + '</td>'
                + '<td>' + item.netSalary + '</td><td>' + item.date + '</td></tr></tbody>';

              /*    console.log("item.totalSalary "+ item.totalSalary,  item.taxAmt );
           */
            });

            $("#payrollTable").append(detailedPaySlip);

            var additionAmount;

            additionAmount += '<thead className="headcolor" style="color: white ; text-align: center; background-color: #486885;" ><tr><th>Category Name</th><th>Amount</th><tr></thead>';

            $.each(data.additionAllowencesList, function (i, item) {

              additionAmount += '<tr class="success" style="color: black ; text-align: center; "><td>' + item.additionCategoryName + '</td><td>' + item.additionCategoryAmount + '</td>,/tr>';

            });
            $("#additionTable").append(additionAmount);



            var reductionAmount;

            reductionAmount += '<thead className="headcolor" style="color: white ;  text-align: center; background-color: #486885;" ><tr><th>Category Name</th><th>Amount</th><tr></thead>';

            $.each(data.reductionAllowencesList, function (i, item) {

              reductionAmount += '<tr class="success" style=" color: black ; text-align: center; "><td>' + item.reductionCategoryName + '</td><td>' + item.reductionCategoryAmount + '</td>,/tr>';

            });
            $("#reductionTable").append(reductionAmount);

            $("#print").show();

          } else {
            // alert("DATA NULL");
            $("#payrollTable").hide();
            $("#additionTablediv").hide();
            $("#reductionTablediv").hide();
            $("#nodata").show();
            $("#print").hide();
          }
        }
      });

    } else {

      var employeeId;
      employeeId += '<option value=" " disabled selected hidden >Select a Employee Id</option>';
      $("#employeeId").append(employeeId);

      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly Select The Month and Continue The Process',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });


    }



  }




  GetEmpId() {
    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.companyId = companyId;
    this.setState({
      companyId: companyId,
    });
    var self = this;




    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        companyId: this.state.companyId,

      }),
      // url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/employee/EmployeeList",
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/employeeshiftmanagement/SelectAllEmployee",

      contentType: "application/json",
      dataType: 'json',
      async: false,
      crossDomain: true,

      success: function (data, textStatus, jqXHR) {

        var options = [];
        $.each(data.slice(1), function (i, item) {

          options.push({ label: item.employeeId + " " + item.employeeName + " " + item.mobileNo, value: item.employeeId }, );

        });
        self.state.options = options;
        self.setState({
          options: options,
        })
      }
    });
  }

  Print() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={() => <Printpayslip data={printData} />} />
          <Route path="/" component={FooterText} />

        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }

  render() {
    return (
      <div className="container" style={{ marginBottom: "21%" }}>
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
 

        <h3 className="centerAlign" style={{ marginTop: "2%", textAlign: "center" }}>PayRoll Management</h3>
        <div id='horMenu'>
          <ul id='horMenunew' class="ulmenubar" style={{ backgroundColor: "#8811d6" }}>
            <li><a className="active" onClick={() => this.OrganizationPaySlip()}><span class="glyphicon glyphicon-plus"></span>Organization PaySlip</a></li>
            <li><a onClick={() => this.DetailedPaySlip()}><span class="glyphicon glyphicon-minus"></span>Detailed Organization PaySlip </a></li>
          </ul>
        </div>

        <h4 className="centerAlign" style={{ marginTop: "17px", textAlign: "center" }}>Detailed Organization Pay Slip</h4>

        <div class="row">
          <div class="btn-group" className="col-xs-12 col-sm-6 col-lg-6 col-xl-6 " style={{ marginBottom: "-5%" }}>
            <button type="button" onClick={() => this.dropdownFunc()} class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Select Month</button>



            <ul class="dropdown-menu" id="dropdown"
              style={{
                marginBottom: "50px!important",
                padding: " 0px auto",
                textAlign: "center"
              }} role="menu">
              <li><a href="#" id="1" onClick={(e) => this.MonthlyFunc("1")}>January</a></li>
              <li><a href="#" id="2" onClick={(e) => this.MonthlyFunc("2")}>February</a></li>
              <li><a href="#" id="3" onClick={(e) => this.MonthlyFunc("3")}>March </a></li>
              <li><a href="#" id="4" onClick={(e) => this.MonthlyFunc("4")}>April </a></li>
              <li><a href="#" id="5" onClick={(e) => this.MonthlyFunc("5")}>May</a></li>
              <li><a href="#" id="6" onClick={(e) => this.MonthlyFunc("6")}>June</a></li>
              <li><a href="#" id="7" onClick={(e) => this.MonthlyFunc("7")}>July</a></li>
              <li><a href="#" id="8" onClick={(e) => this.MonthlyFunc("8")}>August</a></li>
              <li><a href="#" id="9" onClick={(e) => this.MonthlyFunc("9")}>September</a></li>
              <li><a href="#" id="10" onClick={(e) => this.MonthlyFunc("10")}>October</a></li>
              <li><a href="#" id="11" onClick={(e) => this.MonthlyFunc("11")}>November</a></li>
              <li><a href="#" id="12" onClick={(e) => this.MonthlyFunc("12")}>December</a></li>

            </ul>
          </div>


          <div className="col-xs-12 col-sm-6 col-lg-6 col-xl-6 " style={{ marginTop: "03px", display: " -webkit-inline-box", marginBottom: "20px" }} >

            {/*    <select
              id="employeeId"
              className="form-control"
              onChange={this.handleUserInput}
              name="employeeId"
              style={{ width: "80%" }}
            >
            </select> */}



          </div>

        </div>
        <label style={{ marginTop: "35px" }}>
          {this.state.companyType} Id*</label>

        <SelectSearch options={this.state.options} value={this.state.selectedEmployeeId} onChange={(e) => this.handleUserInput(e)} name="employeeId" placeholder="Select Employee " />

        <br />
        <br />

        <h3 className="centerAlign" style={{ marginTop: "-10px", textAlign: "center" }}>{this.state.monthName}</h3>
        <br />
        <br />

        {/*  <div id="tableOverflow">
          <table id="payrollTable">

          </table>
        </div> */}

        <div id="tableOverflow" style={{ marginBottom: "10%" }}   >
          <table style={{ margin: "auto" }} className="table" id="payrollTable">
          </table>

        </div>



        <div id="additionTablediv" style={{ textAlign: "center" }}>
          <label>Amounts Added</label>
          <table style={{ margin: " 10px auto", width: "80%" }} className="table" id="additionTable">

          </table>
        </div>

        <div id="reductionTablediv" style={{ textAlign: "center" }} >
          <label>Amounts Reduced</label>
          <table style={{ margin: " 10px auto", width: "80%", marginBottom: "10%" }} className="table" id="reductionTable">

          </table>
        </div>

        <button id="print" style={{ marginBottom: " 5%" }} onClick={() => this.Print()} >Print</button>



        <h3 id="nodata">No Data</h3>


      </div>

    );
  }

}


export default DetailedPayrollSlip;