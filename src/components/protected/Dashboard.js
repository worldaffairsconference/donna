import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Table } from 'reactstrap';
import { StudentRow } from  './StudentRow'
import firebase from 'firebase'

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    var myStudentData = null;

    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId + '/students/').once("value", function(snapshot) {
      myStudentData = snapshot.val();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    this.state = {
      studentDataSet: [{name: "Simon", grade:"11",panel:[1,2,3,4], accessability: "tired"},
      {name: "Nick", grade:"11",panel:[2,3,4,5], accessability: "sleepy"}
    ]
    }
    console.log(myStudentData);
  }
  render () {
    return (
      <div>
    		<h2>Dashboard</h2>
    		<Link to="/add">Add Students</Link>
    		<hr/>
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
            </tr>
          </thead>
          <tbody>
            <StudentRow studentData={this.state.studentDataSet} />
          </tbody>
      </Table>
      </div>
    )
  }
}
