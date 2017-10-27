import React, { Component } from 'react'
import { Table, Alert, Container, Row, Col } from 'reactstrap';
import { StudentRow } from  './StudentRow'
import firebase from 'firebase'
import AddStudent from './AddStudent'
import { Plenaries } from "../../config/config.json"


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebase.auth().currentUser.uid;
    var myStudentDataKey = [];
    var myStudentDataArr = [];

    firebase.database().ref('users/' + userId + '/students/').on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        myStudentDataKey.push(childKey);
        var childData = childSnapshot.val();
        myStudentDataArr.push(childData);
      });
    });

    this.state = {
      payment: null,
      myStudentDataKey: myStudentDataKey,
      myStudentDataArr: myStudentDataArr
    }

    // console.log(this.state.myStudentDataKey);
    console.log(this.state.myStudentDataArr);

    firebase.database().ref('users/' + userId + '/info/').once('value', (snapshot) => this.setState({
      payment: snapshot.val().payment,
    }));
  }
  render () {
    return (
      <Container>
        <br/>
    		<h2 className="fonted-h">Dashboard</h2>
    		<br/>
        {this.state.payment
            ?  <Alert color="success" id="alert">
                  <center>You have submitted your payment.</center>
                </Alert>
            : <Alert color="danger" id="alert">
                <center>Please submit payment.</center>
              </Alert>
          }
        <br/>
    		<h3>My Students</h3>
        <AddStudent />
        <br />
        <div id="table">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>{Plenaries[0]}</th>
              <th>{Plenaries[1]}</th>
              <th>{Plenaries[2]}</th>
              <th>{Plenaries[3]}</th>
              <th>{Plenaries[4]}</th>
              <th>{Plenaries[5]}</th>
              <th>Accessibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <StudentRow studentData={this.state.myStudentDataArr} studentKey={this.state.myStudentDataKey} />
        </Table>
        </div>
        <br/><br/><br/><br/><br/>
      </Container>

    )
  }
}
