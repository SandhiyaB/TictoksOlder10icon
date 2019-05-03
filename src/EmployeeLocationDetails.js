
/*global google*/
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

import markerIcon from './image/markertt.png';
class EmployeeLocationDetials extends Component {

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
             url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/AndroidEmpAPI/EmployeeLocationDetails",
            //url: "http://localhost:8080/EmployeeAttendenceAPI/AndroidEmpAPI/EmployeeLocationDetails",

            contentType: "application/json",
            dataType: 'json',
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.length != 0) {
                    var bio;
                    var sms;
                    var rfid;
                    var num = 1;
                    var locations = [];
                    var tab = '<thead><tr class="headcolor"  class="headcolor" style="color: white; background-color: #486885;" ><th>SNo</th><th>Employee Details</th><th>Last Location Time</th><th>Action</th></tr></thead>';
                    $.each(data, function (i, item) {
                        var empLocation = [];
                        if (item.currentLocationTime == null) {
                            item.currentLocationTime = "-";
                        }
                        tab += '<tr class="success" ><td>' + num + '</td><td>' + item.employeeId + ' ' + item.name + ' ' + item.role + ' ' + item.department + '</td><td>' + item.currentLocationTime + '</td><td><input type="button" class="view" id="view" value="View"></input></td><td class="hiddenDetails">' + item.lastLocationTime + '</td><td class="hiddenDetails">' + item.mobileNo + '</td><td class="hiddenDetails">' + item.emailId + '</td><td class="hiddenDetails">' + item.latLongArray + '</td></tr>';
                        var array = item.latLongArray.split(',');
                        if (array.length > 1) {
                            empLocation.push(
                                '<b>' + item.employeeId + " " + item.name + '</b><br>' + item.name + '<br>Role: ' + item.role + '<br>Department: ' + item.department
                                + '<br>Phone: ' + item.mobileNo + '<br>', array[array.length - 2].trim(), array[array.length - 1].trim(), item.name
                            );
                            locations.push(empLocation);
                        }
                        num = num + 1;
                    });
                    $("#tableHeadings").append(tab);

                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 10,
                        /* Zoom level of your map */
                        center: new google.maps.LatLng(12.8814681, 80.2287197),
                        /* coordinates for the center of your map */
                        //type of map
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                    });

                    var infowindow = new google.maps.InfoWindow();

                    var marker, i;
                    var icon = {
                        url: markerIcon, // url
                        scaledSize: new google.maps.Size(30, 30), // scaled size width,height
                        // origin: new google.maps.Point(0,0), // origin
                        anchor: new google.maps.Point(0, 0), // anchor The anchor for this image is the base of the flagpole at (0, 32)
                        labelOrigin: new google.maps.Point(0, 0),

                    };
                    var bounds = new google.maps.LatLngBounds();
                    for (i = 0; i < locations.length; i++) {
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                            map: map,
                            label: { text: locations[i][3], color: "white" },
                            title: locations[i][3],
                            animation: google.maps.Animation.DROP,
                            //  set icon image here
                            icon: icon,
                        });
                        var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
                        bounds.extend(loc);
                        google.maps.event.addListener(marker, 'click', (function (marker, i) {
                            return function () {
                                infowindow.setContent(locations[i][0]);
                                infowindow.open(map, marker);
                            }
                        })(marker, i));

                    }
                    map.fitBounds(bounds); //auto - zoom
                    map.panToBounds(bounds); // auto - center

                } else {
                    $("#tableHeadings").append('<h3 align="center">No Devices</h3>');
                }
                $(".hiddenDetails").hide();

            }
        });
    }

    componentDidMount() {
        this.Request();
        window.scrollTo(0, 0);
        $(".mapouter").hide();

        $("#tableHeadings").on('click', '.view', function () {
            // get the current row
            var currentRow = $(this).closest("tr");
            var latLongArray = currentRow.find("td:eq(7)").text();
                if(latLongArray!="-"){
                var array = latLongArray.split(',');
                /*  var url = 'http://www.google.com/maps/place/?saddr=';
                 console.log("array len ",array.length);
                 for (var i = 0; i < array.length; i=i+2) {
                     console.log("l",array[i].trim());
                     if(i==0){
                     url+=array[i].trim()+','+array[i+1].trim()+'&daddr=';
                     }
                     else{
                         if(i==2){
                             url+=array[i].trim()+','+array[i+1].trim();
                         }
                         else{
                             url+='+to:'+array[i].trim()+','+array[i+1].trim();
                         }
 
                     }
                 } */
                var url;
                var iframeurl;
                iframeurl = "https://maps.google.com/maps?q=" + array[array.length - 2].trim() + ',' + array[array.length - 1].trim() + "&t=&z=17&ie=UTF8&iwloc=&output=embed";
                /*
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
                    } else if (/iPhone/i.test(navigator.userAgent)) {
    
                        //  alert("iphone");
                        url = "maps://maps.google.com/maps??saddr=";
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
                        //  iframeurl="https://maps.google.co.in/maps/ms?ll="+array[0].trim() + ',' + array[0 + 1].trim();
                        iframeurl = "https://maps.google.com/maps?q=" + array[0].trim() + ',' + array[1].trim() + "&hl=es;z=14&amp;output=embed";
                        // url = "https://www.google.com/maps/dir/?api=1&origin=";
                        // url = "https://www.google.nl/maps/dir/?api=1&origin="
    
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
                    var hurl = "https://maps.google.com/maps?q=" + array[0].trim() + ',      ' + array[1].trim() + "&hl=es;z=14&amp;output=embed"
                    url += '&views=traffic';
                    console.log("url", url);
                    // iframeurl += "&amp;output=embed";
                    console.log("iframeurl" + iframeurl);
    
    
                    $('#iframeid').attr('src', iframeurl);
                    */

                $('#iframeid').attr('src', iframeurl);
                $(".mapouter").show();
                // $("a[href='http://www.google.com/']").attr('href', hurl);
                //     +lat+','+lng+'&daddr='+lat+','+lng+'+to:12.9010,80.2279&zoom=14&views=traffic';
                // var inAppBrowser = window.open(url, '_blank', 'location=yes');
                // window.open("http://www.google.com/maps/place/"+array);
        
                }else{
                    $(".mapouter").hide();
                }
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
                {/*    <ul class="previous disabled" id="backbutton"
                    style={{
                        backgroundColor: "#f1b6bf",
                        float: "none",
                        display: "inline-block",
                        marginLeft: "5px",
                        borderRadius: "5px",
                        padding: "3px 7px 3px 7px"
                    }}>
                    <a href="#" onClick={() => this.BackbtnFunc()}><i class="arrow left"></i></a></ul> */}
                <h3 className="centerAlign" style={{ textAlign: "center" }}>Employee Details</h3>
                <div id="tableOverflow">
                    <table class="table" id="tableHeadings" style={{ marginBottom: "5%" }}>
                    </table>

                </div>
                <div class="mapouter" style={{ overflow: "scroll" }}>
                    <div class="gmap_canvas" style={{ overflow: "scroll", background: "none!important", height: "500px", width: "auto" }}>
                        <iframe width="706" height="500" style={{}} id="iframeid" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
                        </iframe>
                    </div>
                </div>
                <div>
                    {/*  <div>
                        <iframe id="iframeid1" width="100%" height="600" src="https://maps.google.com/maps?q=12.881470000000002,80.228695&hl=es;z=14&amp;output=embed&amp;output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
                            <a >Create route map</a>
                        </iframe></div> */}

                    {/*  <div class="mapouter" style={{ position: "relative", textAlign: "right", height: "500px", width: "706px" }}>
                        <div class="gmap_canvas" style={{ overflow: "hidden", background: "none!important", height: "500px", width: "706px" }}>
                            <iframe width="706" height="500" id="iframeid" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
                            </iframe>
                        </div>
                    </div> */}
                    <br />

                </div>

                <center>Click on a marker to display contact information.</center>
                <div id="map" style={{ height: "500px", width: "auto" }}></div>
            </div>


        );
    }

}
export default EmployeeLocationDetials;