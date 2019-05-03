
import React, { Component } from 'react';
import LoginPage from './LoginPage';
import { FormErrors } from './FormErrors';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import CryptoJS from 'crypto-js';
import EmployeeMenuHeader from './EmployeeMenuHeader';
import registerServiceWorker from './registerServiceWorker';
import NoAttendanceRequest from './NoAttendanceRequest';
import EmployeeMenuPage from './EmployeeMenuPage';
import EmployeeRequestAcceptReject from './EmployeeRequestAcceptReject';
import FooterText from './FooterText';
import { isFunction } from 'util';

class TripListForMap extends Component {

    constructor() {
        super()

        var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8);
        this.state = {
            companyId: companyId,
        };
    }

    Request() {

        var self = this;
        $.ajax({
            type: 'POST',
            data: JSON.stringify({
                companyId: this.state.companyId
            }),
            // url: "http://localhost:8080/EmployeeAttendenceAPI/AndroidTripAPI/CompanyDeviceList",
            url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/AndroidTripAPI/CompanyDeviceList",
            contentType: "application/json",
            dataType: 'json',
            async: false,
            success: function (data, textStatus, jqXHR) {
                //  console.log("data",data);
                if (data.length != 0) {

                    var num = 1;
                    var tab = '<thead><tr class="headcolor"  class="headcolor" style="color: white; background-color: #486885;" ><th>TripNo</th><th>Driver Name</th><th>DeviceId</th><th>Start Time</th><th>End Time</th><th>Total Hr</th><th>Action</th></tr></thead>';
                    $.each(data, function (i, item) {

                        tab += '<tr class="success" ><td>' + item.tripNo + '</td><td>' + item.employeeName + '</td><td>' + item.deviceId + '</td><td>' + item.startTime + '</td><td>' + item.endTime + '</td><td>' + item.totalHr + '</td><td><input type="button" class="view" id="view" value="View"></input></td><td class="hiddenDetails">' + item.location + '</td></tr>';
                        num = num + 1;
                    });
                    $("#tableHeadings").append(tab);

                } else {
                    $("#tableHeadings").append('<h3 align="center">No Trips</h3>');
                }
                $(".hiddenDetails").hide();

            }
        });
    }

    componentDidMount() {
        this.Request();
        window.scrollTo(0, 0);

        // code to read selected table row cell data (values).
        $("#tableHeadings").on('click', '.view', function () {
            // get the current row
            var currentRow = $(this).closest("tr");
            var deviceId = currentRow.find("td:eq(2)").text();
            var latLongArray = currentRow.find("td:eq(7)").text();

            console.log("Location Detials", deviceId, " tl ", latLongArray);

            var array = latLongArray.split(',');
            /*   var url = 'http://www.google.com/maps/place/?saddr=';
            //  console.log("array len ",array.length);
              for (var i = 0; i < array.length; i=i+2) {
            //console.log("len",array.length,array[i].trim());
                  if(i==0){
                  url+=array[i].trim()+','+array[i+1].trim()+'&daddr=';
                  }
                  else{
                      if(i==2){
                          url+=array[i].trim()+','+array[i+1].trim();
                          console.log("i=",i);
                      }
                      else{
                          url+='+to:'+array[i].trim()+','+array[i+1].trim();
                          console.log("i =",);
                      }
 
                  }  */
            var url;
            if (/Android/i.test(navigator.userAgent)) {
                //alert("android");
                url = "http://maps.google.com/maps?saddr=";
                for (var i = 0; i < array.length; i = i + 2) {
                    if (i == 0) {
                        url += array[i].trim() + ',' + array[i + 1].trim() + '&daddr=';
                    }
                    else {
                        if (i == 2) {
                            url += array[i].trim() + ',' + array[i + 1].trim();
                            console.log("i=", i);
                        }
                        else {
                            url += '+to:' + array[i].trim() + ',' + array[i + 1].trim();
                            console.log("i =", );
                        }
                    }
    
                }
            } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {

               alert("iphone");
               // url = "http://maps.apple.com/maps?saddr=";
               url="comgooglemaps://?saddr=";
                for (var i = 0; i < array.length; i = i + 2) {
                    if (i == 0) {
                        url += array[i].trim() + ',' + array[i + 1].trim() + '&daddr=';
                    }
                    else {
                        if (i == 2) {
                            url += array[i].trim() + ',' + array[i + 1].trim();
                            console.log("i=", i);
                        }
                        else {
                            url += '+to:' + array[i].trim() + ',' + array[i + 1].trim();
                            console.log("i =", );
                        }
                    }
    
                }
            } else {
                //url = "https://www.google.com/maps/dir/?api=1&origin=";
                url = "https://www.google.nl/maps/dir/?api=1&origin="
            
            for (var i = 0; i < array.length; i = i + 2) {

                  if (i == 0) {
                     url += array[i].trim() + ',' + array[i + 1].trim() + '&destination=';
                 }
                 else {
                     if (i == 2) {
                         url += array[i].trim() + ',' + array[i + 1].trim() + "&waypoints=";
                         console.log("i=", i);
                     }
                     else {
                         url += array[i].trim() + ',' + array[i + 1].trim() + "|";
                         console.log("i =", );
                     }
                 } 
                }
            }
            /* 
            var url = "https://www.google.com/maps/dir/api=1&origin=";
            for (var i = 0; i < array.length; i = i + 2) {

                if(i==0){
                        url += array[i].trim() + ',' + array[i + 1].trim() + "&destination=";
                }else{
                    url += array[i].trim() + ',' + array[i + 1].trim() + "/";
             
                }
                

            }
            console.log("url", url);
            url+="/17z";
            var newUrl = new URL(url);
            //url+='&views=traffic';
            */
            //  url+="@12.8812035,80.2264325,17z/@13.0650753,80.2711587,15z/data=!3m1!4b1!4m2!4m1!3e0"
            console.log("url", url);
            //     +lat+','+lng+'&daddr='+lat+','+lng+'+to:12.9010,80.2279&zoom=14&views=traffic';
              var inAppBrowser = window.open(url, '_blank', 'location=yes');
           
            // window.open("http://www.google.com/maps/place/"+array);
        });



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
    render() {
        return (

            <div className="container" style={{ marginBottom: '20%' }}>
                {/*   <ul class="previous disabled" id="backbutton"
                    style={{
                        backgroundColor: "#f1b6bf",
                        float: "none",
                        display: "inline-block",
                        marginLeft: "5px",
                        borderRadius: "5px",
                        padding: "3px 7px 3px 7px"
                    }}>
                    <a href="#" onClick={() => this.BackbtnFunc()}><i class="arrow left"></i></a></ul> */}
                <h3 className="centerAlign" style={{ textAlign: "center" }}>Trip Details</h3>
                <div id="tableOverflow">
                    <table class="table" id="tableHeadings" style={{ marginBottom: "5%" }}>
                    </table>

                </div>
                <div id="content">
                </div>
            </div>


        );
    }

}
export default TripListForMap;