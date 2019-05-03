import datepicker from 'jquery-ui/ui/widgets/datepicker';
import './datepicker.css';
import React, {
  Component
} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';
import CryptoJS from 'crypto-js';
import registerServiceWorker from './registerServiceWorker';
import MonthlyIndividualAttendanceReportDisplay from './MonthlyIndividualAttendanceReportDisplay';
import ReportMenuPage from './ReportMenuPage';
import MonthlyIndividualAttendanceReport from './MonthlyIndividualAttendanceReport';
import MonthlyOrganizationAttendanceReportDisplay from './MonthlyOrganizationAttendanceReportDisplay';

import { confirmAlert } from 'react-confirm-alert';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import FooterText from './FooterText';
import { appendFile } from 'fs';
import _ from 'underscore';
import moment from 'moment';

var i;
var days1 ;

class MonthlyReportShort extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '',
      companyId: '',
      employeeId: '',
      fromDate: '',
      toDate: '',
      month:'',
    }

  }
  componentDidMount(){
    window.scrollTo(0, 0);
    $("#nodata").hide();
  }

  MonthlyFunc(value) {
    var today = new Date();
    
    $("#monthlytable").empty();
    $("#nodata").hide();
    var val1 = value;
    var month=val1;
   
     days1 = new Date(today.getFullYear(), month, 0).getDate();
  //    console.log("days", days1);
      var monthName = value;
      if (monthName == "12") {
      //  alert("IF PART FOR MONTH");
        monthName = 11;
      } else {
      //  alert("ELSE PART FOR MONTH");
        monthName = Number(value) - 1;
      }
  
      var formattedMonth = moment().month(monthName).format('MMMM');
      console.log(formattedMonth)
      this.state.monthName = formattedMonth;



    if (value == ("01") || value == ("03") || value == ("05") || value == ("07") || value == ("08") || value == ("10") || value == ("12")) {

      var j = (i - 1);
      if (j == val1) {

        this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
        this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
        this.state.month=value;

      } else {

        this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
        this.state.toDate = today.getFullYear() + '-' + value + '-' + '31';
         this.state.month=value;
      }
      this.setState({
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        month:this.state.month,
      });

    }
    else if (value == ("04") || value == ("06") || value == ("09") || value == ("11")) {
      var j = (i - 1);
      if (j == val1) {
        this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
        this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
         this.state.month=value;
      } else {

        this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
        this.state.toDate = today.getFullYear() + '-' + value + '-' + '30';
         this.state.month=value;
      }
      this.setState({
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        month:this.state.month,
      });
    } else if (value == ("02")) {
      if (today.getFullYear() % 100 == 0 && today.getFullYear() % 400 == 0 && today.getFullYear() % 4 == 0) {
        var j = (i - 1);
        if (j == val1) {
          this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
          this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
           this.state.month=value;
        } else {

          this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
          this.state.toDate = today.getFullYear() + '-' + value + '-' + '29';
           this.state.month=value;
        }
        this.setState({
          fromDate: this.state.fromDate,
          toDate: this.state.toDate,
          month:this.state.month,
        });

      }
      else {

      var j = (i - 1);
          if (j == val1) {
          this.state.fromDate = today.getFullYear() + '-' + val1 + '-' + '01';
          this.state.toDate = today.getFullYear() + '-' + val1 + '-' + today.getDate();
           this.state.month=value;
        }else{
        this.state.fromDate = today.getFullYear() + '-' + value + '-' + '01';
        this.state.toDate = today.getFullYear() + '-' + value + '-' + '28';
         this.state.month=value;
      }
      this.setState({
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        month:this.state.month,
      });

      }


    }

    var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
    var employeeId = CryptoJS.AES.decrypt(localStorage.getItem('EmployeeId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

    this.state.companyId = companyId;
    this.state.employeeId = employeeId;
    this.setState({
      companyId: this.state.companyId,
      employeeId: this.state.employeeId,
      month: this.state.month,
    });

    console.log("ORGANIZATION DATA " ,JSON.stringify({
      fromDate: this.state.fromDate,
      toDate: this.state.toDate,
      companyId: this.state.companyId,
      employeeId: this.state.employeeId,

    }),);

var self=this;

    $.ajax({
      type: 'POST',
      data: JSON.stringify({
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
        companyId: this.state.companyId,
        employeeId: this.state.employeeId,

      }),
      //  url: "http://13.127.39.136:8080/EmployeeAttendenceAPI/employee/employeeAttendanceMonthlyReport",
      url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/EmployeeReport/employeeOrganizationAttendanceMonthlyReport",
   //   url: "http://localhost:8080/EmployeeAttendenceAPI/EmployeeReport/employeeOrganizationAttendanceMonthlyReport",

      contentType: "application/json",
      dataType: 'json',
      async: false,
      success: function (data, textStatus, jqXHR) {

     
        console.log("DATA :",data);

        if(data.employeeRetrievelist.length!=0){

            var abb_data='<table><tr><td style=color:#009900;" ><b>P</b>-</td><td>Present</td></tr>'
                        +'<tr><td style=color:#e600ac;" ><b>P/H</b>-</td><td>Present Against Holiday</td></tr>'
                        +'<tr><td style=color:#ff0000;" ><b>A</b>-</td><td>Absent</td></tr>'
                        +'<tr><td style=color:#ff9900;" ><b>L</b>-</td><td>Leave</td></tr>'
                        +'<tr><td style=color:#0000ff;" ><b>H</b>-</td><td>Holiday</td></tr></table>'


            $("#abbrivations").append(abb_data);
        var headTab='<thead><th style="width:60px" >Id</th>'
        +'<th>Name</th><th>Dept</th><th>Type</th>';
        for(var i=1;i<=days1;i++){
            headTab+='<th style="width:50px">'+i+'</th>'
        }
        headTab+='</thead>';
        $("#monthlytable").append(headTab);

        var groupedData = _.groupBy(data.employeeRetrievelist, "employeeId");
        console.log("GROUPED DATA :",groupedData);

        var partionedData = _.partition(groupedData, ",")[1];
        console.log("PARTIONED DATA :",partionedData);

        var color;
        for (var z = 0; z < _.size(partionedData); z++) {

       
                        //+'<td>'+partionedSectionData[0].name
            var partionedData1 = partionedData[z];
            var tabBody='<tbody><tr><td>'+partionedData1[0].employeeId+'</td>'
                       +'<td>'+partionedData1[0].name+'</td>'
                      // +'<td>'+partionedData1[0].role+'</td>'
                       +'<td>'+partionedData1[0].department+'</td>'
                       +'<td>'+partionedData1[0].employeeType+'</td>'
            for (var j = 0; j < partionedData1.length; j++) {
                if( partionedData1[j].status =="P"){
                   // tabBody += '<td>' + partionedData1[j].status + '</td>'
                   // color = "#5cb85cad";
                    color="#009900";

                }else if( partionedData1[j].status =="A"){
                  //  tabBody += '<td>' + partionedData1[j].status + '</td>'
                  //  color = "#ff000087";
                      color = "#ff0000";

                }else if( partionedData1[j].status =="H"){
                 //   tabBody += '<td>' + partionedData1[j].status + '</td>'
                   // color = "#428bcab3";
                    color = "#0000ff";
                }else if( partionedData1[j].status =="L"){
                 //   tabBody += '<td>' + partionedData1[j].status + '</td>'
                    color = "#e8e92ab3";

                }else if( partionedData1[j].status =="P/H"){
                 //   tabBody += '<td>' + partionedData1[j].status + '</td>'
                    color ="#e600ac";
                }
                tabBody += '<td style=color:' + color + ';" ><b>' + partionedData1[j].status + '</b></td>'
               
              /*  + '<td>' + partionedData1[j].name + '</td>'
                + '<td>' + partionedData1[j].staffId + '</td>'
                + '<td>' + partionedData1[j].name + '</td>'
                + '<td>' + partionedData1[j].subject + '</td>'
                + '<td>' + partionedData1[j].subjectType + '</td>'
                */

            }
            tabBody+='</tr></tbody>';
            $("#monthlytable").append(tabBody);

        }


    }else{
        $("#nodata").show();
    }
     /*   ReactDOM.render(
          <Router>
            <div>
              <Route path="/" component={EmployeeMenuHeader} />
              <Route path="/" component={() => <MonthlyOrganizationAttendanceReportDisplay data={data}   month={self.state.month} />} />
              <Route path="/" component={FooterText} />

            </div>
          </Router>,
          document.getElementById('root'));
        registerServiceWorker();

*/

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

  dropdownFunc() {
    $('#1').hide(); $('#2').hide(); $('#3').hide();
    $('#4').hide(); $('#5').hide(); $('#6').hide();
    $('#7').hide(); $('#8').hide(); $('#9').hide();
    $('#10').hide(); $('#11').hide(); $('#12').hide();
    
    var today = new Date();
    this.state.month = today.getMonth() + 1;
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
                        padding: "3px 7px 3px 7px"
                    }}>
                    <a href="#" onClick={() => this.BackbtnFunc()}><i class="arrow left"></i></a></ul>
    <h2 style={{textAlign:"center"}}>Monthly Organization Report</h2>
    {/*     <div id='horMenu'>
          <ul>
            <li><a className="active col-sm-6 col-xs-12 col-lg-6" onClick={() => this.MyReport()}><span className="glyphicon glyphicon-user">My Report</span></a></li>
            <li><a className="col-sm-6 col-xs-12 col-lg-6" onClick={() => this.OrganizationReport()}><span className="glyphicon glyphicon-th-large">Organization Report
  </span></a></li>
          </ul>
        </div> */}

       

        <div class="btn-group" style={{ marginBottom: "5px" }}>
          <button type="button" onClick={() => this.dropdownFunc()} class="btn btn-primary dropdown-toggle" data-toggle="dropdown">Select your Month</button>



          <ul class="dropdown-menu" id="dropdown" style={{ paddingLeft: "37px", MarginBottom: "40%" }} role="menu">
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

<br/>
<h3 style={{textAlign:"center" }}>{this.state.monthName}</h3>

<br/>
<div  id="abbrivations" style={{marginLeft:"520px"}}>
</div>

<br/>
<br/>
<div id="tableOverflow" >
<table id="monthlytable" class="table"></table>
</div>
<div id="nodata"><p>No Data</p></div>



      </div>









    );
  }

}
export default MonthlyReportShort;