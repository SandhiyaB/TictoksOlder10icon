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
import moment from 'moment';

var i;
var currentRow;
var successDataArray = [];
var displayDate1 = "";
class EstimationPayroll extends Component {

    constructor() {
        super()

        this.state = {

            salarySelectionOption: '',
            salOption: '',
            estimatedAmt: 0,
            totalCount: 0,
            eligibleCount: 0

        };
    }

    componentDidMount() {

        var self = this;

        window.scrollTo(0, 0);
        $("#payrollTable").hide();
        $("#nodata").hide();
        $("#myInput").hide();
        // $("#searchbar").hide();
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        i = currentMonth + 2;
        this.MonthlyFunc(currentMonth + 1);


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


    dropdownFunc() {
        $('#1').hide(); $('#2').hide(); $('#3').hide();
        $('#4').hide(); $('#5').hide(); $('#6').hide();
        $('#7').hide(); $('#8').hide(); $('#9').hide();
        $('#10').hide(); $('#11').hide(); $('#12').hide();

        var today = new Date();
        var month = today.getMonth() + 1;
        if (month == "0") {
            month = 12;
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
        // alert("SELECTED MONTH" + value);
        var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
        this.state.companyId = companyId;
        this.setState({
            companyId: companyId,
        });
        var self = this;
        var monthName = value;
        if (monthName == "12") {
          //  alert("IF PART FOR MONTH");
            monthName = 11;
        } else {
           // alert("ELSE PART FOR MONTH");
            monthName = Number(value) - 1;
        }

        var formattedMonth = moment().month(monthName).format('MMMM');
        console.log(formattedMonth)
        this.state.monthName = formattedMonth;

        if (value == ("01") || value == ("03") || value == ("05") || value == ("07") ||
            value == ("08") || value == ("10") || value == ("12")) {
            //alert("JAN,MAR,MAY,JUL,AUG,OCT,DEC");
            var j = (i - 1);
            if (j == val1) {

                this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
                this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
                this.state.month = value;

            } else {

                this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
                this.state.toDate = today.getFullYear() + '-' + value + '-' + '31';
                this.state.month = value;
            }
            this.state.toDate1 = today.getFullYear() + '-' + value + '-' + '31';
            this.setState({
                fromDate: this.state.fromDate,
                toDate: this.state.toDate,
                month: this.state.month,
                toDate1: this.state.toDate1,
            });

            var today = new Date();
            var month = val1;
            var days1 = new Date(today.getFullYear(), month, 0).getDate();
            console.log("days", days1);

        }
        else if (value == ("04") || value == ("06") || value == ("09") || value == ("11")) {
            //alert("APR,JUN,SEP,NOV");

            var j = (i - 1);
            if (j == val1) {
                this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
                this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
                this.state.month = value;
            } else {

                this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
                this.state.toDate = today.getFullYear() + '-' + value + '-' + '30';
                this.state.month = value;
            }
            this.state.toDate1 = today.getFullYear() + '-' + value + '-' + '30';
            this.setState({
                fromDate: this.state.fromDate,
                toDate: this.state.toDate,
                month: this.state.month,
                toDate1: this.state.toDate1,
            });

            var today = new Date();
            var month = val1;
            var days1 = new Date(today.getFullYear(), month, 0).getDate();
            console.log("days", days1);




        } else if (value == ("02")) {
            //alert("FEBURARY");

            if (today.getFullYear() % 100 == 0 && today.getFullYear() % 400 == 0 && today.getFullYear() % 4 == 0) {
                var j = (i - 1);
                if (j == val1) {
                    this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
                    this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
                    this.state.month = value;
                } else {

                    this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
                    this.state.toDate = today.getFullYear() + '-' + value + '-' + '29';
                    this.state.month = value;
                }
                this.state.toDate1 = today.getFullYear() + '-' + value + '-' + '29';
                this.setState({
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    month: this.state.month,
                    toDate1: this.state.toDate1,
                });

            }
            else {

                var j = (i - 1);
                if (j == val1) {
                    this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
                    this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
                    this.state.month = value;
                } else {
                    this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
                    this.state.toDate = today.getFullYear() + '-' + value + '-' + '28';
                    this.state.month = value;
                }
                this.state.toDate1 = today.getFullYear() + '-' + value + '-' + '28';
                this.setState({
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    month: this.state.month,
                    toDate1: this.state.toDate1,
                });

            }

            var today = new Date();
            var month = val1;
            var days1 = new Date(today.getFullYear(), month, 0).getDate();
            console.log("days", days1);


        }

        this.state.displaydate1 = this.state.fromDate + "-" + this.state.toDate;
        displayDate1 = this.state.fromDate + "-" + this.state.toDate;
        this.setState({
            displaydate1: this.state.displaydate1,
        });



        $.ajax({
            type: 'POST',
            data: JSON.stringify({
                schoolId: this.state.companyId,
                month: value,
                fromDate: this.state.fromDate,
                toDate: this.state.toDate,
                toDate1: this.state.toDate1,
            }),
            //  url: "http://localhost:8080/EmployeeAttendenceAPI/payslip/EstimateSalaryReport",
            url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/EstimateSalaryReport",

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
                  //  $("#payrollSummaryTable").empty();
                    $("#payrollTable").show();

                    var organizationPaySlip;

                    /*  $("#searchbar").show();
                      $("#searchbar").append(' <input style={{ color: "black" }} type="text" '
                      +'id="myInput" class="myInput "placeholder="Search.." title="Type in a name" />' );
                   */

                    $("#myInput").show();

                    organizationPaySlip += '<thead className="headcolor" style="color: white ;  text-align: center; '
                        + 'background-color: #486885;" ><tr><th>Id</th><th>Name</th><th>Role</th>'
                        + '<th>Dept</th><th><p>Working</p><p>Days</p></th><th>Present</th><th>Absent</th>'
                        + '<th>P/H</th><th>Holidays</th>'
                        + '<th><p>Basic</p><p>Salary</p></th><th><p>Net</p><p>Salary</p></th>'
                        + '</tr></thead>';

                    console.log("SAL DATA :", data[data.length - 1].salarySelection);
                    self.state.salarySelectionOption = data[data.length - 1].salarySelection;
                    self.setState({
                        salarySelectionOption: self.state.salarySelectionOption,
                    })
                    var estimatedAmt = 0;
                    var totalCount = 0;
                    var eligibleCount = 0;
                    if (self.state.salarySelectionOption == "daysperMonth") {

                        /*  var today = new Date();
                          var month = today.getMonth() + 1;
                          var days1 = new Date(today.getFullYear(), month, 0).getDate();
                          console.log("days", days1);
              */
                        var date1 = new Date(self.state.fromDate);
                        var date2 = new Date(self.state.toDate);
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        //alert("DIFF IN DAYS :"+diffDays);
                        /*  if(month!=value){
                              diffDays=Number(diffDays)+1;
                          }
                          */
                        diffDays = Number(diffDays) + 1;
                        self.state.days = diffDays;

                        self.setState({
                            days: self.state.days
                        })

                        for (var z = 0; z < data.length - 1; z++) {

                            var perMonthSalary = "-";
                            var salary = "-";
                            if (data[z].employeeId != "0000") {
                                totalCount++;
                               if(data[z].salary != null && data[z].salary != "NULL" ){
                                salary = data[z].salary;
                               }
                                if (data[z].salary != null && data[z].salary != "NULL" && data[z].workingDays != 0) {
                                    salary = data[z].salary;
                                    var perDaySalary = Number(salary) / Number(days1);
                                    console.log("PER DAY SALARY" + perDaySalary);

                                    perMonthSalary = Number(perDaySalary) * (Number(data[z].workingDays) + Number(data[z].holidayDays));
                                    console.log("PER MONTH SALARY" + perMonthSalary);
                                    perMonthSalary = Number(perMonthSalary).toFixed(2);
                                    estimatedAmt = Number(estimatedAmt) + Number(perMonthSalary);
                                    estimatedAmt = Number(estimatedAmt).toFixed(2);
                                    eligibleCount++;
                                }


                                // successDataArray.push(item);
                                organizationPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; '
                                    + 'text-align: center;"><tr><td>' + data[z].employeeId + '</td>'
                                    + '<td>' + data[z].name + '</td><td>' + data[z].role + '</td><td>' + data[z].department + '</td>'
                                    + '<td>' + days1 + '</td><td>' + data[z].workingDays + '</td>'
                                    +  '<td>'+data[z].absentCount+'</td>'
                                    + '<td>' + data[z].presentAgainstHoliday + '</td><td>' + data[z].holidayDays + '</td>'
                                    + '<td>' + salary + '</td><td>' + perMonthSalary + '</td>'
                                    + '</tr></tbody>';


                            }
                        }

                    } else if (self.state.salarySelectionOption == "workingDays") {

                        for (var z = 0; z < data.length - 1; z++) {

                            var perMonthSalary = "-";
                            var salary = "-";
                            if (data[z].employeeId != "0000") {
                                totalCount++;
                                if (data[z].salary != null && data[z].salary != "NULL") {
                                    salary = data[z].salary;
                                    var perDaySalary = Number(salary) / Number(data[z].companyWorkingDays);
                                    console.log("PER DAY SALARY" + perDaySalary);

                                    var perMonthSalary = Number(perDaySalary) * Number(data[z].workingDays);
                                    console.log("PER MONTH SALARY" + perMonthSalary);
                                    perMonthSalary = Number(perMonthSalary).toFixed(2);
                                    estimatedAmt = Number(estimatedAmt) + Number(perMonthSalary);
                                    estimatedAmt = Number(estimatedAmt).toFixed(2);
                                    eligibleCount++;
                                }

                                organizationPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; '
                                    + 'text-align: center;"><tr><td>' + data[z].employeeId + '</td>'
                                    + '<td>' + data[z].name + '</td><td>' + data[z].role + '</td><td>' + data[z].department + '</td>'
                                    + '<td>' + data[z].companyWorkingDays + '</td><td>' + data[z].workingDays + '</td>'
                                    +'<td>'+data[z].absentCount+'</td>'
                                    + '<td>' + data[z].presentAgainstHoliday + '</td><td>' + data[z].holidayDays + '</td>'
                                    + '<td>' + salary + '</td><td>' + perMonthSalary + '</td>'
                                    + '</tr></tbody>';

                            }


                        }
                    }




                    /*   for(var z=0;z<data.length-1;z++){
                      // successDataArray.push(item);
                       organizationPaySlip += '<tbody id= "myTable" ><tr  style="color: black ; '
                       +'text-align: center;"><tr><td>'+data[z].employeeId+'</td>'
                       +'<td>'+data[z].name+'</td><td>'+data[z].role+'</td><td>'+data[z].department+'</td>'
                       +'<td>'+data[z].companyWorkingDays+'</td><td>'+data[z].workingDays+'</td>'
                       +'<td>'+data[z].presentAgainstHoliday+'</td><td>'+data[z].holidayDays+'</td>'
                       +'<td>'+ data[z].salary+'</td><td>'+data[z].netSalary+'</td>'
                       +'</tr></tbody>';
           
                  
                       }
                       //arr[arr.length - 1]
                      
           */

                    /*var estimatedtab='<table style="margin=auto;"  className="table">'
                    +'<thead><th  style="width: 187px;" >Estimated Amount</th><th>'+estimatedAmt+'</th></thead></table>';
                      */
                     var salOption;
                     if (self.state.salarySelectionOption=="daysperMonth") {
                         salOption = "Days Per Month";
                     } else {
                         salOption = "Working Days";
                     }
                    var estimatedtab = '<table style="margin=auto;"  className="table">'
                        + '<tbody><tr><td style="font-weight:bold;" >SalaryOption:</td><td style="width: 187px;">' + self.state.salarySelectionOption + '</td>'
                        + '<td style="font-weight:bold;" >Estimated Amount:</td><td>' + estimatedAmt + '</td></tr></tbody></table>';
                        self.state.salOption = salOption;
                        self.state.estimatedAmt = estimatedAmt;
                        self.state.eligibleCount = eligibleCount;
                        self.state.totalCount = totalCount;
                        self.setState({
                            salOption: salOption,
                            estimatedAmt: estimatedAmt,
                            eligibleCount: eligibleCount,
                            totalCount: totalCount,
                        });
                        console.log()
                    $("#payrollTable").append(organizationPaySlip);
                 //   $("#payrollSummaryTable").append(estimatedtab);
                    $(".ivalue").hide();
                    $(".date").css("width", "50px");
                    //  console.log("DATA IN 2nd ARRAY ",successDataArray);
                }

            }
        });
    }


    render() {
        return (
            <div className="container" >
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

                <h3 className="centerAlign" style={{ marginTop: "-10px", textAlign: "center" }}>Estimate Salary Report</h3>

                <div class="btn-group" style={{ marginBottom: "5%" }}>
                    <button type="button" onClick={() => this.dropdownFunc()} class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Select Month</button>



                    <ul class="dropdown-menu" id="dropdown"
                        style={{
                            marginBottom: "30px!important",
                            padding: " 0px auto",
                            textAlign: "center"
                        }}
                        role="menu">
                        <li><a href="#" id="1" onClick={(e) => this.MonthlyFunc("01")}>January</a></li>
                        <li><a href="#" id="2" onClick={(e) => this.MonthlyFunc("02")}>Feburuary</a></li>
                        <li><a href="#" id="3" onClick={(e) => this.MonthlyFunc("03")}>March </a></li>
                        <li><a href="#" id="4" onClick={(e) => this.MonthlyFunc("04")}>April </a></li>
                        <li><a href="#" id="5" onClick={(e) => this.MonthlyFunc("05")}>May</a></li>
                        <li><a href="#" id="6" onClick={(e) => this.MonthlyFunc("06")}>June</a></li>
                        <li><a href="#" id="7" onClick={(e) => this.MonthlyFunc("07")}>July</a></li>
                        <li><a href="#" id="8" onClick={(e) => this.MonthlyFunc("08")}>August</a></li>
                        <li><a href="#" id="9" onClick={(e) => this.MonthlyFunc("09")}>September</a></li>
                        <li><a href="#" id="10" onClick={(e) => this.MonthlyFunc("10")}>october</a></li>
                        <li><a href="#" id="11" onClick={(e) => this.MonthlyFunc("11")}>November</a></li>
                        <li><a href="#" id="12" onClick={(e) => this.MonthlyFunc("12")}>December</a></li>

                    </ul>
                </div>

                {/* <div id="tableOverflow">
 <table id="payrollTable">

 </table>
 </div> */}

                <div>
                    <input style={{ color: "black" }} type="text" id="myInput" class="myInput " placeholder="Search.." title="Type in a name" />
                </div>


                <h3 className="centerAlign" style={{ marginTop: "15px", textAlign: "center" }}>{this.state.monthName}</h3>
                <h4 className="centerAlign" style={{ marginTop: "15px", textAlign: "center" }}>{displayDate1}</h4>

                <br />
                <br />

                <div>
                    <div id="payrollSummaryTable">

                        <div className="row ">
                            <div className="col-12 ">
                                <div className="col-lg-6 col-xl-12 col-sm-12 col-md-6 ">
                                    <div className="col-lg-6 col-xl-12 col-sm-12 col-md-6  ">
                                        <label htmlFor="employeeId">Salary Option : </label>
                                        <span className="spanSalaryOption" style={{ paddingLeft: "7px" }}>{this.state.salOption}</span>{/* </div> */}
                                    </div>
                                    <div className="col-lg-6 col-xl-12 col-sm-12 col-md-6 ">
                                        <label htmlFor="employeeId">Estimated Amount: </label>
                                        <span className="spanEstimateAmount" style={{ paddingLeft: "7px" }}>{this.state.estimatedAmt}</span>{/* </div> */}
                                    </div>
                                </div>
                                <div className="col-lg-6 col-xl-12 col-sm-12 col-md-6 ">
                                    <div className="col-lg-6 col-xl-12 col-sm-12 col-md-6  ">
                                        <label htmlFor="employeeId">Eligible Employee : </label>
                                        <span className="spanEligibleAmount" style={{ paddingLeft: "7px" }}>{this.state.eligibleCount}</span>{/* </div> */}
                                    </div>
                                    <div className="col-lg-6 col-xl-12 col-sm-12 col-md-6  ">

                                        <label htmlFor="employeeId">Total Employee : </label>
                                        <span className="spanTotalAmount" style={{ paddingLeft: "7px" }}>{this.state.totalCount}</span>{/* </div> */}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <br />
                <br />
                <div id="tableOverflow" style={{ marginBottom: "7%" }} >
                    <table style={{ margin: "auto" }} className="table" id="payrollTable">
                    </table>

                </div>


                <h3 id="nodata">No Data</h3>

            </div>

        );
    }

}


export default EstimationPayroll;