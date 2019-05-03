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

var allowenceNameArray = [];
var allowenceAmtArray = [];
var reductionNameArray = [];
var reductionAmtArray = [];
var month;
var Fromdate;

class Payroll extends Component {

  constructor() {
    super()

    this.state = {

      salarySelectionOption: '',
      fromDate: '',
      employeeId: '',
      toDate: '',
      companyWorkingDays: '',
      workingDays: '',
      tax: '',
      options:[],


    };
  }

  componentDidMount() {


    $("#Allowencediv").hide();
    $("#Reductiondiv").hide();
    $("#fromDateinputdiv").hide();
    $("#fromDatepickdiv").hide();
    // $("#workingdaysdiv").hide();
    $("#submit").hide();
    $("#netsalarydiv").hide();
    $("#taxdiv").hide();
    $("#totalsalarydiv").hide();



    var self = this;
    this.GetEmpId();

    this.AddtionCategory();

    this.ReductionCategory();


    this.GetSalalryOptionOpted();

    $("#allowencesTable").on('click', '#delete', function () {
      // get the current row
      var currentRow = $(this).closest("tr");

      var id = $(this).closest('td').parent()[0].sectionRowIndex;


      var i = parseInt(id - 1);
      allowenceNameArray.splice(i, 1);
      allowenceAmtArray.splice(i, 1);

      currentRow.remove();

      var tab = '<option value=" " disabled selected hidden >Select a Addition Category </option>';
      $("#additionAllowences").append(tab);


    });
    //  console.log("ALLOWENCES AFTER DELETE" + allowenceNameArray + ":" + allowenceAmtArray);


    $("#reductionTable").on('click', '#delete', function () {
      // get the current row
      var currentRow = $(this).closest("tr");


      var id = $(this).closest('td').parent()[0].sectionRowIndex;


      var i = parseInt(id - 1);
      reductionNameArray.splice(i, 1);
      reductionAmtArray.splice(i, 1);


      currentRow.remove();

      var tab = '<option value=" " disabled selected hidden >Select a Addition Category </option>';
      $("#reductionAllowences").append(tab);


    });

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

        self.GetWorkingDays();
      },

      dateFormat: 'yy-mm-dd',
      minDate: '-3M',
      maxDate: 'M-1',
      numberOfMonths: 1

    });
    window.scrollTo(0, 0);

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
          <Route path="/" component={Payroll} />
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
          <Route path="/" component={ViewPayroll} />
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
      [name]: value
    },
    );

  }

  handleUserInputEmpId = (e) => {

    var self = this;
    self.state.employeeId = "",
      self.state.schoolId = "",
      self.state.additionCategoryName = "",
      self.state.additionCategoryAmount = "",
      self.state.reductionCategoryName = "",
      self.state.reductionCategoryAmount = "",
      self.state.additionAmount = "",
      self.state.reductionAmount = "",
      self.state.netSalary = "",
      self.state.taxAmt = "",
      self.state.totalSalary = "",
      self.state.salary = 0,
      self.state.tax = "",
      self.state.role = "",
      self.state.department = "",
      self.state.fromDate = "",
      self.state.toDate = "",
      self.state.companyWorkingDays = "",
      self.state.workingDays = "",
      self.state.month = ""
    self.state.selectedEmployeeId="";

    $("#allowencesTable").empty()
    $("#reductionTable").empty()

    $("#Allowencediv").hide();
    $("#Reductiondiv").hide();
    $("#submit").hide();

    $("#additionAllowences").append('<option value=" " disabled selected hidden >Select a Addition Category </option>');
    $("#reductionAllowences").append('<option value=" " disabled selected hidden >Select a Reduction Category </option>');

    allowenceNameArray = [];
    allowenceAmtArray = [];
    reductionNameArray = [];
    reductionAmtArray = [];

    const value = e.value;
		this.setState({
		 employeeId:value,
		 selectedEmployeeId: e,
		 valid: true,
		},
		);
		
	  
   // console.log("salary value", self.state.salary, self.state.totalSalary, self.state.totalSalary1);

    this.GetEmpDetails(value);
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
      //url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/employee/EmployeeList",
      //url: "http://localhost:8080/EmployeeAttendenceAPI/employee/EmployeeList",
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/employeeshiftmanagement/SelectAllEmployee",
          
			
      contentType: "application/json",
      dataType: 'json',
      async: false,
      crossDomain: true,

      success: function (data, textStatus, jqXHR) {

        var options=[];
       // employeeId += '<option value=" " disabled selected hidden >Select a Employee Id </option>';
        $.each(data, function (i, item) {

         // employeeId += '<option value="' + item.employeeId + '">' + item.employeeId + '</option>'

         options.push({label: item.employeeId + " " + item.employeeName + " " + item.mobileNo , value: item.employeeId},);
			});
				self.state.options=options;
				self.setState({
				  options:options,
				})
       // $("#employeeId").append(employeeId);
      }
    });
  }

  AddtionCategory() {

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,

    })

    /*  console.log("data" + JSON.stringify({
        schoolId: this.state.schoolId,
      })); */

    var self = this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.schoolId.toString(),

      }),

      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/SelectadditionCategory",
      //url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/SelectadditionCategory",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        /*  alert("SUCCESS");
          console.log("DATA" + data.length); */

        if (data.length != 0) {


          var tab;

          tab += '<option value=" " disabled selected hidden >Select a Addition Category </option>';

          $.each(data, function (i, item) {
          
            tab += '<option value="' + item.catagoryName + '">' + item.catagoryName + '</option>';

          });

          $("#additionAllowences").append(tab);
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


  ReductionCategory() {

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,

    })

    /* console.log("data" + JSON.stringify({
       schoolId: this.state.schoolId,
     })); */

    var self = this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.schoolId.toString(),

      }),

      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/SelectreductionCategory",
      //url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/SelectreductionCategory",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        /* alert("SUCCESS");
        console.log("DATA" + data.length); */

        if (data.length != 0) {


          var tab;

          tab += '<option value=" " disabled selected hidden >Select a Reduction Category </option>';

          $.each(data, function (i, item) {

            tab += '<option style ="width:50%" value="' + item.catagoryName + '">' + item.catagoryName + '</option>';

          });

          $("#reductionAllowences").append(tab);
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

  GetEmpDetails(value) {

    $("#fromDateinputdiv").hide();
    $("#fromDatepickdiv").hide();
    $("#allowencesTable").empty()
    $("#reductionTable").empty()


    $("#Allowencediv").hide();
    $("#Reductiondiv").hide();

    $("#submit").hide();

    //$("#employeeId").append('<option value=" " disabled selected hidden >Select a EmployeeId </option>');
    $("#additionAllowences").append('<option value=" " disabled selected hidden >Select a Addition Category </option>');
    $("#reductionAllowences").append('<option value=" " disabled selected hidden >Select a Reduction Category </option>');

    var self = this;

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
    this.state.schoolId = companyId;
    this.state.employeeId = value;
    this.state.fromDate = "";
    this.state.toDate = "";
    this.state.netSalary = "";
    this.state.companyWorkingDays = "";
    this.state.workingDays = "";
    this.state.salary = "";

    this.setState({
      schoolId: this.state.schoolId,
      employeeId: this.state.employeeId,
      salarySelectionOption: this.state.salarySelectionOption

    });


    /* console.log("GET EMP DETAILS" + JSON.stringify({

      schoolId: this.state.schoolId,
      employeeId: this.state.employeeId,
      salarySelectionOption: this.state.salarySelectionOption
    })); */

    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.schoolId,
        employeeId: this.state.employeeId,
        //  salarySelectionOption:this.state.salarySelectionOption,


      }),
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/GetEmployeeDetails",
      //url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/GetEmployeeDetails",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        //  alert("SUCCESS" + data.role + ":" + data.department + ":" + data.salary + ":" + data.salaryDate);

        self.state.role = data.role;
        self.state.department = data.department;
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

       // console.log("backend salary value", self.state.salary, data.salary, self.state.totalSalary, self.state.totalSalary1);

        if (data.salaryDate == "No_Salary_Date") {

          $("#fromDatepickdiv").show();
          $('#workingdays').removeAttr('readonly');
        } else {
          self.state.fromDate = data.salaryDate;
          var dt = new Date(data.salaryDate);
         
          $("#todatepicker").datepicker("option", "minDate", dt);
      
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

  GetSalalryOptionOpted() {

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,

    })

    /* console.log("in compo did mount" + JSON.stringify({
       schoolId: this.state.schoolId,
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

        /*  alert("SUCCESS");
  
          console.log("DATA in CHECK SALARY SELECTION" + data.schoolId); */

        self.state.salarySelectionOption = data.schoolId;


        if (self.state.salarySelectionOption == "New_OptionOpted") {

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

          if (self.state.salarySelectionOption == "workingDays") {

            $("#workingdaysdiv").show();
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


  AddAllowFunc = (e) => {

    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    },
    );

    $("#Allowencediv").show();
   
    var tab = '<tr class="success"  id="allowtr"><td><input  type="text" class="categoryname" value="' + value + '" readonly></input></td><td><input min="0" type="number" class="amount" ></input></td><td><button style="margin-top:15px" id="delete">Delete</button></td></tr>';

    //$("#subjectSelect").clone().appendTo("."+j);

    $("#allowencesTable").append(tab);

  }

  RedAllowFunc = (e) => {

    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      [name]: value
    },
    );
    $("#Reductiondiv").show();

    var tab = '<tr class="success"><td><input type="text" class="categoryname" value="' + value + '"readonly></input></td><td><input min="0" type="number" class="amount" ></input></td><td><button style="margin-top:15px" id="delete">Delete</button></td></tr>';

    $("#reductionTable").append(tab);

  }

  Calculate() {

    var today = new Date();
    month = today.getMonth();
    //  console.log("MONTH" + month);
    var displaydate = today.getDate();


    /*    console.log("fromdate " + Fromdate);
        console.log("todate " + this.state.toDate); */


    if (this.state.employeeId != "" && this.state.salary != "" && this.state.fromDate != "" && this.state.toDate != "" && this.state.companyWorkingDays != "" && this.state.workingDays != "") {


      if (this.state.salarySelectionOption == "daysperMonth") {

        var date1 = new Date(Fromdate);
        var date2 = new Date(this.state.toDate);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // alert(diffDays);
        this.state.days = diffDays;

        this.setState({
          days: this.state.days
        })
        //   console.log("MONTH CALCULATION DAYS" + this.state.days);

        this.MonthlySalaryCalculation();

      } else {

        this.WorkingDaysSalaryCalculation();
      }

    } else {

      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly fill in all mandatory fields to proceed',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });



      if (this.state.employeeId == "") {
        $("#errormsg").show();
        $(".employeeiddiv").append($("#errormsg"));
      }

      if (this.state.fromDate == "") {

        $("#errormsg").show();
        $("#fromDateinputdiv").append($("#errormsg"));
        $("#fromDatepickdiv").append($("#errormsg"));
      }

      if (this.state.toDate == "") {
        $("#errormsg").show();
        $("#toDatepickdiv").append($("#errormsg"));
      }


      if (this.state.companyWorkingDays == "") {
        $("#errormsg").show();
        $(".companyworkingdaysdivclass").append($("#errormsg"));
      }

      if (this.state.workingDays == "") {
        $("#errormsg").show();
        $("#workingdaysdiv").append($("#errormsg"));
      }

    }

  }


  MonthlySalaryCalculation() {

    allowenceNameArray = [];
    allowenceAmtArray = [];
    reductionNameArray = [];
    reductionAmtArray = [];



    // alert("DAYS FOR DAYS OF MONTH" + this.state.days);

    var perDaySalary = Number(this.state.salary) / Number(this.state.days);
    //console.log("PER DAY SALARY" + perDaySalary);

    var perMonthSalary = Number(perDaySalary) * Number(this.state.workingDays);
    //  console.log("PER MONTH SALARY" + perMonthSalary);

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,

    })

    var month = Fromdate.split("-")[1];
    this.state.month = month;

    this.setState({
      month: this.state.month,

    })



    $('#allowencesTable tr').each(function () {

      $(this).find('.categoryname').each(function () {
        //  alert($(this).val())
        var categoryname = $(this).val();

        if (categoryname != "") {
          allowenceNameArray.push(categoryname);
        }

      })
    });
    // console.log("Allowence Name" + allowenceNameArray);

    $('#allowencesTable tr').each(function () {

      $(this).find('.amount').each(function () {
        //   alert($(this).val())
        var amount = $(this).val();

        if (amount != "") {
          allowenceAmtArray.push(amount);
        }

      })
    });
    // console.log("Allowence Amt" + allowenceAmtArray);

    $('#reductionTable tr').each(function () {

      $(this).find('.categoryname').each(function () {
        // alert($(this).val())
        var categoryname = $(this).val();

        if (categoryname != "") {
          reductionNameArray.push(categoryname);
        }

      })
    });
    //  console.log("Reduction Name" + reductionNameArray);

    $('#reductionTable tr').each(function () {

      $(this).find('.amount').each(function () {
        //   alert($(this).val())
        var amount = $(this).val();

        if (amount != "") {
          reductionAmtArray.push(amount);
        }

      })
    });
    //  console.log("Reduction Amt" + reductionAmtArray);

    var additionAmount = 0;
    var reductionAmount = 0;

    for (var i in allowenceAmtArray) {

      var currentData = allowenceAmtArray[i];
      additionAmount += Number(allowenceAmtArray[i]);

    }
    this.state.additionAmount = additionAmount;

    //  console.log("TOTAL ADDITION AMOUNT" + additionAmount);

    for (var j = 0; j < reductionAmtArray.length; j++) {

      reductionAmount += Number(reductionAmtArray[j]);

    }
    this.state.reductionAmount = reductionAmount;

    // console.log("TOTAL REDUCTION AMOUNT" + reductionAmount);

    if (allowenceNameArray.length == allowenceAmtArray.length && reductionNameArray.length == reductionAmtArray.length) {

      var netSalary = Number(perMonthSalary) + Number(additionAmount) - Number(reductionAmount);

      this.state.netSalary = netSalary;

      //  console.log("NET SALARY AMOUNT" + netSalary);

      /*
      var taxAmt = (Number(netSalary) * Number(this.state.tax)) / 100;
      this.state.taxAmt = taxAmt;
  
      console.log("TAX AMOUNT" + taxAmt);
  
      var totalSalary1 = Number(netSalary) - Number(taxAmt);
      console.log("TOTAL SALARY AMOUNT" + totalSalary1);
  
      var totalSalary = Math.round(totalSalary1);
      console.log("ROUNDED TOTAL SALARY AMOUNT" + totalSalary);
  
      this.state.totalSalary = totalSalary;
  */


      this.state.additionCategoryName = allowenceNameArray.toString();
      this.state.additionCategoryAmount = allowenceAmtArray.toString();
      this.state.reductionCategoryName = reductionNameArray.toString();
      this.state.reductionCategoryAmount = reductionAmtArray.toString();


      this.setState({
        schoolId: this.state.schoolId,
        employeeId: this.state.employeeId,
        role: this.state.role,
        department: this.state.department,
        salary: this.state.salary,
        additionCategoryName: this.state.additionCategoryName,
        additionCategoryAmount: this.state.additionCategoryAmount,
        reductionCategoryName: this.state.reductionCategoryName,
        reductionCategoryAmount: this.state.reductionCategoryAmount,
        additionAmount: this.state.additionAmount,
        reductionAmount: this.state.reductionAmount,
        netSalary: this.state.netSalary,
        // taxAmt: this.state.taxAmt,
        // totalSalary: this.state.totalSalary,
        //month:this.state.month

      });


      /*
          console.log("DATA IN MONTHLY CALCULATION " + JSON.stringify({
      
            employeeId: this.state.employeeId,
            schoolId: this.state.schoolId,
            additionCategoryName: this.state.additionCategoryName.toString(),
            additionCategoryAmount: this.state.additionCategoryAmount.toString(),
            reductionCategoryName: this.state.reductionCategoryName.toString(),
            reductionCategoryAmount: this.state.reductionCategoryAmount.toString(),
            additionAmount: this.state.additionAmount,
            reductionAmount: this.state.reductionAmount,
            netSalary: this.state.netSalary,
          //  taxAmt: this.state.taxAmt,
           // totalSalary: this.state.totalSalary,
            salary: this.state.salary,
            role: this.state.role,
            department: this.state.department,
            //month:this.state.month
          }))
      */

      $("#netsalarydiv").show();
      $("#taxdiv").show();


    } else {

      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly fill in all Category Amount Fields to continue the Calculation',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });
    }

  }


  WorkingDaysSalaryCalculation() {

    allowenceNameArray = [];
    allowenceAmtArray = [];
    reductionNameArray = [];
    reductionAmtArray = [];





    var perDaySalary = Number(this.state.salary) / Number(this.state.companyWorkingDays);
    /*  console.log("PER DAY SALARY" + perDaySalary);
      console.log("PARSED PER DAY SALARY" + Number(perDaySalary));
  */
    var perMonthSalary = Number(perDaySalary) * Number(this.state.workingDays);
    // console.log("PER MONTH SALARY" + perMonthSalary);

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.schoolId = companyId;

    this.setState({
      schoolId: companyId,

    })


    var month = Fromdate.split("-")[1];
    this.state.month = month;

    this.setState({
      month: this.state.month,

    })

    $('#allowencesTable tr').each(function () {

      $(this).find('.categoryname').each(function () {
        //  alert($(this).val())
        var categoryname = $(this).val();
        allowenceNameArray.push(categoryname);
      })
    });
    //   console.log("Allowence Name" + allowenceNameArray);

    $('#allowencesTable tr').each(function () {

      $(this).find('.amount').each(function () {
        //  alert($(this).val())
        var amount = $(this).val();
        allowenceAmtArray.push(amount);

      })
    });
    // console.log("Allowence Amt" + allowenceAmtArray);

    $('#reductionTable tr').each(function () {

      $(this).find('.categoryname').each(function () {
        //   alert($(this).val())
        var categoryname = $(this).val();
        reductionNameArray.push(categoryname);

      })
    });
    //  console.log("Reduction Name" + reductionNameArray);

    $('#reductionTable tr').each(function () {

      $(this).find('.amount').each(function () {
        //     alert($(this).val())
        var amount = $(this).val();
        reductionAmtArray.push(amount);
      })
    });
    // console.log("Reduction Amt" + reductionAmtArray);

    var additionAmount = 0;
    var reductionAmount = 0;

    for (var i in allowenceAmtArray) {

      var currentData = allowenceAmtArray[i];
      additionAmount += Number(allowenceAmtArray[i]);

    }
    this.state.additionAmount = additionAmount;
    // console.log("TOTAL ADDITION AMOUNT" + additionAmount);

    for (var j = 0; j < reductionAmtArray.length; j++) {

      reductionAmount += Number(reductionAmtArray[j]);

    }
    this.state.reductionAmount = reductionAmount;
    // console.log("TOTAL REDUCTION AMOUNT" + reductionAmount);



    if (allowenceNameArray.length == allowenceAmtArray.length && reductionNameArray.length == reductionAmtArray.length) {

      var netSalary = Number(perMonthSalary) + Number(additionAmount) - Number(reductionAmount);
      this.state.netSalary = netSalary;
      //  console.log("NET SALARY AMOUNT" + netSalary);

      /*
      var taxAmt = (Number(netSalary) * Number(this.state.tax)) / 100;
      this.state.taxAmt = taxAmt;
      console.log("TAX AMOUNT" + taxAmt);
  
      var totalSalary1 = Number(netSalary) - Number(taxAmt);
      console.log("TOTAL SALARY AMOUNT" + totalSalary1);
  
      var totalSalary = Math.round(totalSalary1);
      console.log("Rounded TOTAL SALARY AMOUNT" + totalSalary);
  
      this.state.totalSalary = totalSalary;
  
  */

      //var self=this;

      this.state.additionCategoryName = allowenceNameArray.toString();
      this.state.additionCategoryAmount = allowenceAmtArray.toString();
      this.state.reductionCategoryName = reductionNameArray.toString();
      this.state.reductionCategoryAmount = reductionAmtArray.toString();


      this.setState({
        schoolId: this.state.schoolId,
        employeeId: this.state.employeeId,
        additionCategoryName: this.state.additionCategoryName,
        additionCategoryAmount: this.state.additionCategoryAmount,
        reductionCategoryName: this.state.reductionCategoryName,
        reductionCategoryAmount: this.state.reductionCategoryAmount,
        additionAmount: this.state.additionAmount,
        reductionAmount: this.state.reductionAmount,
        netSalary: this.state.netSalary,
        // taxAmt: this.state.taxAmt,
        // totalSalary: this.state.totalSalary,
        role: this.state.role,
        department: this.state.department,
        month: this.state.month

      });


      /*
          console.log("DATA IN MONTHLY CALCULATION " + JSON.stringify({
      
            employeeId: this.state.employeeId,
            schoolId: this.state.schoolId,
            additionCategoryName: this.state.additionCategoryName.toString(),
            additionCategoryAmount: this.state.additionCategoryAmount.toString(),
            reductionCategoryName: this.state.reductionCategoryName.toString(),
            reductionCategoryAmount: this.state.reductionCategoryAmount.toString(),
            additionAmount: this.state.additionAmount,
            reductionAmount: this.state.reductionAmount,
            netSalary: this.state.netSalary,
          //  taxAmt: this.state.taxAmt,
          //  totalSalary: this.state.totalSalary,
            salary: this.state.salary,
            role: this.state.role,
            department: this.state.department,
            salary: this.state.salary,
            month: this.state.month
          }))
      
          */
      $("#netsalarydiv").show();
      $("#taxdiv").show();


    } else {

      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly fill in all Category Amount Fields to continue the Calculation',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });
    }

  }




  handleUserInputFromDate = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
      dateValid: true
    });

  }


  GetWorkingDays = (e) => {

    /*  alert("todate function");
  
  
      console.log("DATA IN TODATA");
  
  
      console.log("TODATE FUNCTION" + JSON.stringify({
  
        schoolId: this.state.companyId,
        employeeId: this.state.employeeId,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      }));
  */

    if (this.state.fromDate != "") {
      var self = this;
      // alert("Not Null");
      $.ajax({
        type: 'POST',
        data: JSON.stringify({

          schoolId: this.state.companyId,
          employeeId: this.state.employeeId,
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,


        }),
        url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/GetWorkingDays",
        //   url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/GetWorkingDays",
        contentType: "application/json",
        dataType: 'json',
        async: false,
        crossDomain: true,

        success: function (data, textStatus, jqXHR) {

          /*  console.log("WORKING DAYS OF THE EMPLOYEE" + data.workingDays);
             console.log("Holidays DAYS OF THE Company" + data.companyWorkingDays); */
          if (data.workingDays == 0) {
            confirmAlert({
              title: 'Error',                        // Title dialog
              message: 'Working Day is Zero.So Cant Credit Salary.',               // Message dialog
              confirmLabel: 'Ok',                           // Text button confirm
            });
            self.state.employeeId = "",
              self.state.schoolId = "",
              self.state.additionCategoryName = "",
              self.state.additionCategoryAmount = "",
              self.state.reductionCategoryName = "",
              self.state.reductionCategoryAmount = "",
              self.state.additionAmount = "",
              self.state.reductionAmount = "",
              self.state.netSalary = "",
              self.state.taxAmt = "",
              self.state.totalSalary = "",
              self.state.salary = "",
              self.state.tax = "",
              self.state.role = "",
              self.state.department = "",
              self.state.fromDate = "",
              self.state.toDate = "",
              self.state.companyWorkingDays = "",
              self.state.workingDays = "",
              self.state.month = ""

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
              month: self.state.month


            })

            $("#allowencesTable").empty()
            $("#reductionTable").empty()

            $("#Allowencediv").hide();
            $("#Reductiondiv").hide();
            $("#submit").hide();

            $("#employeeId").append('<option value=" " disabled selected hidden >Select a EmployeeId </option>');
            $("#additionAllowences").append('<option value=" " disabled selected hidden >Select a Addition Category </option>');
            $("#reductionAllowences").append('<option value=" " disabled selected hidden >Select a Reduction Category </option>');

          } else {

            self.state.workingDays = data.workingDays;
            //  self.state.companyWorkingDays = data.companyWorkingDays;

            self.setState({
              workingDays: self.state.workingDays,
              //   companyWorkingDays: self.state.companyWorkingDays
            })
          }

        }
      });

      Fromdate = this.state.fromDate;

    } else {

      confirmAlert({
        title: 'Error',                        // Title dialog
        message: 'Kindly Select the From Date',               // Message dialog
        confirmLabel: 'Ok',                           // Text button confirm
      });
    }


  }


  NoAction() {
    ReactDOM.render(
      <Router>
        <div>

          <Route path="/" component={EmployeeMenuHeader} />

          <Route path="/" component={Payroll} />
          <Route path="/" component={FooterText} />

        </div>
      </Router>, document.getElementById('root'));

  }

  handleUserInputTax = (e) => {

    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
      dateValid: true
    });

    var totalSalary1 = Number(this.state.netSalary) - Number(value);
    this.state.totalSalary = totalSalary1;


    $("#totalsalarydiv").show();
    $("#submit").show();

  }




  Submit() {


    var self = this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({

        schoolId: this.state.schoolId.toString(),
        employeeId: this.state.employeeId,
        schoolId: this.state.schoolId,
        additionCategoryName: this.state.additionCategoryName.toString(),
        additionCategoryAmount: this.state.additionCategoryAmount.toString(),
        reductionCategoryName: this.state.reductionCategoryName.toString(),
        reductionCategoryAmount: this.state.reductionCategoryAmount.toString(),
        additionAmount: this.state.additionAmount,
        reductionAmount: this.state.reductionAmount,
        netSalary: (this.state.netSalary).toFixed(2),
        taxAmt: this.state.taxAmt,
        totalSalary: (this.state.totalSalary).toFixed(2),
        salary: this.state.salary,
        tax: this.state.tax,
        role: this.state.role,
        department: this.state.department,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        companyWorkingDays: this.state.companyWorkingDays,
        workingDays: this.state.workingDays,
        month: this.state.month,


      }),

      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payroll/AddPaySlip",
      // url: "http://localhost:8080/EmployeeAttendenceAPI/payroll/AddPaySlip",
      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

        //  alert("SUCCESS");

        self.state.employeeId = "",
          self.state.schoolId = "",
          self.state.additionCategoryName = "",
          self.state.additionCategoryAmount = "",
          self.state.reductionCategoryName = "",
          self.state.reductionCategoryAmount = "",
          self.state.additionAmount = "",
          self.state.reductionAmount = "",
          self.state.netSalary = "",
          self.state.taxAmt = "",
          self.state.totalSalary = "",
          self.state.salary = "",
          self.state.tax = "",
          self.state.role = "",
          self.state.department = "",
          self.state.fromDate = "",
          self.state.toDate = "",
          self.state.companyWorkingDays = "",
          self.state.workingDays = "",
          self.state.month = ""

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
          month: self.state.month


        })

        $("#allowencesTable").empty()
        $("#reductionTable").empty()

        $("#Allowencediv").hide();
        $("#Reductiondiv").hide();
        $("#submit").hide();

        $("#employeeId").append('<option value=" " disabled selected hidden >Select a EmployeeId </option>');
        $("#additionAllowences").append('<option value=" " disabled selected hidden >Select a Addition Category </option>');
        $("#reductionAllowences").append('<option value=" " disabled selected hidden >Select a Reduction Category </option>');

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
          </ul>
        </div>



        <div id="employeeiddiv" class="employeeiddiv">
          <label for="class">Select EmployeeId</label>
          <div >
           {/*  <select name="employeeId" style={{ width: "50%" }} id="employeeId"
              onChange={this.handleUserInputEmpId} required>
            </select> */}
            	<SelectSearch  options={this.state.options} value={this.state.selectedEmployeeId} onChange={(e) =>this.handleUserInputEmpId(e)} name="employeeId" placeholder="Select Employee " />

          </div>
          <br />
        </div>


        <label for="class">Role</label>

        <input type="text"
          onChange={this.handleUserInput}
          value={this.state.role}
          id="role"
          name="role" readOnly />
        <br />

        <label for="class">Department</label>

        <input type="text"
          onChange={this.handleUserInput}
          value={this.state.department}
          id="department"
          name="department" readOnly />
        <br />

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
            name="companyWorkingDays" />

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
        <label for="class">Employee Allowances To Be Added</label>

        <div >
          <select name="additionAllowences" style={{ width: "50%" }} id="additionAllowences"
            onChange={this.AddAllowFunc} required>
          </select>
        </div>
        <br />

        <label for="class">Employee Allowances To Be Reduced</label>

        <div >
          <select name="reductionAllowences" style={{ width: "50%" }} id="reductionAllowences"
            onChange={this.RedAllowFunc} required>
          </select>
        </div>

        <br />
        <div id="Allowencediv" >
          <label for="class" style={{ marginBottom: "10px" }}>Allowances</label>
          <table class="table" id="allowencesTable">
            <tr><th>Category Name</th><th>Amount</th><th>Action</th></tr>
          </table>
        </div>
        <br />
        <div id="Reductiondiv" >
          <label for="class" style={{ marginBottom: "10px" }} >Deductions</label>
          <table class="table" id="reductionTable">
            <tr><th>Category Name</th><th>Amount</th><th>Action</th></tr>
          </table>
        </div>

        <button id="calculate" onClick={() => this.Calculate()} >Calculate</button>

        <div id="netsalarydiv">
          <label for="class">Net Salary</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.netSalary}
            id="netsalary"
            name="netSalary" readOnly />
        </div>
        <br />

        <div id="taxdiv">
          <label for="class">Employee Tax Amount</label>

          <input type="text"
            onChange={this.handleUserInputTax}
            value={this.state.tax}
            id="tax"
            name="tax" placeholder="Enter 0 For Not Applicable Tax " />
        </div>
        <br />


        <div id="totalsalarydiv">
          <label for="class">Total Salary</label>

          <input type="text"
            onChange={this.handleUserInput}
            value={this.state.totalSalary}
            id="totalsalary"
            name="totalSalary" readOnly />
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
        <p id="errormsg">***Kindly fill in all mandatory fields to proceed</p>
      </div>

    );
  }

}


export default Payroll;
{/*  <table class="table" id="allowencesTable" class="test">*/ }