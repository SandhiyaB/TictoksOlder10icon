import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './EmployeeMenuPage.css';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import ReportMenuPage from './ReportMenuPage';
import AttendanceRegulationMenuPage from './AttendanceRegulationMenuPage';
import $ from 'jquery';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import CryptoJS from 'crypto-js';
import FooterText from './FooterText';
import EmailPage from './EmailPage';
import EmployeeMenuPage from './EmployeeMenuPage';
import PayRollConfigPage from './PayRollConfigPage';
import SalaryCalcConfig from './SalaryCalcConfig';
import ViewPayroll from './ViewPayroll';
import datepicker from 'jquery-ui/ui/widgets/datepicker';
import './datepicker.css';
import SelectSearch from 'react-select';
//import Advance from './Advance';
//import GeneratePaySlip from './GeneratePaySlip';
//import AdvancePaySlip from './AdvancePaySlip';
import AdvanceReport from './AdvanceReport';
import ViewIndividualPayroll from './ViewIndividualPayroll';

var allowenceNameArray = [];
var allowenceAmtArray = [];
var reductionNameArray = [];
var reductionAmtArray = [];
var month;
var Fromdate;
var currentRow;
var employeeid = null;
var originalgrantedadvance;
var additionAmount = 0;
var reductionAmount = 0;
var originalnetsalary = 0;
var onClickdata;
var constantadvanceDebitAmt;
var advanceDebitAmt;
var constantgrantedadvance;
var debitfunc;
var taxAmt = 0;
var presentagainstholidaysalary = 0;


class IndividualPayRoll extends Component {

  constructor() {
    super()

    this.state = {

      salarySelectionOption: '',
      fromDate: '',
      employeeId: '',
      toDate: '',
      options: [],
      role: '',
      department: '',
      name: '',
      advanceDebit: 0,
      netSalary: 0,
      salary: 0,
      companyWorkingDays: 0,
      workingDays: 0,
      grantedAdvance: 0,
      tax: 0,
      presentAgainstHoliday: 0,
      grantedAdvance_Advance: 0,
      paymentMode: '',
      advance: 0,

    };
  }

  componentDidMount() {

    var self = this;

    $("#fromDateinputdiv").hide();
    $("#fromDatepickdiv").hide();
    $("input[name=advanceDebit]").val(0);
    $("input[name=tax]").val(0);
    $("input[name=presentAgainstHolidaySalary]").val(0);

    /**DEFAULT FUNCTION CALL FOR GETTING BASIC INFO LIKE
     * "EMPLOYEE ID'S" AND "SALARY OPTION OPTED"
     */
    this.GetEmpId();
    this.GetCategorySalaryOptionList();

    /**FUNCTION FOR PROHIBITING GRANTING ADVANCE WITHOUT SELECTING EMPLOYEEID */
    $("#advance").on('click', function () {

      if (employeeid != null) {
        $('#myModalview').modal('show');
      } else {
        $('#myModalview').modal('hide');
        confirmAlert({
          title: 'Granting Advance Failed',                        // Title dialog
          message: 'Kindly Select The Employee Id To Proceed With Granting The Advance',               // Message dialog
          confirmLabel: 'Ok',                           // Text button confirm
        });
      }
    })


    $('#fromdatepicker').datepicker({
      onSelect: function (date) {
        var dt = new Date(date);
        self.setState({
          fromDate: date,
          dateValid: true,
        });
        $("#todatepicker").datepicker("option", "minDate", dt);

      },

      dateFormat: 'yy-mm-dd',
      minDate: '-3M',
      maxDate: 'M-2',
      numberOfMonths: 1
    });

    $('#todatepicker').datepicker({
      onSelect: function (date) {
        var dt = new Date(date);
        self.setState({
          toDate: date,
          dateValid: true,
        });
        console.log("fron end data", dt);
        self.GetWorkingDays();
      },

      dateFormat: 'yy-mm-dd',
      minDate: '-3M',
      maxDate: 'M-1',
      numberOfMonths: 1

    });
    window.scrollTo(0, 0);

    //for disable scrolling to change input number
    $(document).on("wheel", "input[type=number]", function (e) {
      $(this).blur();
    });
    /*
    ******
    **********FUNCTION FOR GETTING THE PRE-EXISTING VALUE BEFORE 
    **********CHANGING FOR THE UPDATION AS '0' ON EMPTY
    ******
             
             $("input[name=additionAmt]").click(function(){
               onClickdata=this.value;
             });
   
             $("input[name=reductionAmt]").click(function(){
               onClickdata=this.value;
             });
   */


    /*
     ******
     **********FUNCTION FOR ADDING THE ADDITION
     **********ALLOWENCES AMOUNT
     ******
     */
    $("input[name=additionAmt]").change(function () {
      additionAmount = 0;
      // allowenceAmtArray = [];

      if (this.value == "") {
        $(this).closest("td").find("input[name=additionAmt]").val(0);

      }

      $("input[name=additionAmt]").each(function () {
        additionAmount = Number(additionAmount) + Number(this.value);
        //   allowenceAmtArray.push(this.value);

      });

      self.NetSalCalc();
      onClickdata = 0;
      // console.log("TOTAL ADDITION ALLOWENCES AMOUNT :", additionAmount);

    });

    /*
     ******
     **********FUNCTION FOR REDUCING THE REDUCTION
     **********ALLOWENCES AMOUNT
     ******
     */

    $("input[name=reductionAmt]").change(function () {
      reductionAmount = 0;
      //  reductionAmtArray = [];


      if (this.value == "") {
        $(this).closest("td").find("input[name=reductionAmt]").val(0);

      }

      $("input[name=reductionAmt]").each(function () {
        reductionAmount = Number(reductionAmount) + Number(this.value);
        //   reductionAmtArray.push(this.value);

      });

      self.NetSalCalc();
      onClickdata = 0;
      //console.log("TOTAL REDUCTION ALLOWENCES AMOUNT :", reductionAmount);
    });

    /*
     ******
     **********FUNCTION FOR REDUCING THE 
     **********ADVANCE DEBIT
     ******
     */

    $("input[name=advanceDebit]").change(function () {
      advanceDebitAmt = this.value;

      if (advanceDebitAmt == "") {
        $("input[name=advanceDebit]").val(0);
        advanceDebitAmt = 0;

      } else {
        debitfunc = "yes";
        self.NetSalCalc();

      }


    });


    /*
     ******
     **********FUNCTION FOR REDUCING THE 
     **********Tax AMOUNT
     ******
     */
    $("input[name=tax]").change(function () {

      taxAmt = this.value;
      if (taxAmt == "") {
        $("input[name=tax]").empty();
        $("input[name=tax]").val(0);
        taxAmt = 0;
      }
      self.NetSalCalc();

    });

    /*
    ************FUNCTION FOR ADDING
    ************P/H SALARY
    *******
    */
    $("input[name=presentAgainstHolidaySalary]").change(function () {

      presentagainstholidaysalary = this.value;
      if (presentagainstholidaysalary == "") {
        $("input[name=presentAgainstHolidaySalary]").empty();
        $("input[name=presentAgainstHolidaySalary]").val(0);
        presentagainstholidaysalary = 0;
      } else {
        var prst_Agnst_Holi_Day = $("input[name=presentAgainstHoliday]").val();
        presentagainstholidaysalary = Number(prst_Agnst_Holi_Day) * Number(presentagainstholidaysalary);
      }
      self.NetSalCalc();

    });

  }

  NetSalCalc() {

    var errordata = "ToDate";
    var advancedebitChanged = constantadvanceDebitAmt;
    if (this.state.toDate !== "") {

      // console.log("NET SAL CALC FUNC");
      var netSalaryAmt;


      if (this.state.salarySelectionOption == "daysperMonth") {

        var perDaySalary = Number(this.state.salary) / Number(this.state.days);
        //console.log("PER DAY SALARY" + perDaySalary);

       // var perMonthSalary = Number(perDaySalary) * Number(this.state.workingDays);
        // console.log("PER MONTH SALARY" + perMonthSalary);

        var perMonthSalary = Number(perDaySalary) * (Number(this.state.workingDays)+Number(this.state.holidayDays));
        //console.log("PER MONTH SALARY" + perMonthSalary);
        netSalaryAmt = Number(perMonthSalary) + Number(additionAmount) + Number(presentagainstholidaysalary) - Number(taxAmt);
        var inter_net_amt = Number(netSalaryAmt) - Number(reductionAmount);

        if (Number(inter_net_amt) >= 0) {
          netSalaryAmt = inter_net_amt;
        } else {
          alert("Reduction is Higher than Salary");

          netSalaryAmt = Number(netSalaryAmt);
          reductionAmount = 0;
          $("input[name=reductionAmt]").val(0);
        }

        //console.log("NET SALARY" + netSalaryAmt);


      }
      else {

        var perDaySalary = Number(this.state.salary) / Number(this.state.companyWorkingDays);
        // console.log("PER DAY SALARY" + perDaySalary);

        var perMonthSalary = Number(perDaySalary) * Number(this.state.workingDays);
        //  console.log("PER MONTH SALARY" + perMonthSalary);


        netSalaryAmt = Number(perMonthSalary) + Number(additionAmount) + Number(presentagainstholidaysalary) - Number(taxAmt);
        var inter_net_amt = Number(netSalaryAmt) - Number(reductionAmount);

        if (Number(inter_net_amt) >= 0) {
          netSalaryAmt = inter_net_amt;
        } else {
          alert("Reduction is Higher than Salary");
          netSalaryAmt = Number(netSalaryAmt);
          reductionAmount = 0;
          $("input[name=reductionAmt]").val(0);
        }

        //  console.log("NET SALARY" + netSalaryAmt);

      }

      var netSalaryAfterDebit;

      netSalaryAfterDebit = Number(netSalaryAmt) - Number(constantadvanceDebitAmt);
      if (netSalaryAfterDebit >= 0) {
        if (debitfunc == "yes") {
          var diff = Number(constantadvanceDebitAmt) - Number(advanceDebitAmt);
          if (diff >= 0) {

            this.state.netSalary = (Number(netSalaryAmt) - Number(advanceDebitAmt)).toFixed(2);

            this.state.grantedAdvance = (Number(constantadvanceDebitAmt) - Number(advanceDebitAmt)).toFixed(2);

            $("input[name=advanceDebit]").val(advanceDebitAmt);
          } else {
            alert("Debit is High");
            advanceDebitAmt = Number(constantadvanceDebitAmt);
            this.state.netSalary = (Number(netSalaryAmt) - Number(constantadvanceDebitAmt)).toFixed(2);
            this.state.grantedAdvance = 0;
            $("input[name=advanceDebit]").val(advanceDebitAmt);
          }
        } else {
          advanceDebitAmt = Number(constantadvanceDebitAmt);
          this.state.netSalary = (Number(netSalaryAmt) - Number(constantadvanceDebitAmt)).toFixed(2);
          this.state.grantedAdvance = 0;
          $("input[name=advanceDebit]").val(advanceDebitAmt);
        }


      } else {
        if (debitfunc == "yes") {
          var diff = (Number(netSalaryAmt) - Number(advanceDebitAmt)).toFixed(2);
          if (diff >= 0) {
            this.state.netSalary = (Number(netSalaryAmt) - Number(advanceDebitAmt)).toFixed(2);
            this.state.grantedAdvance = (Number(constantadvanceDebitAmt) - Number(advanceDebitAmt)).toFixed(2);
            $("input[name=advanceDebit]").val(advanceDebitAmt);
          } else {
            alert("Debit is High");
            advanceDebitAmt = (Number(netSalaryAmt)).toFixed(2);
            this.state.netSalary = 0;
            this.state.grantedAdvance = (Number(constantadvanceDebitAmt) - Number(advanceDebitAmt)).toFixed(2);
            $("input[name=advanceDebit]").val(advanceDebitAmt);
          }
        } else {
          advanceDebitAmt = (Number(netSalaryAmt)).toFixed(2);
          this.state.netSalary = 0;
          this.state.grantedAdvance = (Number(constantadvanceDebitAmt) - Number(advanceDebitAmt)).toFixed(2);
          $("input[name=advanceDebit]").val(advanceDebitAmt);
        }
      }

      debitfunc = "no";
      this.setState({
        grantedAdvance: this.state.grantedAdvance,
        netSalary: this.state.netSalary,
      })

    } else {

      $("input[name=additionAmt]").val(0);
      $("input[name=reductionAmt]").val(0);
      $("input[name=advanceDebit]").val(this.state.grantedAdvance);
      $("input[name=tax]").val(0);

      if (employeeid == null) {
        errordata = "EmployeeId";
      }
      confirmAlert({
        title: 'Salary Credition Failed',                        // Title dialog
        message: 'Kindly Select ' + errordata + 'To Proceed The Process',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });

    }



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

  AdvanceReport() {

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
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/employee/EmployeeList",
      //  url: "http://localhost:8080/EmployeeAttendenceAPI/employee/EmployeeList",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      crossDomain: true,

      success: function (data, textStatus, jqXHR) {

        var options = [];
        $.each(data, function (i, item) {

          var empid = item.employeeId;
          var name = item.employeeName.replace(/\s/g, '');
          var role = item.role.replace(/\s/g, '');
          var dept = item.department.replace(/\s/g, '');

          var empDetails = empid + " " + name + " " + role + " " + dept;

          options.push({ label: empid + " " + name + " " + role + " " + dept, value: empDetails });
        });
        self.state.options = options;
        self.setState({
          options: options,
        })

      }
    });
  }

  GetCategorySalaryOptionList() {

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,
    })
    reductionNameArray=[];
    allowenceNameArray=[];
    var self = this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({
        schoolId: this.state.schoolId.toString(),
      }),

      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/CategorySalaryOptionList",
      // url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/CategorySalaryOptionList",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        if (data.length != 0) {

          if (data.salarySelection == "New_OptionOpted") {

            confirmAlert({
              title: 'Configuration Error',                        // Title dialog
              message: 'Salary Option Is Not Configured Yet . Kindly do The Configuartion First',               // Message dialog
              confirmLabel: 'Ok',                           // Text button confirm
            });

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

          } else {

            self.state.salarySelectionOption = data.salarySelection;

            var tab;
            var tab1;
            var tab2;
            var tab3;

            $.each(data.additionAllowencesList, function (i, item) {
              allowenceNameArray.push(item.catagoryName);
              tab += '<td><label align="center">' + item.catagoryName + '</label></td>'
              tab1 += '<td><input type="number" name="additionAmt" min="0" value=' + 0 + ' /></td>'

            });
            $(".allowencesname").append(tab);
            $(".allowencesamt").append(tab1);


            $.each(data.reductionAllowencesList, function (i, item) {

              reductionNameArray.push(item.catagoryName);
              tab2 += '<td><label align="center">' + item.catagoryName + '</label></td>'
              tab3 += '<td><input type="number" name="reductionAmt" min="0" value=' + 0 + ' /></td>'


            });
            $(".reductionname").append(tab2);
            $(".reductionamt").append(tab3);
          }

        } else {

          confirmAlert({
            title: 'Configuration Error',                        // Title dialog
            message: 'Configurations For Salary Calculation Are Not Done Yet,Kindly Do The Configuration Required',               // Message dialog
            confirmLabel: 'Ok',                           // Text button confirm
          });

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


  handleUserInputEmpId = (e) => {

    var self = this;
    self.state.employeeId = "";
      self.state.schoolId = "";
      self.state.role = "";
      self.state.department = "";
      self.state.fromDate = "";
      self.state.toDate = "";
      self.state.month = "";
    self.state.selectedEmployeeId = "";
      self.state.advanceDebit = 0;
      self.state.grantedAdvance = 0;
      self.state.netSalary = 0;
      self.state.tax = 0;
      self.state.companyWorkingDays = 0;
      self.state.workingDays = 0;


      employeeid = null;
    advanceDebitAmt = 0;
    taxAmt = 0;
    constantadvanceDebitAmt = 0;
    constantgrantedadvance = 0;
    allowenceAmtArray = [];
    reductionAmtArray = [];
    $("input[name=additionAmt]").empty();
    $("input[name=additionAmt]").val(0);
    $("input[name=reductionAmt]").empty();
    $("input[name=reductionAmt]").val(0);
    $("input[name=tax]").val(0);
    $("#presentagainstholidaysalary").val(0);
    $("input[name=advanceDebit]").val(0);
    $("#presentagainstholidaysalary").attr("readOnly", true);


    const value = e.value;
    var empdata = value.split(" ");

    this.state.employeeId = empdata[0];
    this.state.name = empdata[1];
    this.state.role = empdata[2];
    this.state.department = empdata[3];

    this.setState({
      employeeId: this.state.employeeId,
      name: this.state.name,
      role: this.state.role,
      department: this.state.department,
      selectedEmployeeId: e,
      valid: true,
    },
    );
    employeeid = value;
    // console.log("salary value", self.state.salary, self.state.totalSalary, self.state.totalSalary1);

    this.GetEmpDetails(this.state.employeeId);
  }

  GetEmpDetails(value) {

    $("#fromDateinputdiv").hide();
    $("#fromDatepickdiv").hide();

    var self = this;

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
    this.state.schoolId = companyId;
    this.state.employeeId = value;

    /* console.log("GET EMP DETAILS" + JSON.stringify({
 
       schoolId: this.state.schoolId,
       employeeId: this.state.employeeId,
     }));
 */
    $.ajax({
      type: 'POST',
      data: JSON.stringify({
        schoolId: this.state.schoolId,
        employeeId: this.state.employeeId,

      }),
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/GetEmployeeDetails",
      // url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/GetEmployeeDetails",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        if (data.salary != null) {
          self.state.salary = data.salary;

        } else {
          self.state.salary = 0;

          confirmAlert({
            title: 'No Salary',                        // Title dialog
            message: 'Salary is Not Assigned',               // Message dialog
            confirmLabel: 'Ok',                           // Text button confirm
          });

        }

        if (data.grantedAdvance != null) {
          $("input[name=advanceDebit]").empty();
          $("input[name=advanceDebit]").val(data.grantedAdvance);
          self.state.grantedAdvance = data.grantedAdvance;
          self.state.grantedAdvance_Advance = data.grantedAdvance;
          constantgrantedadvance = data.grantedAdvance;

          advanceDebitAmt = data.grantedAdvance;

          constantadvanceDebitAmt = data.grantedAdvance;
        } else {
          self.state.grantedAdvance = 0;

        }


        if (data.salaryDate == "No_Salary_Date") {
          $("#fromDatepickdiv").show();
        } else {

          var fromdate_incr = new Date(data.salaryDate);
          console.log("backend data", fromdate_incr);

          var day = 60 * 60 * 24 * 1000;
          var date_time = new Date(fromdate_incr.getTime() + day);
          self.state.fromDate = date_time.getFullYear() + "-" + ("0" + (date_time.getMonth() + 1)).slice(-2) + "-" + ("0" + date_time.getDate()).slice(-2);

          var dt = new Date(data.salaryDate);
          $("#todatepicker").datepicker("option", "minDate", date_time);
          self.setState({
            fromDate: self.state.fromDate
          })
          $("#fromDateinputdiv").show();

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

  GetWorkingDays = (e) => {

    /*  console.log("TODATE FUNCTION" + JSON.stringify({
  
        schoolId: this.state.companyId,
        employeeId: this.state.employeeId,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      }));
  */

    if (this.state.fromDate != "") {
      var self = this;

      $.ajax({
        type: 'POST',
        data: JSON.stringify({
          schoolId: this.state.companyId,
          employeeId: this.state.employeeId,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,


        }),
        url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/GetWorkingDays",
        // url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/GetWorkingDays",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        crossDomain: true,

        success: function (data, textStatus, jqXHR) {

          if (data.presentAgainstHoliday != 0) {
            self.state.presentAgainstHoliday = data.presentAgainstHoliday;
            $("#presentagainstholidaysalary").attr("readOnly", false);
          }

          if (data.workingDays == 0) {
            confirmAlert({
              title: 'Error',                        // Title dialog
              message: 'Working Day is Zero.So Cant Credit Salary.',               // Message dialog
              confirmLabel: 'Ok',                           // Text button confirm
            });
            //  self.state.employeeId = "",
            //  self.state.fromDate = "",
            self.state.toDate = "",

              /* self.state.additionCategoryName = "",
               self.state.additionCategoryAmount = "",
               self.state.reductionCategoryName = "",
               self.state.reductionCategoryAmount = "",
               self.state.additionAmount = "",
               self.state.reductionAmount = "",
               self.state.netSalary = 0,
               self.state.taxAmt = "",
               self.state.totalSalary = "",
               self.state.salary = "",
               self.state.tax = 0,
               self.state.role = "",
               self.state.department = "",
              
               self.state.companyWorkingDays = "",
               self.state.workingDays = "",
               self.state.month = ""
 */
              self.setState({

                // fromDate: self.state.fromDate,
                toDate: self.state.toDate,

                /* employeeId: self.state.employeeId,
                 schoolId: self.state.schoolId,
                 additionCategoryName: self.state.additionCategoryName,
                 additionCategoryAmount: self.state.additionCategoryAmount,
                 reductionCategoryName: self.state.reductionCategoryName,
                 reductionCategoryAmount: self.state.reductionCategoryAmount,
                 additionAmount: self.state.additionAmount,
                 reductionAmount: self.state.reductionAmount,
                 netSalary: self.state.netSalary,
                 taxAmt: self.state.taxAmt,
                 totalSalary: self.state.totalSalary,
                 salary: self.state.salary,
                 tax: self.state.tax,
                 role: self.state.role,
                 department: self.state.department,
              
                 companyWorkingDays: self.state.companyWorkingDays,
                 workingDays: self.state.workingDays,
                 month: self.state.month
   */

              })


          } else {


            if (self.state.salarySelectionOption == "daysperMonth") {

              var date1 = new Date(self.state.fromDate);
              var date2 = new Date(self.state.toDate);
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              //   alert(diffDays);
              self.state.days = diffDays;

              self.setState({
                days: self.state.days
              })

              self.state.companyWorkingDays = self.state.days;
              self.state.workingDays = data.workingDays;
              self.state.grantedAdvance = constantadvanceDebitAmt;
              self.state.netSalary = 0;
              self.state.holidayDays = data.holidayDays;
              self.state.absent = Number(self.state.companyWorkingDays) - Number(self.state.workingDays)
              self.setState({
                workingDays: self.state.workingDays,
                companyWorkingDays: self.state.companyWorkingDays,
                grantedAdvance: self.state.grantedAdvance,
              })

              if (self.state.employeeId != "" && self.state.salary != "" && self.state.fromDate != "" && self.state.toDate != "" && self.state.companyWorkingDays != "" && self.state.workingDays != "") {
                self.NetSalCalc();
                // self.MonthlySalaryCalculation();
              } else {

                confirmAlert({
                  title: 'Error',                        // Title dialog
                  message: 'Kindly fill in all mandatory fields to proceed',               // Message dialog
                  confirmLabel: 'Ok',                           // Text button confirm
                });

              }

            } else {

              self.state.companyWorkingDays = data.companyWorkingDays;
              self.state.workingDays = data.workingDays;
              self.state.grantedAdvance = constantadvanceDebitAmt;
              self.state.netSalary = 0;
              self.state.holidayDays = data.holidayDays;
              self.state.absent = Number(self.state.companyWorkingDays) - Number(self.state.workingDays)
              self.setState({
                workingDays: self.state.workingDays,
                companyWorkingDays: self.state.companyWorkingDays,
                grantedAdvance: self.state.grantedAdvance,
              })
              if (self.state.employeeId != "" && self.state.salary != "" && self.state.fromDate != "" && self.state.toDate != "" && self.state.companyWorkingDays != "" && self.state.workingDays != "") {
                self.NetSalCalc();
                //self.WorkingDaysSalaryCalculation();
              } else {

                confirmAlert({
                  title: 'Error',                        // Title dialog
                  message: 'Kindly fill in all mandatory fields to proceed',               // Message dialog
                  confirmLabel: 'Ok',                           // Text button confirm
                });

              }

            }

          }

        }
      });

      // Fromdate = self.state.fromDate;

    } else {

      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly Select the From Date',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });
    }



  }

  handleUserInputPaymentMode = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });

  }

  Submit() {

    var today = new Date();
    var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.state.date = date;
    this.state.month = (this.state.fromDate).split("-")[1];
    allowenceAmtArray = [];
    reductionAmtArray = [];

    if (employeeid !== null && this.state.fromDate != "" && this.state.toDate != "" && this.state.paymentMode != "") {

      var self = this;
  /*   console.log("allowance name array sub",allowenceNameArray);
    console.log("reduction name array sub",reductionNameArray);
   */  this.state.additionCategoryName = allowenceNameArray.toString();
      this.state.additionCategoryAmount = allowenceAmtArray.toString();
      this.state.reductionCategoryName = reductionNameArray.toString();
      this.state.reductionCategoryAmount = reductionAmtArray.toString();
      this.state.presentAgainstHolidaySalary = presentagainstholidaysalary;
      this.state.advanceDebit = $("input[name=advanceDebit]").val();

      $("input[name=additionAmt]").each(function () {
        allowenceAmtArray.push(this.value);
      });


      $("input[name=reductionAmt]").each(function () {
        reductionAmtArray.push(this.value);
      });

      this.state.additionCategoryAmount = allowenceAmtArray.toString();
      this.state.reductionCategoryAmount = reductionAmtArray.toString();


      $.ajax({
        type: 'POST',
        data: JSON.stringify({

          schoolId: this.state.schoolId.toString(),
          employeeId: this.state.employeeId,
          name: this.state.name,
          schoolId: this.state.schoolId,
          additionCategoryName: this.state.additionCategoryName.toString(),
          additionCategoryAmount: this.state.additionCategoryAmount.toString(),
          reductionCategoryName: this.state.reductionCategoryName.toString(),
          reductionCategoryAmount: this.state.reductionCategoryAmount.toString(),
          //  additionAmount: this.state.additionAmount,
          // reductionAmount: this.state.reductionAmount,
          netSalary: this.state.netSalary,
          //  taxAmt: this.state.taxAmt,
          //  totalSalary: this.state.totalSalary,
          salary: this.state.salary,
          tax: taxAmt,
          role: this.state.role,
          department: this.state.department,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
          companyWorkingDays: this.state.companyWorkingDays,
          workingDays: this.state.workingDays,
          month: this.state.month,
          advanceDebit: this.state.advanceDebit,
          grantedAdvance: this.state.grantedAdvance,
          presentAgainstHoliday: this.state.presentAgainstHoliday,
          presentAgainstHolidaySalary: this.state.presentAgainstHolidaySalary,
          date: this.state.date,
          paymentMode: this.state.paymentMode,
          absent: this.state.absent,
          holidayDays: this.state.holidayDays,
          advance: this.state.advance,

        }),

        url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/AddPaySlip",
        //url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/AddPaySlip",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        success: function (data, textStatus, jqXHR) {

          self.state.employeeId = "",
            self.state.schoolId = "",
            self.state.additionCategoryName = "",
            self.state.additionCategoryAmount = "",
            self.state.reductionCategoryName = "",
            self.state.reductionCategoryAmount = "",
            self.state.additionAmount = "",
            self.state.reductionAmount = "",
            self.state.netSalary = 0,
            //  self.state.taxAmt = "",
            self.state.totalSalary = "",
            self.state.salary = "",
            self.state.tax = 0,
            self.state.role = "",
            self.state.department = "",
            self.state.fromDate = "",
            self.state.toDate = "",
            self.state.companyWorkingDays = "",
            self.state.workingDays = "",
            self.state.month = "",
            self.state.advanceDebit = 0,
            self.state.grantedAdvance = 0,

            self.setState({

              employeeId: self.state.employeeId,
              schoolId: self.state.schoolId,
              additionCategoryName: self.state.additionCategoryName,
              additionCategoryAmount: self.state.additionCategoryAmount,
              reductionCategoryName: self.state.reductionCategoryName,
              reductionCategoryAmount: self.state.reductionCategoryAmount,
              additionAmount: self.state.additionAmount,
              reductionAmount: self.state.reductionAmount,
              netSalary: self.state.netSalary,
              taxAmt: self.state.taxAmt,
              totalSalary: self.state.totalSalary,
              salary: self.state.salary,
              tax: self.state.tax,
              role: self.state.role,
              department: self.state.department,
              fromDate: self.state.fromDate,
              toDate: self.state.toDate,
              companyWorkingDays: self.state.companyWorkingDays,
              workingDays: self.state.workingDays,
              month: self.state.month,
              advanceDebit: self.state.advanceDebit,
              grantedAdvance: self.state.grantedAdvance,


            });

          employeeid = null;
          advanceDebitAmt = 0;
          constantadvanceDebitAmt = 0;
          constantgrantedadvance = 0;
          $("input[name=additionAmt]").empty();
          $("input[name=additionAmt]").val(0);
          $("input[name=reductionAmt]").empty();
          $("input[name=reductionAmt]").val(0);
          $("input[name=advanceDebit]").val(0);
          $("input[name=tax]").val(0);
          $("#presentagainstholidaysalary").val(0);
          $("#presentagainstholidaysalary").attr("readOnly", true);
          advanceDebitAmt = 0;
          taxAmt = 0;
          allowenceAmtArray = [];
          reductionAmtArray = [];
          self.state.paymentMode = "";
          /*  $("#paymentmode").empty();
           $("#paymentmode").append($("#paymentmode"));
    */
          confirmAlert({
            title: 'Success',                        // Title dialog
            message: 'Successfully Added Payroll .',               // Message dialog
            confirmLabel: 'Ok',                           // Text button confirm
          });


        },

        error: function (data) {
          confirmAlert({
            title: 'No Internet',                        // Title dialog
            message: 'Network Connection Problem',               // Message dialog
            confirmLabel: 'Ok',                           // Text button confirm
          });


        },

      });
    } else {
      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly Fill In All Mandatory Fields To Proceed',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });
    }

  }


  handleUserInputAdvance = (e) => {

    const name = e.target.name;
    const value = e.target.value;


    // if (Number(this.state.salary) < (Number(value) + Number(this.state.grantedAdvance))) {
    if (Number(this.state.salary) < (Number(value) + Number(this.state.grantedAdvance_Advance))) {

      confirmAlert({
        title: 'Crediting Advance Failed',                        // Title dialog
        message: 'Adavnce Amt Exceeds Salary Limit, Hence Granting Advance Failed',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });

      $('#myModalview').modal('hide');
    } else {

      this.setState({
        [name]: value,
        dateValid: true
      });

    }

  }

  GrantAdvance() {

    var today = new Date();
    var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    this.state.date = date;

    this.setState({
      date: this.state.date
    })

    var self = this;



    var self = this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({
        schoolId: this.state.companyId,
        employeeId: this.state.employeeId,
        name: this.state.name,
        role: this.state.role,
        department: this.state.department,
        grantedAdvance: this.state.grantedAdvance_Advance,
        advance: this.state.advance,
        date: this.state.date,

      }),
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/GrantAdvance",
      // url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/GrantAdvance",


      contentType: "application/json",
      dataType: 'json',
      async: false,
      crossDomain: true,

      success: function (data, textStatus, jqXHR) {

        if (self.state.toDate != "") {
          self.state.grantedAdvance_Advance = Number(self.state.advance) + Number(self.state.grantedAdvance_Advance);
          constantadvanceDebitAmt = self.state.grantedAdvance_Advance;
          self.state.grantedAdvance = self.state.grantedAdvance_Advance;
          self.NetSalCalc();
        } else {
          self.state.grantedAdvance_Advance = Number(self.state.advance) + Number(self.state.grantedAdvance_Advance);
          constantadvanceDebitAmt = self.state.grantedAdvance_Advance;
          self.state.grantedAdvance = self.state.grantedAdvance_Advance;
        }

        //$("#advanceDebit").attr('readonly',false);

      }

    });



  }

  render() {
    return (
      <div className="container" style={{ marginBottom: "2%" }}>
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

        <h3 className="centerAlign" style={{ marginTop: "-10px", textAlign: "center" }}>PayRoll Management</h3>

        <div id='horMenu'>
          <ul id='horMenunew' style={{ backgroundColor: "#8811d6" }}>
            <li><a className="active" onClick={() => this.GeneratePaySlip()}><span class="glyphicon glyphicon-plus">Generate PaySlip</span></a></li>
            <li><a onClick={() => this.ViewPaySlip()}><span class="glyphicon glyphicon-minus">View PaySlip</span> </a></li>
            <li><a onClick={() => this.AdvanceReport()}><span class="glyphicon glyphicon-minus">Advance Report</span> </a></li>

          </ul>
        </div>

        {/*    <h3> Individual Payroll</h3>
 */}

        <div id="employeeiddiv" class="employeeiddiv">
          <label for="class">Select EmployeeId</label>
          <div >
            <SelectSearch options={this.state.options} value={this.state.selectedEmployeeId} onChange={(e) => this.handleUserInputEmpId(e)} name="employeeId" id="employeeId" class="employeeId" placeholder="Select Employee " />
          </div>
          <br />
        </div>


        <div id="employeesalarydiv">
          <label for="class">Employee Salary</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.salary}
            id="salary"
            name="salary"
            readOnly />
        </div>
        <br />


        <label for="class">Salary Dates</label>

        <div id="fromDateinputdiv">
          <label htmlFor="datepicker" style={{ paddingRight: '73px' }}>From Date:</label>
          <input style={{ width: '50%' }} type="text"
            onChange={this.handleUserInput}
            value={this.state.fromDate}
            id="fromdate"
            name="fromDate" readOnly />
        </div>


        <br />

        <div id="fromDatepickdiv">
          <label htmlFor="datepicker" style={{ paddingRight: '70px' }}>From Date:</label>

          <input style={{ width: '50%' }} placeholder="From Date"
            type="text" value={this.state.fromDate}
            id="fromdatepicker" name="fromDate" readOnly
            onChange={this.handleUserInputFromDate} />
        </div>

        <br />


        <div id="toDatepickdiv">
          <label htmlFor="datepicker" style={{ paddingRight: '90px' }}>To Date:</label>

          <input style={{ width: '50%' }} placeholder="To Date"
            type="text" value={this.state.toDate}
            id="todatepicker" name="toDate" readOnly
            onChange={this.handleUserInputToDate} />
        </div>

        <br />

        <div id="companyworkingdaysdiv" class="companyworkingdaysdivclass">
          <label for="class">No.Of.Working Days Of Company</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.companyWorkingDays}
            id="companyWorkingdays"
            name="companyWorkingDays" readOnly />
        </div>

        <br />

        <div id="workingdaysdiv">
          <label for="class">No.Of.Working Days Of Employee</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.workingDays}
            id="workingdays"
            name="workingDays" readOnly />
        </div>

        <br />

        <div id="holidaydaysdiv">
          <label for="class">No.Of.Holidays</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.holidayDays}
            id="holidaydays"
            name="holidayDays" readOnly />
        </div>

        <br />

        <div id="absentdiv">
          <label for="class">No.of.Days Absent</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.absent}
            id="absent"
            name="absent" readOnly />
        </div>

        <br />

        <div id="presentagainstholidaydiv">
          <label for="class">No.Of.P/H Days</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.presentAgainstHoliday}
            id="presentagainstholiday"
            name="presentAgainstHoliday" readOnly />
        </div>

        <br />

        <div id="presentagainstholidaysalarydiv">
          <label for="class">P/H Salary Per Day</label>

          <input type="number" id="presentagainstholidaysalary" min="0"
            name="presentAgainstHolidaySalary" readOnly />
        </div>

        <br />


        <div id="grantedadvancediv" class="grantedadvancediv">
          <label for="class">Granted Advance</label>
          <div >
            <input type="text" value={this.state.grantedAdvance} name="grantedAdvance" id="grantedAdvance" readOnly />
          </div>
        </div>

        <br />
        <div>
          <label for="class">Advance</label>
          <input type="text" name="advance" id="advance" class="advance" value="0" ></input>
        </div>
        <br />



        <label for="class">Employee Allowances To Be Added</label>

        <div >

          <table id="additionAllowences">
            <tr class="allowencesname"> </tr>
            <tr class="allowencesamt"> </tr>
          </table>

        </div>

        <br />

        <label for="class">Employee Allowances To Be Reduced</label>

        <div >

          <table id="reductionAllowences">
            <tr class="reductionname"> </tr>
            <tr class="reductionamt"> </tr>
          </table>

        </div>

        <br />


        <div id="debitdiv" class="debitdiv">
          <label for="class">Advance Debit</label>
          <input type="number" name="advanceDebit" min="0" />

        </div>

        <br />

        <div id="taxdiv">
          <label for="class">Employee Tax Amount</label>
          <input type="number" id="tax" name="tax" />
        </div>

        <br />

        <div id="paymentmodediv">
          <label for="class">Payment Mode</label>
          <select id="paymentmode" name="paymentMode" onChange={this.handleUserInputPaymentMode} value={this.state.paymentMode}>
            <option value="" disabled selected hidden>Select PaymentMode</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
            <option value="DD">DD</option>
            <option value="Online-Transaction">Online-Transaction</option>
          </select>
        </div>

        <br />

        <div id="netsalarydiv">
          <label for="class">Net Salary</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.netSalary}
            id="netsalary"
            name="netSalary" readOnly />
        </div>

        <br />

        <button type="button" id="submit" className="btn btn-primary"
          style={{
            marginLeft: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            marginBottom: "20px",

            display: "block"
          }}
          onClick={() => this.Submit()} >Submit</button>
        <br />

        <div class="modal fade" id="myModalview">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Advance</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>

              <div class="modal-body" style={{ display: "grid" }}>


                <label for="employeeid">Employee Id</label>

                <input type="text"
                  onChange={this.handleUserInput}
                  value={this.state.employeeId}
                  id="employeeid"
                  name="employeeId" readOnly />

                <label for="username">Employee Name</label>

                <input type="text"
                  onChange={this.handleUserInput}
                  value={this.state.name}
                  id="name"
                  name="name" readOnly />



                <label for="role">Role</label>

                <input type="text"
                  onChange={this.handleUserInput}
                  value={this.state.role}
                  id="role"
                  name="role" readOnly />


                <label for="department">Department</label>

                <input type="text"
                  onChange={this.handleUserInput}
                  value={this.state.department}
                  id="department"
                  name="department" readOnly />


                <label for="advance granted">Granted Advance</label>

                <input type="text"
                  onChange={this.handleUserInput}
                  value={this.state.grantedAdvance_Advance}
                  id="grantedadvance"
                  name="grantedAdvance" readOnly />

                <label for="advance">Advance</label>

                <input type="number" min="0"
                  onChange={this.handleUserInputAdvance}
                  value={this.state.advance}
                  id="advance"
                  name="advance" />

              </div>


              <div class="modal-footer">
                <button type="button" class="btn btn-info" onClick={() => this.GrantAdvance()}
                  data-dismiss="modal">Grant_Advance</button>

                <button type="button" class="btn btn-danger" data-dismiss="modal">cancel</button>
              </div>
            </div>
          </div>
        </div>


      </div>

    );
  }

}


export default IndividualPayRoll;