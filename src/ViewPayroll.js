import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './EmployeeMenuPage.css';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

import EmployeeMenuHeader from './EmployeeMenuHeader';

import ReportMenuPage from './ReportMenuPage';
import $ from 'jquery';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import CryptoJS from 'crypto-js';

import FooterText from './FooterText';
import EmployeeMenuPage from './EmployeeMenuPage';
import SalaryCalcConfig from './SalaryCalcConfig';
import DetailedPayrollSlip from './DetailedPayrollSlip';
import moment from 'moment'
import IndividualPayRoll from './IndividualPayRoll';

var i;
class ViewPayroll extends Component {

  constructor() {
    super()

    this.state = {

      salarySelectionOption: '',

    };
  }

  componentDidMount() {

    window.scrollTo(0, 0);
    $("#payrollTable").hide();
    $("#nodata").hide();
    $("#myInput").hide();
   // $("#searchbar").hide();


     //search button func
     $(document).ready(function () {
      $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });
    });


  }

  dropdownFunc() {
    $('#1').hide(); $('#2').hide(); $('#3').hide();
    $('#4').hide(); $('#5').hide(); $('#6').hide();
    $('#7').hide(); $('#8').hide(); $('#9').hide();
    $('#10').hide(); $('#11').hide(); $('#12').hide();

    var today = new Date();
    var month=today.getMonth();
  if(month=="0"){
    month=12;
  }
  this.state.month = month;
    var displaydate = today.getDate();
    this.setState({
      month: this.state.month,
    });
    for (i = 1; i <= this.state.month; i++) {
      $('#dropdown').show();
      $('#' + i).show();
    }
    this.state.i = i - 1;
    this.setState({
      i: this.state.i,
    });

  }

  MonthlyFunc(value) {
    var today = new Date();

    var val1 = value;
    alert("SELECTED MONTH" + value);

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.companyId = companyId;
    this.setState({
      companyId: companyId,
    });
    var self = this;

    var monthName=value;

    if(monthName== "12"){
     // alert("IF PART FOR MONTH");
      monthName=11;
    }else{
     // alert("ELSE PART FOR MONTH");

      monthName=Number(value) - 1;
    }
    

    var formattedMonth = moment().month(monthName).format('MMMM');
    console.log(formattedMonth)
this.state.monthName=formattedMonth;




    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.companyId,
        month: value
      }),
       url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payslip/OrganizationPaySlip",
     //url: "http://localhost:8080/EmployeeAttendenceAPI/payslip/OrganizationPaySlip",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      crossDomain: true,

      success: function (data, textStatus, jqXHR) {
        
        /* console.log("DATA LENGTH :" + data.length);
        console.log("ORGANIZATION PAYSLIP"+data[0].employeeId ); */

        if (data.length == 0) {
          // alert("data is zero");
          $("#nodata").show();
          $("#payrollTable").hide();
        } else {
          $("#nodata").hide();
          $("#payrollTable").empty();
          $("#payrollTable").show();

   var organizationPaySlip;

 /*  $("#searchbar").show();
   $("#searchbar").append(' <input style={{ color: "black" }} type="text" '
   +'id="myInput" class="myInput "placeholder="Search.." title="Type in a name" />' );
*/

$("#myInput").show();

   organizationPaySlip += '<thead className="headcolor" style="color: white ;  text-align: center; '
   +'background-color: #486885;" ><tr><th style="text-align="center";>Employee Id</th><th>Employee Name</th><th>Role</th>'
   +'<th>Department</th><th>Working Days</th><th>Present Days</th><th>Advance Pending</th>'
   +'<th>Advance Credited</th><th>Advance Debited</th><th>Basic Salary</th><th>Net Salary</th>'
   +'<th style="width:10000px">Date</th></tr></thead>';
 
          $.each(data, function (i, item) {

            organizationPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; text-align: center;"><tr><td>' + item.employeeId + '</td>'
            +'<td>'+item.name+'</td><td>' + item.role + '</td><td>' + item.department + '</td>'
            +'<td>'+item.companyWorkingDays+'</td><td>'+item.present+'</td>'
            +'<td>'+item.grantedAdvance+'</td><td>'+item.advance+'</td>'
            +'<td>'+item.advanceDebit+'</td><td>' + item.salary + '</td>'
            +'<td>' + item.netSalary + '</td><td class="date" style="width:50px">'+item.date+'</td></tr></tbody>';

          });
          $("#payrollTable").append(organizationPaySlip);
          $(".date").css("width" ,"50px");
        }

      }
    });
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
  render() {
    return (
      <div className="container" style={{marginBottom: "21%"}}>
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
 
         <h3 className="centerAlign" style={{marginTop:"2%", textAlign: "center" }}>PayRoll Management</h3>

        <div id='horMenu'>
          <ul id='horMenunew'  class="ulmenubar" style={{ backgroundColor: "#8811d6" }}>
            <li><a className="active" onClick={() => this.OrganizationPaySlip()}><span class="glyphicon glyphicon-plus"></span>Organization PaySlip</a></li>
            <li><a onClick={() => this.DetailedPaySlip()}><span class="glyphicon glyphicon-minus"></span>Detailed Organization PaySlip </a></li>
          </ul>
        </div>

            <h4 className="centerAlign" style={{ marginTop: "20px", textAlign: "center" }}>Organization Pay Slip</h4>

        <div class="btn-group" style={{ marginBottom: "5%" }}>
          <button type="button" onClick={() => this.dropdownFunc()} class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Select Month</button>



          <ul class="dropdown-menu" id="dropdown"
            style={{
              marginBottom: "50px!important", 
              padding: " 0px auto",
              textAlign: "center"
            }}
            role="menu">
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

{/*         <div id="tableOverflow">
          <table id="payrollTable">

          </table>
        </div> */}

<div>
<input style={{ color: "black" }} type="text" id="myInput" class="myInput "placeholder="Search.." title="Type in a name" />
</div>


     <h3 className="centerAlign" style={{ marginTop: "50px", textAlign: "center" }}>{this.state.monthName}</h3>



       <div id="tableOverflow" style={{marginBottom:"10%"}}>
          <table style={{ margin: "auto" }} className="table" id="payrollTable">
          </table>

        </div>


        <h3 align="center" id="nodata">No Data</h3>

      </div>

    );
  }

}


export default ViewPayroll;

