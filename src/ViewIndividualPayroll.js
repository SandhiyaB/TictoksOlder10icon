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
import PayRollConfigPage from './PayRollConfigPage';
import SalaryCalcConfig from './SalaryCalcConfig';
import DetailedPayrollSlip from './DetailedPayrollSlip';
import Payroll from './Payroll';
import moment from 'moment';
import IndividualPayRoll from './IndividualPayRoll';
import AdvanceReport from './AdvanceReport';
import IndividualPrintpayslip from './IndividualPrintpayslip';

var i;
var currentRow;
var successDataArray=[];

class ViewIndividualPayroll extends Component {

  constructor() {
    super()

    this.state = {

      salarySelectionOption: '',

    };
  }

  componentDidMount() {

    var self=this;
    
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

/*$(".namelink").on('click', function () {

alert("ANCHOR TAG ON CLICK");

});
*/

$("#payrollTable").on('click', '.namelink', function () {


    currentRow = $(this).closest("tr");
    self.state.employeeId = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
    //alert("ANCHOR TAG ON CLICK :"+self.state.employeeId);
    var rowNo= $(this).closest("tr").find("td:eq(13)").text();
    var printData=successDataArray[rowNo];
   
    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={() => <IndividualPrintpayslip data={printData} />} />
        </div>
      </Router>,
      document.getElementById('root'));

})


  }

  BackbtnFunc() {

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
          <Route path="/" component={ViewIndividualPayroll} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }
  ViewPaySlip() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={ViewIndividualPayroll} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }

  AdvanceReport(){

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={AdvanceReport} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();

  }
  GeneratePaySlip() {

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

  dropdownFunc() {
    $('#1').hide(); $('#2').hide(); $('#3').hide();
    $('#4').hide(); $('#5').hide(); $('#6').hide();
    $('#7').hide(); $('#8').hide(); $('#9').hide();
    $('#10').hide(); $('#11').hide(); $('#12').hide();

    var today = new Date();
    var month=today.getMonth()+1;
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
   
    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.companyId = companyId;
    this.setState({
      companyId: companyId,
    });
    var self = this;

    var monthName=value;

    if(monthName== "12"){
       monthName=11;
    }else{
 
      monthName=Number(value) - 1;
    }
    

    var formattedMonth = moment().month(monthName).format('MMMM');
  
this.state.monthName=formattedMonth;




    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.companyId,
        month: value
      }),
     url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payslip/IndividualOrganizationPaySlip",
    // url: "http://localhost:8080/EmployeeAttendenceAPI/payslip/IndividualOrganizationPaySlip",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      crossDomain: true,

      success: function (data, textStatus, jqXHR) {
        
         successDataArray=[];
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
   +'background-color: #486885;" ><tr><th>EmployeeId</th><th>EmployeeName</th><th>Role</th>'
   +'<th>Department</th><th>WorkingDays</th><th>PresentDays</th><th>AdvancePending</th>'
   +'<th>AdvanceDebited</th><th>BasicSalary</th><th>NetSalary</th>'
   //+'<th style="width:10000px">From Date</th>';
   +'<th style="width:10000px">From Date</th>'
   +'<th style="width:10000px">To Date</th>'
   +'<th style="width:10000px">Date</th></tr></thead>';
  

          $.each(data, function (i, item) {

            successDataArray.push(item);
            organizationPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; text-align: center;"><tr><td>'+item.employeeId+'</td>'
            +'<td><a class="namelink">'+item.name+'</a></td><td>'+item.role+'</td><td>'+item.department+'</td>'
            +'<td>'+item.companyWorkingDays+'</td><td>'+item.present+'</td>'
            +'<td>'+item.grantedAdvance+'</td><td>'+item.advanceDebit+'</td>'
            +'<td>'+ item.salary+'</td><td>'+item.netSalary+'</td>'
            +'<td>'+item.fromDate+'</td><td>'+item.toDate+'</td>'
            +'<td class="date" style="width:50px">'+item.date+'</td>'
            +'<td class="ivalue">'+i+'</td></tr></tbody>';

          });
          $("#payrollTable").append(organizationPaySlip);
          $(".ivalue").hide();
          $(".date").css("width" ,"50px");
        }

      }
    });
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
            padding: "3px 7px 3px 7px",
            marginBottom:"20px"
          }}>

          <a href="#" onClick={() => this.BackbtnFunc()}><i class="arrow left"></i></a></ul>

         <h3 className="centerAlign" style={{marginTop:"-10px", textAlign: "center" }}>PayRoll Management</h3>
      
         <div id='horMenu'>
          <ul id='horMenunew' style={{ backgroundColor: "#8811d6" }}>
          <li><a className="active" onClick={() => this.GeneratePaySlip()}><span class="glyphicon glyphicon-plus">Generate PaySlip</span></a></li>
               <li><a onClick={() => this.ViewPaySlip()}><span class="glyphicon glyphicon-minus">View PaySlip</span> </a></li>
               <li><a onClick={() => this.AdvanceReport()}><span class="glyphicon glyphicon-minus">Advance Report</span> </a></li>
          </ul>
        </div>

               {/*  <h2>REPORT</h2> */}

            <h3 className="centerAlign" style={{ marginTop: "50px", textAlign: "center" }}>Organization Pay Slip</h3>

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
            <li><a href="#" id="2" onClick={(e) => this.MonthlyFunc("02")}>February</a></li>
            <li><a href="#" id="3" onClick={(e) => this.MonthlyFunc("03")}>March </a></li>
            <li><a href="#" id="4" onClick={(e) => this.MonthlyFunc("04")}>April </a></li>
            <li><a href="#" id="5" onClick={(e) => this.MonthlyFunc("05")}>May</a></li>
            <li><a href="#" id="6" onClick={(e) => this.MonthlyFunc("06")}>June</a></li>
            <li><a href="#" id="7" onClick={(e) => this.MonthlyFunc("07")}>July</a></li>
            <li><a href="#" id="8" onClick={(e) => this.MonthlyFunc("08")}>August</a></li>
            <li><a href="#" id="9" onClick={(e) => this.MonthlyFunc("09")}>September</a></li>
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



       <div style= {{marginBottom:"10%"}}id="tableOverflow" >
          <table style={{ margin: "auto" }} className="table" id="payrollTable">
          </table>

        </div>


        <h3 align="center" id="nodata">No Data</h3>

      </div>

    );
  }

}


export default ViewIndividualPayroll;

