import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './IndividualPrintpayslip.css';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import DetailedPayrollSlip from './DetailedPayrollSlip';
import FooterText from './FooterText';
import EmployeeMenuHeader from './EmployeeMenuHeader';
//import Website from './Website';
import CryptoJS from 'crypto-js';
import $ from 'jquery';
import ViewIndividualPayroll from './ViewIndividualPayroll';

var additionAmount = 0;
var reductionAmount = 0;

class IndividualPrintpayslip extends Component {
    constructor(printData) {
        super()
        var companyName = CryptoJS.AES.decrypt(localStorage.getItem('CompanyName'), "shinchanbaby").toString(CryptoJS.enc.Utf8);
        this.state = {

            employeeId: '',
            companyName: companyName,
            employeeName: '',
            advanceGranted: '',
            advanceDebited: '',
        };
    }
    BackbtnFunc() {

        ReactDOM.render(
            <Router>
                <div>
                    <Route path="/" component={EmployeeMenuHeader} />
                    <Route path="/" component={ViewIndividualPayroll} />
                    <Route path="/" component={FooterText} />
                </div>
            </Router>,
            document.getElementById('root'));

    }

    componentDidMount() {
        window.scroll(0, 0);

        var additionNames = [];
        var reductionNames = [];
        var additionAmountArray = [];
        var reductionAmountArray = [];
       
        additionNames = this.props.data.additionCategoryName.split(",");
        reductionNames = this.props.data.reductionCategoryName.split(",");
        additionAmountArray = this.props.data.additionCategoryAmount.split(",");
        reductionAmountArray = this.props.data.reductionCategoryAmount.split(",");
          var allowencesAmount = "";
        $.each(additionAmountArray, function (i, item) {
            additionAmount += Number(additionAmountArray[i]);
            allowencesAmount += '<p><strong><i class="fa fa-inr"></i> ' + additionAmountArray[i] + '/-</strong></p>'
        });
        $(".allowencesamount").append(allowencesAmount);


        var deductionAmount = "";
        $.each(reductionAmountArray, function (i, item) {
            reductionAmount += Number(reductionAmountArray[i]);
            deductionAmount += '<p><strong><i class="fa fa-inr"></i> ' + reductionAmountArray[i] + '/-</strong></p>'
        });
        $(".deductionamount").append(deductionAmount);


        var allowencesName = "";
        $.each(additionNames, function (i, item) {
            allowencesName += '<p><strong>' + additionNames[i] + ' </strong></p>';
        });
        $(".allowencesdata").append(allowencesName);

        var deductionName = "";
        $.each(reductionNames, function (i, item) {
            deductionName += '<p><strong>' + reductionNames[i] + ' </strong></p>';
        });
        $(".deductiondata").append(deductionName);


        //COMPANY INFO:
        this.state.salaryDate = this.props.data.date;
        this.state.fromDate = this.props.data.fromDate;
        this.state.toDate = this.props.data.toDate;
        this.state.companyWorkingDays = this.props.data.companyWorkingDays;
        this.state.holidayDays = this.props.data.holidayDays;

        //EMPLOYEE DETAILS:        
        this.state.employeeId = this.props.data.employeeId;
        this.state.name = this.props.data.name;
        this.state.address = this.props.data.address;
        this.state.role = this.props.data.role;
        this.state.department = this.props.data.department;
        this.state.shift = this.props.data.shift;
        this.state.type = this.props.data.type;

        //EMPLOYEE DAYS INFO:
        this.state.present = this.props.data.present;
        this.state.absent = this.props.data.absent;
        this.state.presentAgainstHoliday = this.props.data.presentAgainstHoliday;

        //EMPLOYEE SALARY INFO:
        this.state.salary = this.props.data.salary;
        this.state.presentAgainstHolidaySalary = this.props.data.presentAgainstHolidaySalary;

        //EMPLOYEE TOTAL ALLOWENCES AND DEDUCTION AMOUNT:        
        this.state.additionAmount = additionAmount;
        this.state.reductionAmount = reductionAmount;

        //EMPLOYEE ADVANCE INFO:       
        this.state.advanceCredited = this.props.data.advance;
        this.state.advancePending = this.props.data.grantedAdvance;
        this.state.advanceDebited = this.props.data.advanceDebit;

        //EMPLOYEE TAX INFO:        
        this.state.tax = this.props.data.tax;

        //EMPLOYEE NET SALARY INFO:        
        this.state.netSalary = this.props.data.netSalary;


        this.setState({

            companyName: this.state.companyName,

            //COMPANY INFO:
            salaryDate: this.state.salaryDate,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            companyWorkingDays: this.state.companyWorkingDays,
            holidayDays: this.state.holidayDays,

            //EMPLOYEE DETAILS:        
            employeeId: this.state.employeeId,
            name: this.state.name,
            address: this.state.address,
            role: this.state.role,
            department: this.state.department,
            shift: this.state.shift,
            type: this.state.type,

            //EMPLOYEE DAYS INFO:
            present: this.state.present,
            absent: this.state.absent,
            presentAgainstHoliday: this.state.presentAgainstHoliday,

            //EMPLOYEE SALARY INFO:
            salary: this.state.salary,
            presentAgainstHolidaySalary: this.state.presentAgainstHolidaySalary,

            //EMPLOYEE TOTAL ALLOWENCES AND DEDUCTION AMOUNT:        
            additionAmount: this.state.additionAmount,
            reductionAmount: this.state.reductionAmount,

            //EMPLOYEE ADVANCE INFO:       
            advanceCredited: this.state.advanceCredited,
            advancePending: this.state.advancePending,
            advanceDebited: this.state.advanceDebited,

            //EMPLOYEE TAX INFO:        
            tax: this.state.tax,

            //EMPLOYEE NET SALARY INFO:        
            netSalary: this.state.netSalary,


        })

    }
    render() {
        return (

            <div>
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

                <div class="container" style={{ border: "3px solid rgb(204, 204, 204)" }} >


                    <div style={{ textAlign: "center", borderBottom: "11px solid #ccc", paddingBottom: "20px" }}>
                        <div id="newtitlepayslip">{this.state.companyName}</div>
                        {/*    <h4 style={{ wordWrap: "break-word", fontWeight: "400" }}>Address</h4>
                    <h4 style={{ margin: "0px" }} >chennai</h4>
                    <h4 style={{ margin: "0px" }}>9176172342</h4>
                */}
                    </div>


                    <div style={{ border: "3px solid #ccc", marginTop: "0px " }}>
                        <div className="row" style={{ marginLeft: "0px!important", marginRight: "0px!important" }}>

                            <div class="col-6"
                                style={{
                                    marginLeft: " 8%",
                                    float: "left"
                                }} >
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >Company Working Days:</label>
                                    <span className="span_emp_valuespayslip">{this.state.companyWorkingDays}</span>

                                </div>
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >Holidays :</label>
                                    <span className="span_emp_valuespayslip">{this.state.holidayDays}</span>

                                </div>
                            </div>
                            <div class="col-6" style={{
                                marginRight: " 8%",
                                float: "right"
                            }} >

                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >Date Of Payment :</label>
                                    <span className="span_emp_valuespayslip">{this.state.salaryDate}</span>

                                </div>
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >Payment Period:</label>
                                    <span className="span_emp_valuespayslip">{this.state.fromDate}  To  </span>
                                    <span className="span_emp_valuespayslip">{this.state.toDate}</span>

                                </div>
                            </div>

                        </div>
                    </div>
                    <div style={{ border: "3px solid #ccc", marginTop: "0px " }}>
                        <div className="row" style={{ marginLeft: "0px!important", marginRight: "0px!important" }}>
                            <h4 style={{
                                paddingLeft: "25px",
                                fontWeight: "600"
                            }}> Employee Details</h4>
                            <div class="col-6"
                                style={{
                                    marginLeft: " 8%",
                                    float: "left"
                                }} >
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >EmployeeID :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.employeeId}</span>

                                </div>
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >Name :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.name}</span>

                                </div>
                                <div class="emp_detailspayslip" >
                                    <label htmlFor="employeeId"
                                    >Address :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.address}</span>

                                </div>
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >Role :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.role}</span>

                                </div>
                                <div class="emp_detailspayslip" >
                                    <label htmlFor="employeeId"
                                    >Department :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.department}</span>

                                </div>
                                <div class="emp_detailspayslip" >
                                    <label htmlFor="employeeId"
                                    >Shift :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.shift}</span>

                                </div>
                                <div class="emp_detailspayslip" >
                                    <label htmlFor="employeeId"
                                    >Type :</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.type}</span>

                                </div>


                            </div>
                            <div class="col-6" style={{
                                marginRight: " 8%",
                                float: "right"
                            }} >
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >No of Days Present:</label>
                                    {/* <div className="span_emp_valuespayslip"> */}<span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.present}</span>{/* </div> */}
                                </div>
                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >No of Days Absent:</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.absent}</span>

                                </div>

                                <div class="emp_detailspayslip">
                                    <label htmlFor="employeeId"
                                    >No of P/H Days:</label>
                                    <span className="span_emp_valuespayslip" style={{ paddingLeft: "7px" }}>{this.state.presentAgainstHoliday}</span>

                                </div>
                            </div>

                        </div>
                    </div>


                    <div>
                        <table class="table table-bordered">
                            <thead style={{ fontSize: "large", backgroundColor: "#5a646d", color: "white" }}>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="col-md-9">Basic Pay</td>
                                    <td class="col-md-3"><i class="fa fa-inr"></i> {this.state.salary}</td>
                                </tr>
                                <tr>
                                    <td class="col-md-9">P/H Pay</td>
                                    <td class="col-md-3"><i class="fa fa-inr"></i> {this.state.presentAgainstHolidaySalary}</td>
                                </tr>
                                < tr>
                                    <td class="text-right">
                                        <p class="text-center">
                                            <strong>Allowance </strong>
                                        </p>

                                        <td class="allowencesdata">
                                            {/*  allowencesdata
                                        <p>
                                            <strong>Late Fees: </strong>
                                        </p>
                                        <p>
                                            <strong>Payable Amount: </strong>
                                        </p>
                                        <p>
                                            <strong>Balance Due: </strong>
                                        </p>
                                  */}
                                        </td>
                                    </td>

                                    <td class="allowencesamount">
                                        <p>
                                            <strong>&nbsp; </strong>
                                        </p>
                                        {/*  allowencesamount
                                    <p>
                                        <strong><i class="fa fa-inr"></i> 500/-</strong>
                                    </p>
                                    <p>
                                        <strong><i class="fa fa-inr"></i> 1300/-</strong>
                                    </p>
                                    <p>
                                        <strong><i class="fa fa-inr"></i> 9500/-</strong>
                                    </p>
                                  */}
                                    </td>


                                </tr>
                                <tr>
                                    <td class="col-md-9">Total Allowance</td>
                                    <td class="col-md-3"><i class="fa fa-inr"></i> {this.state.additionAmount}/-</td>
                                </tr>

                                < tr>
                                    <td class="text-right">
                                        <p class="text-center">
                                            <strong>Deductions </strong>
                                        </p>

                                        <td class="deductiondata">
                                            {/*  <p>
                                            <strong>Late Fees: </strong>
                                        </p>
                                        <p>
                                            <strong>Payable Amount: </strong>
                                        </p>
                                        <p>
                                            <strong>Balance Due: </strong>
                                      </p> */}
                                        </td>
                                    </td>
                                    <td class="deductionamount">
                                        <p>
                                            <strong>&nbsp; </strong>
                                        </p>
                                        {/*    <p>
                                        <strong>&nbsp; </strong>
                                    </p>
                                    <p>
                                        <strong><i class="fa fa-inr"></i> 500/-</strong>
                                    </p>
                                    <p>
                                        <strong><i class="fa fa-inr"></i> 1300/-</strong>
                                    </p>
                                    <p>
                                        <strong><i class="fa fa-inr"></i> 9500/-</strong>
                                    </p> */}
                                    </td>


                                </tr>
                                <tr>
                                    <td class="col-md-9">Total Deductions</td>
                                    <td class="col-md-3"><i class="fa fa-inr"></i> {this.state.reductionAmount}/-</td>
                                </tr>


                                <tr>
                                    <td class="text-right">
                                        <p>
                                            <strong>Advance Credited </strong>
                                        </p>
                                        <p>
                                            <strong>Advance Pending </strong>
                                        </p>
                                        <p>
                                            <strong>Advance Debited </strong>
                                        </p>
                                        <p>
                                            <strong>Tax </strong>
                                        </p>
                                    </td>
                                    <td>
                                        <p>
                                            <strong><i class="fa fa-inr"></i> {this.state.advanceCredited}/-</strong>
                                        </p>
                                        <p>
                                            <strong><i class="fa fa-inr"></i> {this.state.advancePending}/-</strong>
                                        </p>
                                        <p>
                                            <strong><i class="fa fa-inr"></i> {this.state.advanceDebited}/-</strong>
                                        </p>
                                        <p>
                                            <strong><i class="fa fa-inr"></i> {this.state.tax}/-</strong>
                                        </p>
                                    </td>
                                </tr>
                                <tr>

                                    <td class="text-right"><h2><strong>Net Salary </strong></h2></td>
                                    <td class="text-left text-danger"><h2><strong><i class="fa fa-inr"></i> {this.state.netSalary}/-</strong></h2></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div >

            </div >

        );
    }
}

export default IndividualPrintpayslip;