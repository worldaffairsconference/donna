import React, { Component } from 'react'
import { Table, Alert, Container, Row, Col } from 'reactstrap';
import { StudentRow } from  './StudentRow'
import firebase from 'firebase'
import AddStudent from './AddStudent'

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

    console.log(this.state.myStudentDataKey);
    console.log(this.state.myStudentDataArr);

    firebase.database().ref('users/' + userId + '/info/').once('value', (snapshot) => this.setState({
      payment: snapshot.val().payment,
    }));
  }
  render () {
    return (
      <Container>
        <br/>
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
        <br/>
    		<h3>My Students</h3>
        <AddStudent />
        <br />
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Panel 1</th>
              <th>Panel 2</th>
              <th>Panel 3</th>
              <th>Panel 4</th>
              <th>Panel 5</th>
              <th>Panel 6</th>
              <th>Accessibility</th>
              <th>Actions</th>
            </tr>
          </thead>
        </Table>
        <StudentRow studentData={this.state.myStudentDataArr} studentKey={this.state.myStudentDataKey} />
      </Container>
    )
  }
}
