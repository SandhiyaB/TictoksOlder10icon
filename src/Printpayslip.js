import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './Printpayslip.css';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import DetailedPayrollSlip from './DetailedPayrollSlip';
import FooterText from './FooterText';
import EmployeeMenuHeader from './EmployeeMenuHeader';
//import Website from './Website';
import CryptoJS from 'crypto-js'; 
import $ from 'jquery';

var additionAmount=0;
var reductionAmount=0;

class Printpayslip extends Component {
    constructor(printData) {
        super()
        var companyName = CryptoJS.AES.decrypt(localStorage.getItem('CompanyName'), "shinchanbaby").toString(CryptoJS.enc.Utf8);    
       
        
        this.state = {
    
          employeeId: '',
          companyName:companyName,
          employeeName:'Sandhiya B',
          advanceGranted:'',
          advanceDebited:'',
        };
      }
    BackbtnFunc() {

        ReactDOM.render(
          <Router>
            <div>
              <Route path="/" component={EmployeeMenuHeader} />
              <Route path="/" component={DetailedPayrollSlip} />
              <Route path="/" component={FooterText} />
            </div>
          </Router>,
          document.getElementById('root'));
      
      }

      componentDidMount(){
          window.scroll(0,0);
          console.log("props data in list",this.props.data.detailedOrganizationPaySlipList);
          console.log("props data without list",this.props.data);
          console.log("props data in addition allowence list",this.props.data.additionAllowencesList);

          $.each(this.props.data.additionAllowencesList, function (i, item) {

            additionAmount += Number( item.additionCategoryAmount );

          });


          $.each(this.props.data.reductionAllowencesList, function (i, item) {

            reductionAmount += Number(item.reductionCategoryAmount );

          });




        this.state.companyName=this.props.data.companyName;
        this.state.address=this.props.data.address;
        this.state.city=this.props.data.city;
        this.state.phone=this.props.data.phone;

        this.state.employeeId=this.props.data.detailedOrganizationPaySlipList[0].employeeId;
        this.state.role=this.props.data.detailedOrganizationPaySlipList[0].role;
        this.state.department=this.props.data.detailedOrganizationPaySlipList[0].department;
        this.state.companyWorkingDays=this.props.data.detailedOrganizationPaySlipList[0].companyWorkingDays;
        this.state.salary=this.props.data.detailedOrganizationPaySlipList[0].salary;
        this.state.netSalary=this.props.data.detailedOrganizationPaySlipList[0].netSalary;
        this.state.advanceGranted=this.props.data.detailedOrganizationPaySlipList[0].advance;
        this.state.advanceDebited=this.props.data.detailedOrganizationPaySlipList[0].advanceDebit;
        this.state.name=this.props.data.detailedOrganizationPaySlipList[0].name;
        this.state.present=this.props.data.detailedOrganizationPaySlipList[0].present;
        this.state.salaryDate=this.props.data.detailedOrganizationPaySlipList[0].date;

       this.state.additionAmount=additionAmount;  
       this.state.reductionAmount=reductionAmount;

        this.state.taxAmt=this.props.data.detailedOrganizationPaySlipList[0].taxAmt;
        this.state.totalAllowance=this.props.data.detailedOrganizationPaySlipList[0].additionAmount;
        this.state.totalDeduction=this.props.data.detailedOrganizationPaySlipList[0].reductionAmount;
        this.state.totalSalary=this.props.data.detailedOrganizationPaySlipList[0].totalSalary;
     //   this.state.department=this.props.data.detailedOrganizationPaySlipList[0].department;
         this.setState({
            companyName:this.state.companyName,
            address:this.state.address,
            city:this.state.city,
            phone:this.state.phone,


            employeeId:this.state.employeeId,
            name:this.state.name,
            role:this.state.role,
            department:this.state.department,
            companyWorkingDays:this.state.companyWorkingDays,
            salary:this.state.salary,
            advanceGranted:this.state.advanceGranted,
            advanceDebited:this.state.advanceDebited,
            netSalary:this.state.netSalary,
            present:this.state.present,
            salaryDate:this.state.salaryDate,


            additionAmount:this.state.additionAmount,
            reductionAmount:this.state.reductionAmount,

            taxAmt:this.state.taxAmt,
            totalAllowance:this.state.totalAllowance,
            totalDeduction:this.state.totalDeduction,
            totalSalary:this.state.totalSalary,
           
            
        })
      
//alert("NET SALARY " +this.state.netSalary);


    }
    render() {
        return (


            <div class="container" >
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

                <div id="payslip">
                    <div style={{ textAlign: "center", borderBottom: "11px solid #ccc", paddingBottom: "20px" }}>
                        <div id="title">{this.state.companyName}</div>
                        <h4 style={{ wordWrap: "break-word", fontWeight: "400" }}>{this.state.address}</h4>
                        <h4 style={{ margin: "0px" }} >{this.state.city}</h4>
                        <h4 style={{ margin: "0px" }}>{this.state.phone}</h4>
                    </div>

                    <div style={{ border: "3px solid #ccc",marginTop:"10px " }}>
                        <div className="row" style={{ borderBottom: "3px solid #ccc", marginLeft: "0px!important", marginRight: "0px!important" }}>

                            <div class="col-6"
                                style={{
                                    marginLeft: " 8%",
                                    float: "left"
                                }} >
                                <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >Employee ID:</label>
                                    <span className="span_emp_values">{this.state.employeeId}</span>

                                </div>

                                {/*  <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >Employee ID:</label>
                                    <span className="span_emp_values">00000232121</span>
       </div> */}
                                <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >Name :</label>
                                    <span className="span_emp_values"> {this.state.name}</span>

                                </div>
                                <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >Role :</label>
                                    <span className="span_emp_values">{this.state.role}</span>

                                </div>
                                <div class="emp_details" >
                                    <label htmlFor="employeeId"
                                    >Department :</label>
                                    <span className="span_emp_values">{this.state.department}</span>

                                </div>
                            </div>

                            <div class="col-6" style={{
                                marginRight: " 8%",
                                float: "right"
                            }} >
                                <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >No of Working Days :</label>   
                                  {/*  <div className="span_emp_values"><span style={{ paddingLeft: "7px" }} >08/11/2018</span>-<span >08/11/2019</span></div> */}
                                  <div className="span_emp_values"><span style={{ paddingLeft: "7px" }} >{this.state.companyWorkingDays}</span></div>
                                </div>
                                <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >No of Days Present:</label>
                                    <span className="span_emp_values">{this.state.present} </span>

                                </div>
                                <div class="emp_details">
                                    <label htmlFor="employeeId"
                                    >Date:</label>
                                    <span className="span_emp_values">{this.state.salaryDate} </span>

                                </div>
                            </div>



                        </div>

                        <div style={{
                            textAlign: "left",
                            margin: "auto 120px",
                            fontSize: "23px"
                        }}>

                            <div class=" detail_Pay_column" >
                                <label htmlFor="employeeId" class=" detail_Pay"
                                >Advance Credited </label>
                                <span className="span_emp_values"> ₹ {this.state.advanceGranted}</span>

                            </div>


                              <div class=" detail_Pay_column" >
                                <label htmlFor="employeeId" class=" detail_Pay"
                                >Advance Debited </label>
                                <span className="span_emp_values"> ₹ {this.state.advanceDebited}</span>

                            </div>







                            <div class=" detail_Pay_column" >
                                <label htmlFor="employeeId" class=" detail_Pay"
                                >Basic Pay </label>
                                <span className="span_emp_values"> ₹ {this.state.salary}</span>

                            </div>

                            <div class=" detail_Pay_column" >
                                <label htmlFor="employeeId" class=" detail_Pay"
                                >Allowances </label>
                                <span className="span_emp_values">₹ {this.state.additionAmount}</span>

                            </div>

                            <div class=" detail_Pay_column">
                                <label htmlFor="employeeId" class=" detail_Pay"
                                >Deductions </label>
                                <span className="span_emp_values">₹ {this.state.reductionAmount}</span>

                            </div>

                            <div class=" detail_Pay_column" style={{ paddingBottom: "30px" }}>
                                <label htmlFor="employeeId" class=" detail_Pay"
                                >Net Salary </label>
                                <span className="span_emp_values"> ₹ {this.state.netSalary} </span>

                            </div>

                            <div>
                            </div>



                        </div>




                    </div>



                    <div id="scope" style={{ marginTop: "15%" }}>
                        <div class="scope-entry">
                            <div class="title">(Signature)</div>
                            <div class="value">(Employee Signature)</div>
                        </div>
                        <div class="scope-entry">
                            <div class="title">(Signature)</div>
                            <div class="value">(Factory Manager)</div>
                        </div>
                    </div>

                </div>
            </div >

        );
    }
}

export default Printpayslip;