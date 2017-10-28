import React, { Component } from 'react'
import { Badge, Table, Alert, Container, Row, Col } from 'reactstrap';
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
    // console.log(this.state.myStudentDataArr);

    firebase.database().ref('users/' + userId + '/info/').once('value', (snapshot) => this.setState({
      payment: snapshot.val().payment,
    }));
  }
  render () {
    return (
      <Container>
        <br/>
    		<h2 className="fonted-h">Teacher Dashboard</h2>
    		<br/>
        {this.state.payment
            ? <div><h2>Payment Status: <br /><Badge color="success">Received</Badge></h2></div>
            : <Row>
              <Col xs="4">
              <h2>Payment Status: <br /><Badge color="danger">Not Received</Badge></h2>
              </Col>
              <Col xs="8">
                <h2>Payment Instruction:</h2>
                <h5>The ticket price for the World Affairs Conference 2018 is $50 per student.
                <br />Financial Aids are available upon requests.
                <br />Please send a cheque to Upper Canada College, by Dec 2018.
                <br /><a href="mailto:wac@ucc.on.ca">Contact Us</a> if you have any question.</h5>
              </Col>
              </Row>
          }
        <br/>
    		<h2>My Students</h2>
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
