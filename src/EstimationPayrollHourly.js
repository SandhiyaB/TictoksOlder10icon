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



var i;
var currentRow;
var successDataArray = [];
var displayDate1="";

class EstimationPayrollHourly extends Component {

  constructor() {
    super()

    this.state = {

      salarySelectionOption: '',
      fromDate:'',
      toDate:'',
      displayDate1:'',

    };
  }

  componentDidMount() {

    var self = this;

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

   
  
        window.scrollTo(0, 0);
        var self = this;
        $('#toDate').datepicker({
          onSelect: function (date) {
            var dt = new Date(date);
            dt.setDate(dt.getDate() - 1);
            $("#fromDate").datepicker("option", "maxDate", dt);
           
            if(self.state.fromDate!=''){
            
                self.setState({
                    toDate: date,
                    displayDate1:'',
                  });

            self.GetData();
            }else{
                self.setState({
                    toDate: '',
                  });
                confirmAlert({
                    title: 'Error',                        // Title dialog
                    message: 'Kindly Select FromDate To Proceed',               // Message dialog
                    confirmLabel: 'Ok',                           // Text button confirm
    
                })
            }
          },
          dateFormat: 'yy-mm-dd',
          minDate: '-3M',
          maxDate: 'M',
          numberOfMonths: 1
        });
        $('#fromDate').datepicker({
          onSelect: function (date) {
            var dt = new Date(date);
            dt.setDate(dt.getDate() + 1);
            $("#toDate").datepicker("option", "minDate", dt);
            self.setState({
              fromDate: date,
            });
          },
          dateFormat: 'yy-mm-dd',
          minDate: '-3M',
          maxDate: 'M',
          numberOfMonths: 1
        });
    
      
 


  }

  BackbtnFunc() {

    ReactDOM.render(
      <Router>
        <div>
          <Route path="/" component={EmployeeMenuHeader} />
          <Route path="/" component={ReportMenuPage} />
          <Route path="/" component={FooterText} />
        </div>
      </Router>,
      document.getElementById('root'));
    registerServiceWorker();
  }


  GetData(){
      
    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
    this.state.companyId = companyId;
    this.setState({
      companyId: companyId,
    });


    var self=this;

      $.ajax({
        type: 'POST',
        data: JSON.stringify({
          schoolId: this.state.companyId,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
        }),
         url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/EstimateSalaryHourlyReport",
        //url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/EstimateSalaryHourlyReport",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        crossDomain: true,
  
        success: function (data, textStatus, jqXHR) {
  
          console.log("DATA LENGTH :", data);
  
          if (data.length == 0) {
            // alert("data is zero");
            $("#nodata").show();
            $("#payrollTable").hide();
          } else {
            $("#nodata").hide();
            $("#payrollTable").empty();
            $("#payrollSummaryTable").empty();
            $("#payrollTable").show();
  
            var organizationPaySlip;
  
            /*  $("#searchbar").show();
              $("#searchbar").append(' <input style={{ color: "black" }} type="text" '
              +'id="myInput" class="myInput "placeholder="Search.." title="Type in a name" />' );
           */
  
            $("#myInput").show();
  
            organizationPaySlip += '<thead className="headcolor" style="color: white ;  text-align: center; '
              + 'background-color: #486885;" ><tr><th>Id</th><th>Name</th><th>Role</th>'
              + '<th>Dept</th><th>Present</th>'
              +'<th>Absent</th>'
              + '<th>P/H</th><th>Holidays</th><th>TotalWrkHr</th>'
              + '<th>BasicSal</th><th>NetSal</th>'
              + '</tr></thead>';
  
            console.log("SAL DATA :", data[data.length - 1].salarySelection);
            self.state.salarySelectionOption = data[data.length - 1].salarySelection;

            self.state.displayDate1=self.state.fromDate +" to "+ self.state.toDate ;

            self.setState({
              salarySelectionOption: self.state.salarySelectionOption,
              displayDate1:self.state.displayDate1,
            })

            var estimatedAmt = 0;
  
            
              for (var z = 0; z < data.length - 1; z++) {
  
                var HrSalary = "-";
                var salary = "-";
                var totalWrkHr="-";

                if (data[z].salary != null && data[z].salary != "NULL" && data[z].totalwrkhr != 0 && data[z].totalwrkhr !=null) {
                  salary = data[z].salary;
                  totalWrkHr=data[z].totalwrkhr;

                  var perScndSalary=Number(salary)/3600 ;
                  console.log("PER SEC AMOUNT :",perScndSalary);
                  var hms =data[z].totalwrkhr;   // your input string
                  var a = hms.split(':'); // split it at the colons
                  
                  // minutes are worth 60 seconds. Hours are worth 60 minutes.
                  var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
                  
                  console.log("TOTAL SEC :",seconds);
                  var HrSalary = Number(perScndSalary) * Number(seconds);
                  console.log("PER DAY SALARY" + HrSalary);
  
                  HrSalary = Number(HrSalary).toFixed(2);
                  estimatedAmt = Number(estimatedAmt) + Number(HrSalary);
                  estimatedAmt = Number(estimatedAmt).toFixed(2);
  
                }
  
  
                // successDataArray.push(item);
                organizationPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; '
                  + 'text-align: center;"><tr><td>' + data[z].employeeId + '</td>'
                  + '<td>' + data[z].name + '</td><td>' + data[z].role + '</td>'
                  +'<td>' + data[z].department + '</td>'
                  + '<td>' + data[z].workingDays + '</td>'
                  +'<td>'+data[z].absentCount+'</td>'
                  + '<td>' + data[z].presentAgainstHoliday + '</td>'
                  +'<td>' + data[z].holidayDays + '</td>'
                  +'<td>'+totalWrkHr+'</td>'
                  + '<td>' + salary + '</td><td>' + HrSalary + '</td>'
                  + '</tr></tbody>';
  
  
              }
  
            var estimatedtab = '<table style="margin=auto;"  className="table">'
              + '<tbody><tr><td style="font-weight:bold;" >SalaryOption:</td><td style="width: 187px;">' + self.state.salarySelectionOption + '</td>'
              + '<td style="font-weight:bold;" >Estimated Amount:</td><td>' + estimatedAmt + '</td></tr></tbody></table>';
  
            $("#payrollTable").append(organizationPaySlip);
            $("#payrollSummaryTable").append(estimatedtab);
            $(".ivalue").hide();
            $(".date").css("width", "50px");
            //  console.log("DATA IN 2nd ARRAY ",successDataArray);
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
         
          }}>

          <a href="#" onClick={() => this.BackbtnFunc()}><i class="arrow left"></i></a></ul>

        <h3 className="centerAlign" style={{ marginTop: "-10px", textAlign: "center" }}>PayRoll Management</h3>

       
        <h3 className="centerAlign" style={{ marginTop: "50px", textAlign: "center" }}>Estimate Hourly Salary Report</h3>

      <table style={{marginBottom:"5%"}}>
          <tr>
          <td>
            <label htmlFor="fromDate" style={{ paddingRight: '50px' }}> From:</label>
            <input
              style={{ width: '50%' }}
              type="text"
              value={this.state.fromDate}
              id="fromDate" name="fromDate"
              onChange={this.handleUserInput} />
          </td>
          <td>
            <label
              htmlFor="toDate"
              style={{ marginRight: '70px' }}> To:</label>
            <input
              style={{ width: '50%' }}
              type="text"
              value={this.state.toDate}
              id="toDate" name="toDate"
              onChange={this.handleUserInput} />
       
          </td>
          </tr>
          </table>
          

        <div>
          <input style={{ color: "black" }} type="text" id="myInput" class="myInput " placeholder="Search.." title="Type in a name" />
        </div>
        <h4 className="centerAlign" style={{ marginTop: "50px", textAlign: "center" }}>{this.state.displayDate1}</h4>

        <br />
        <br />

        <div id="tableOverflow" >
          <div id="payrollSummaryTable">
          </div>

        </div>

        <br />
        <br />
        <div style={{marginBottom:"5%"}} id="tableOverflow" >
          <table style={{ margin: "auto" }} className="table" id="payrollTable">
          </table>

        </div>


        <h3 id="nodata">No Data</h3>

      </div>

    );
  }

}


export default EstimationPayrollHourly;

