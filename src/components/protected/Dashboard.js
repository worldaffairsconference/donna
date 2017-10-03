import React, { Component } from 'react'
import { Table, Alert } from 'reactstrap';
import { StudentRow } from  './StudentRow'
import firebase from 'firebase'
import AddStudent from './AddStudent'

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    var myStudentData = null;
    var userId = firebase.auth().currentUser.uid;
    this.state = {
      studentDataSet: [{name: "Simon", grade:"11",panel:[1,2,3,4], accessability: "tired"},
      {name: "Nick", grade:"11",panel:[2,3,4,5], accessability: "sleepy"}],
      payment: null,
    }
    firebase.database().ref('users/' + userId + '/students/').once("value", function(snapshot) {
      myStudentData = snapshot.val();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    console.log(myStudentData);

    firebase.database().ref('users/' + userId + '/info/').once('value', (snapshot) => this.setState({
      payment: snapshot.val().payment,
    }));
  }
  render () {
    return (
      <div>
    		<h2>Dashboard</h2>
    		<br/>
        {this.state.payment
            ?  <Alert color="success">
                  <center>You have submitted your payment.</center>
                </Alert>
            : <Alert color="danger">
                <center>Please submit payment.</center>
              </Alert>
          }
    		<h3>Students</h3>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Panel 1</th>
              <th>Panel 2</th>
              <th>Panel 3</th>
              <th>Panel 4</th>
              <th>Accessability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <StudentRow studentData={this.state.studentDataSet} />
        </Table>
        <AddStudent />
      </div>
    )
  }
}
