import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import CryptoJS from 'crypto-js';
import { FormErrors } from './FormErrors';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import EmployeeMenuHeader from './EmployeeMenuHeader';

import FooterText from './FooterText';
import EmployeeMenuPage from './EmployeeMenuPage';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import ConfigurationPage from './ConfigurationPage';
import PayRollConfigPage from './PayRollConfigPage';
import SalaryCalcConfig from './SalaryCalcConfig';


var currentRow;
class ReductionCatagoryPage extends Component {

    constructor() {
        super()
        this.state = {


        };
    }

    componentDidMount() {

        $("#CategoryTable").hide();


        var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)
  
        this.state.schoolId = companyId;
  
        this.setState({
          schoolId: companyId,
  
        })
  /*
        console.log("data"  +JSON.stringify({
          schoolId:this.state.schoolId,
        }));
  */

  var self=this;
  
        $.ajax({
          type: 'POST',
          data: JSON.stringify({
      
              schoolId:this.state.schoolId.toString(),
  
            }),
  
             url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/SelectreductionCategory",
          //  url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/SelectreductionCategory",
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data, textStatus, jqXHR) {
         
         /*  alert("SUCCESS");
                console.log("DATA" +data.length); */
                
  if(data.length!=0){
  
    $("#CategoryTable").show();
    var tab;
    $.each(data, function (i, item) {
      tab += '<tr class="success" ><td>' + item.catagoryName + '</td><td><button class="Update" data-toggle="modal" data-target="#myModal" > Update </button></td><td><button class="Delete"> Delete</button></td></tr>';
           });
           $("#CategoryTable").append(tab);
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
  
  
        $("#CategoryTable").on('click', '.Update', function () {
          // get the current row
          currentRow = $(this).closest("tr");
  
          self.state.catagoryName = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
          self.state.newCategoryName=currentRow.find("td:eq(0)").text(); 
         
          self.setState({
  
            catagoryName: self.state.catagoryName,
            newCategoryName:self.state.newCategoryName,
  
          })
  
        });
  
  
        $("#CategoryTable").on('click', '.Delete', function () {
          // get the current row
          currentRow = $(this).closest("tr");
  
          self.state.catagoryName = currentRow.find("td:eq(0)").text(); // get current row 1st TD value
  
          confirmAlert({
            title: 'Delete Confirmation ',                        // Title dialog
           message: 'Are You  Sure Do You Want To Delete' + self.state.catagoryName+ '?',               // Message dialog
           confirmLabel: 'Confirm',                           // Text button confirm
           cancelLabel: 'Cancel',                             // Text button cancel    
           onConfirm: () => { self.DeleteConfirm(currentRow) },    // Action after Confirm
           onCancel: () => { self.NoAction() },      // Action after Cancel
  
       })


        });
  
  


    }

    BackbtnFunc() {

        ReactDOM.render(
          <Router>
            <div>
              <Route path="/" component={EmployeeMenuHeader} />
              <Route path="/" component={ConfigurationPage} />
              <Route path="/" component={FooterText} />
            </div>
          </Router>,
          document.getElementById('root'));
        registerServiceWorker();
      }

      AdditionCatog(){
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


      handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ 
          [name]: value },
        );

    }

      submit(){
        var companyId = CryptoJS.AES.decrypt(localStorage.getItem('CompanyId'), "shinchanbaby").toString(CryptoJS.enc.Utf8)

        this.state.schoolId = companyId;
        this.state.catagoryName=this.state.catagoryName;
        
        this.setState({
          schoolId: companyId,
          catagoryName:this.state.catagoryName,

        })

        var self=this;

        $.ajax({
          type: 'POST',
          data: JSON.stringify({
      
              schoolId:this.state.schoolId.toString(),
              catagoryName:this.state.catagoryName,

            }),

             url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/AddreductionCategory",
            //url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/AddreductionCategory",
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data, textStatus, jqXHR) {
         
              /*
           alert("SUCCESS");
                console.log("DATA" +data[0].schoolId);
*/
if(data.schoolId=="Category_Not_Added"){

  confirmAlert({
    title: 'Adding Category Failed',                        // Title dialog
    message: 'The Category You Are Trying To Add Already Exist.Hence Addition Failed',               // Message dialog
    confirmLabel: 'Ok',                           // Text button confirm
  });

}else{
  $("#CategoryTable").show();
  var tab;
 
    tab += '<tr class="success" ><td>' + self.state.catagoryName + '</td><td><button class="Update" data-toggle="modal" data-target="#myModal" > Update </button></td><td><button class="Delete"> Delete</button></td></tr>';
         
         $("#CategoryTable").append(tab);

}

self.state.catagoryName="";

self.setState({
 
  catagoryName:self.state.catagoryName,

})
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


      UpdateSubmit(){

        var self=this;
/*
        console.log("AJAX DATA AT MENU PAGE"+JSON.stringify({
        
          schoolId: self.state.schoolId,
          catagoryName:self.state.catagoryName,
          newCategoryName:self.state.newCategoryName,
          
         }));
*/

if(self.state.catagoryName==self.state.newCategoryName){

  confirmAlert({
    title: 'Updation Failed',                        // Title dialog
    message: 'Category Name Have Not Be Changed,Hence Cannot Be Updated.',               // Message dialog
    confirmLabel: 'Ok',                           // Text button confirm
  });


}else{

         $.ajax({
          type: 'POST',
          data: JSON.stringify({
      
              schoolId:this.state.schoolId.toString(),
              catagoryName:this.state.catagoryName,
              newCategoryName:self.state.newCategoryName

            }),

             url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/UpdatereductionCategory",
           // url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/UpdatereductionCategory",
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data, textStatus, jqXHR) {
         /*
           alert("SUCCESS");
                console.log("DATA" +data[0].schoolId);
*/
confirmAlert({
  title: 'Updation Success',                        // Title dialog
  message: 'Category Name Has Been Updated Successfully.',               // Message dialog
  confirmLabel: 'Ok',                           // Text button confirm
});

var tab;
 
tab += '<tr class="success" ><td>' + self.state.newCategoryName + '</td><td><button class="Update" data-toggle="modal" data-target="#myModal" > Update </button></td><td><button class="Delete"> Delete</button></td></tr>';
     
     $("#CategoryTable").append(tab);

     currentRow.remove();

          },
          error: function (data) {
            confirmAlert({
              title: 'No Internet',                        // Title dialog
              message: 'Network Connection Problem',               // Message dialog
              confirmLabel: 'Ok',                           // Text button confirm
            });
      
      
          },
        });

self.state.catagoryName="";
self.state.newCategoryName="";

self.setState({
 
  catagoryName:self.state.catagoryName,
  newCategoryName:self.state.newCategoryName

})

      }



      }


      DeleteConfirm(currentRow){

        var self=this;
/*
        console.log("AJAX DATA AT MENU PAGE"+JSON.stringify({
        
          schoolId: self.state.schoolId,
          catagoryName:self.state.catagoryName,
         
         }));

       alert("IN DELETE FUNCTION");
*/


         $.ajax({
          type: 'POST',
          data: JSON.stringify({
      
              schoolId:this.state.schoolId.toString(),
              catagoryName:this.state.catagoryName,
           
            }),

             url: "https://wildfly.tictoks.com:443/EmployeeAttendenceAPI/payrollconfig/DeletereductionCategory",
          //  url: "http://localhost:8080/EmployeeAttendenceAPI/payrollconfig/DeletereductionCategory",
             contentType: "application/json",
             dataType: 'json',
             async: false,
             success: function (data, textStatus, jqXHR) {
         /*
           alert("SUCCESS");
                console.log("DATA" +data[0].schoolId);
*/

confirmAlert({
  title: 'Deletion Success',                        // Title dialog
  message: 'Category Name Has Been Deleted Successfully.',               // Message dialog
  confirmLabel: 'Ok',                           // Text button confirm
});

     currentRow.remove();

          },
          error: function (data) {
            confirmAlert({
              title: 'No Internet',                        // Title dialog
              message: 'Network Connection Problem',               // Message dialog
              confirmLabel: 'Ok',                           // Text button confirm
            });
      
      
          },
        });

self.state.catagoryName="";

self.setState({
  catagoryName:self.state.catagoryName,
})

      }



      ReductionCatogFunc(){

        ReactDOM.render(
            <Router>
              <div>
                <Route path="/" component={EmployeeMenuHeader} />
                <Route path="/" component={ReductionCatagoryPage} />
                <Route path="/" component={FooterText} />
              </div>
            </Router>,
            document.getElementById('root'));
          registerServiceWorker();
      }

      
      SalaryCalcFunc(){

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


      }


    render() {
        return (
            <div className="container" style={{marginBottom:"20%"}}>

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
                  
                    <h3 className="centerAlign" style={{ marginTop: "-10px", textAlign: "center" }}>PayRoll Configurtion</h3>

<div id='horMenu'>
        <ul id='horMenunew' style={{ backgroundColor: "#8811d6" }}>
                        <li><a className="active" onClick={() => this.AdditionCatog()}><span class="glyphicon glyphicon-plus"> Allowance Category</span></a></li>
                        <li><a onClick={() => this.ReductionCatogFunc()}><span class="glyphicon glyphicon-minus"> Deduction Category</span> </a></li>
                        <li><a onClick={() => this.SalaryCalcFunc()}><span class="glyphicon glyphicon-minus"> Salary Calculation</span> </a></li>
                       
                        </ul>
        </div>

        <h3 className="centerAlign" style={{  textAlign: "center",marginBottom:"30px" }}>Deduction Category</h3>

<label style={{paddingRight:"30px"}}for="class">Category Name</label>
{/*add validation text only */}
<input type="text"
style={{width:"50%"}}
 onChange={this.handleUserInput}
 value={this.state.catagoryName}
 id="catagoryname"
 name="catagoryName" />

{/*add validation numbers only 
 <label for="class">Category Amount</label>

<input type="text"
 onChange={this.handleUserInput}
 value={this.state.catagoryAmount}
 id="catagoryamount"
 name="catagoryAmount" />
*/}
<br/>
<button style={{marginBottom:"20px"}} class="btn btn-primary" id="submit" onClick={() => this.submit()}  >Submit</button>
<div id="tableOverflow">
 <table class="table" id="CategoryTable" name="CategoryTable" style={{ overflowX: "auto", overflowY: "auto" }}>
              <tr><th>Category Name</th><th colspan="2"   style={{textAlign:"center"}}>Action</th></tr>
</table>
</div>


<div class="modal fade" id="myModal">
 <div class="modal-dialog">
 <div class="modal-content">
 <div class="modal-header">
 <h4 class="modal-title">Deduction Category Updation</h4>
 <button type="button" class="close" data-dismiss="modal">&times;</button>
 </div>

 <div class="modal-body" style={{display: "grid"}}>

 <label for="NewCategoryName"> Category Name</label> 
 
 <input type="text"
 onChange={this.handleUserInput}
 value={this.state.newCategoryName}
 id="newCategoryName"
 name="newCategoryName" />


  </div>


<div class="modal-footer">
<button type="button" class="btn btn-info" onClick={() => this.UpdateSubmit()}
data-dismiss="modal">Submit</button>

<button type="button" class="btn btn-danger" data-dismiss="modal">cancel</button>
</div>
</div>
</div>
</div>



            </div>

);
}

}


export default ReductionCatagoryPage;


