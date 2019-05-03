import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import $ from 'jquery';
import datepicker from 'jquery-ui/ui/widgets/datepicker';
import Attendence from './Attendence';

var array = [];
var checkBoxarray = [];
class ManualAttendance extends Component {
    constructor() {
        super();
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var superiorId = CryptoJS.AES.decrypt(localStorage.getItem('EmployeeId'), "shinchanbaby").toString(CryptoJS.enc.Utf8);
        var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
        
        this.state = {
            employeeId: '',
            employeeName: '',
            date: date,
            superiorId: superiorId,
            status: '',
            companyId:companyId,
        
        };
        this.setState({
            date: date,
        })
    }
    componentDidMount() {

        $(document).ready(function () {
            $(".CheckBoxClass").click(function () {
                 $(".checkBoxClass").prop('checked', $(this).prop('checked'));
              
            });
        });


        var self = this;
        window.scrollTo(0, 0);

        this.AttendanceList();

        $(document).ready(function () {
            $(".SelectOption").change(function () {
                var currentRow = $(this).closest("tr");
                var tdObject = $(this).closest("tr").find("td:eq(7)").text(); 
                console.log("td",tdObject);
                if(tdObject=="Exist" || tdObject=="Exist_Changed"){
                    $(this).closest("tr").find("td:eq(7)").text("Exist_Changed");

                }else{
                $(this).closest("tr").find("td:eq(7)").text("Changed");
                }

            });
            // code to read selected table row cell data (values).
            /*  $("#tableHeadings").on('change', '.SelectOption', function () {
                 // get the current row
                 var currentRow = $(this).closest("tr");
                 $(this).closest("tr").find("td:eq(5)").text("Changed");
                 
             }); */
        });

    }

    AttendanceList() {

        var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
        var employeeId = CryptoJS.AES.decrypt(localStorage.getItem('EmployeeId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
        var companyName = CryptoJS.AES.decrypt(localStorage.getItem('CompanyName'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
        this.state.companyId = companyId;
        this.state.employeeId = employeeId;
        this.state.companyName = companyName;
        this.setState({
            date: this.state.date,
            companyId: this.state.companyId,
            employeeId: this.state.employeeId,
            companyName: this.state.CompanyName,
        });
        //  report=this.state.CompanyName+"DailyReport"+this.state.date;
        var self = this;
        $.ajax({
            type: 'POST',
            data: JSON.stringify({
                date: this.state.date,
                companyId: this.state.companyId,
                employeeId: this.state.employeeId,
            }),
       
            //  url: "http://localhost:8080/EmployeeAttendenceAPI/EmployeeReport/employeeOrganizationAttendanceDailyReport",
            url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/EmployeeReport/employeeOrganizationAttendanceDailyReport",
            contentType: "application/json",
            dataType: 'json',
            async: false,
            success: function (data, textStatus, jqXHR) {
              
                var status;
                // console.log("data",data);
                if (data.employeeRetrievelist.length != 0) {
                    var tab = '<thead><tr class="headcolor"  class="headcolor" style="color: white; background-color: #486885;" ><th><input class="CheckBoxClass" name="checkbox" type="checkbox" id="ckbCheckAll" /></th><th>Id</th><th>Employee Name</th><th>Department</th><th>Employee Type</th><th>Mobile No</th><th>Status</th></tr></thead>';

                    $.each(data.employeeRetrievelist, function (i, item) {

                      
                            if (item.status == "P") {
                                status = "Present";
                             } else if (item.status == "A") {
                                status = "Absent";
                             } else if (item.status == "L") {
                                status = "Leave";
                            } else {
                                status = "Holiday";
                            }
                        //  tab += '<tbody id= "myTable" ><tr style="background-color:' + color + ';" ><td>' + item.employeeId + '</td><td>' + item.name + '</td><td>' + item.department + '</td><td>' + item.employeeType + '</td><td>' + item.checkinTime + '</td><td>' + item.checkinLocation + '</td><td>' + item.checkoutTime + '</td><td>' + item.checkoutLocation + '</td><td>' + item.totalWorkHour + '</td><td>' + status + '</td><td>' + item.authorizedBy + '</td></tr></tbody>';

                        tab += '<tbody id= "myTable" ><tr class="success"  id="tabletextcol" ><td><input class="checkBoxClass" name="checkbox" id="myCheckBox" type="checkbox"  /></td><td>' + item.employeeId + '</td><td>' + item.name + '</td><td>' + item.department + '</td><td>' + item.employeeType + '</td><td>' + item.mobileNo + '</td><td width="auto"><select id="Emp' + item.employeeId + '"class=SelectOption><option value="A">Absent</option> <option value="P">Present</option>  <option value="L">Leave</option> <option value="H">Holiday</option></select></td><td id="Status' + item.employeeId + '" class="ChangedStatus">Not_Changed</td></tr></tbody>';

                    });
                    $("#tableHeadings").append(tab);
                    $(".ChangedStatus").hide();
                    $.each(data.employeeRetrievelist, function (i, item) {
                        console.log("Status",item.status);
                        if(item.category=="DB"){
                            $("#Status" + item.employeeId).html('Exist');
                        }
                        if (item.status == "P") {
                            $("#Emp" + item.employeeId).val("P").change();
                          
                        }else if (item.status == "L") {
                            $("#Emp" + item.employeeId).val("L").change();
                         //   $("#Status" + item.employeeId).html('Exist');
                        }else if(item.status == "H"){
                            $("#Emp" + item.employeeId).val("H").change();
                        }
                    });

            
                } else {
                    $("#tableHeadings").append('<h3 align="center">No Data</h3>');

                }
            },
            error: function (data) {
                confirmAlert({
                    title: 'No Internet',                        // Title dialog
                    message: 'Network Connection Problem',               // Message dialog
                    confirmLabel: 'Ok',                           // Text button confirm
                });

            }

        });
       
    }
    Submit() {
         var rows = $('#tableHeadings tbody >tr');
         var columns;
         var insertArray=[];
         var updateArray=[];
         
         for (var i = 0; i < rows.length; i++) {
             columns = $(rows[i]).find('td');
 
             console.log("checked",$(columns[0]).find('input').is(':checked'));
             if($(columns[0]).find('input').is(':checked')){
                 console.log("checked true");
                 console.log("th",$(columns[7]).html())
                var changeStatus=$(columns[7]).html();
                console.log("Change status",changeStatus);
                 if((changeStatus != "Not_Changed") && (changeStatus != "Exist") ){
                    var employeeId=$(columns[1]).html();
                    var employeeName=$(columns[2]).html();
                    var department=$(columns[3]).html();
                    var type=$(columns[4]).html();
                    var status=$(columns[6]).find(".SelectOption").val();
                    console.log("Status Changed from Holiday  to ",status);     
                   
                     if(changeStatus == "Changed"){
                        console.log("Insert Array");
                     insertArray.push(employeeId);
                     insertArray.push(employeeName);
                     insertArray.push(department);
                     insertArray.push(type);
                     insertArray.push(status);
                     }
                     else{
                        console.log("Update Array");
                        updateArray.push(employeeId);
                        updateArray.push(employeeName);
                        updateArray.push(department);
                        updateArray.push(type);
                        updateArray.push(status);
                     }
 
                 }else{
                     console.log("No change it is Holiday");
                 }
 
             }else{
                 console.log("Not Checked");
             }
                
         }
         console.log("Final  insert array value ",insertArray,"len ",insertArray.length);
         console.log("Final  Update array value ",updateArray,"len ",updateArray.length);
         var self=this;
         console.log("insert")
         if((insertArray.length>0 )|| (updateArray.length>0 )){
         $.ajax({
             type: 'POST',
             data: JSON.stringify({
                 updateArray:updateArray.toString(),
                 insertArray:insertArray.toString(),
                 date:this.state.date,
                 companyId:this.state.companyId,
                 superiorId:this.state.superiorId,
             }),
             url:"https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/employee/ManualAttendance",
            // url: "http://localhost:8080/EmployeeAttendenceAPI/employee/ManualAttendance",
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data, textStatus, jqXHR) {
                 confirmAlert({
                     title: 'Success',                        // Title dialog
                     message: 'Attendance Updated Successfully.',               // Message dialog
                     confirmLabel: 'Ok',                           // Text button confirm
                 });
 
                 insertArray=[];
                 updateArray=[];
                 $("#ckbCheckAll").removeAttr("checked");
                 $("#tableHeadings").empty();
                 self.AttendanceList();

             },
 
 
             error: function (data) {
                insertArray=[];
                updateArray=[];
                 confirmAlert({
                     title: 'No Internet',                        // Title dialog
                     message: 'Network Connection Problem',               // Message dialog
                     confirmLabel: 'Ok',                           // Text button confirm
                 });
 
             }
 
 
         });
         array = [];
     }else{
         
         confirmAlert({
             title: 'Error',                        // Title dialog
             message: 'No Change',               // Message dialog
             confirmLabel: 'Ok',                           // Text button confirm
         });
     } 
        $(document).ready(function () {
            $(".CheckBoxClass").click(function () {
                $(".checkBoxClass").prop('checked', $(this).prop('checked'));
            });
        });

        $(document).ready(function () {
            $(".SelectOption").change(function () {
                var currentRow = $(this).closest("tr");
                var tdObject = $(this).closest("tr").find("td:eq(7)").text(); 
                console.log("td",tdObject);
                if(tdObject=="Exist" || tdObject=="Exist_Changed"){
                    $(this).closest("tr").find("td:eq(7)").text("Exist_Changed");

                }else{
                $(this).closest("tr").find("td:eq(7)").text("Changed");
                }
            });
        });
    }

    cancelFunc() {

        ReactDOM.render(<ManualAttendance />, document.getElementById("contentRender"));
    }

    render() {
        return (
            <div class="container"style={{marginBottom:"5%",marginTop:"-22px"}}>
                <div class="card">
                    <div class="card-header" style={{ backgroundColor: "" }}>
                        <h4 align="center" style={{ fontWeight: "300", fontSize: "30px" }}>Manual Attendance</h4>
                    </div>
                    <div>
                        <div class="card-body">

                            <div id="tableOverflow">
                                <table class="table" id="tableHeadings" style={{ marginBottom: "2%" }}>
                                </table>
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-sm-offset-2 col-sm-10">
                                        <button type="button" style={{ fontWeight: "bold" }} onClick={() => this.Submit()} class="btn btn-primary">Submit</button> <span></span>
                                        <button type="button" style={{ fontWeight: "bold" }} onClick={() => this.cancelFunc()} class="btn btn-primary">cancel</button>
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div></div>


        );
    }

}
export default ManualAttendance;