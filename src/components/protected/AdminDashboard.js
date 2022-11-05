import React, { Component } from 'react';
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  CardTitle,
  Form,
  FormGroup,
  Input,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { addAttendee, resetPassword } from '../../helpers/auth';

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebaseAuth.currentUser.uid;

    this.state = {
      schoolsList: [],
      teacherList: [],
      schoolNum: 0,
      attendeeList: {},
    };
  }

  async componentDidMount() {
    var schoolsList = [];
    var teacherList = [];
    var schoolNum = 0;
    var attendeeList = {};
    await ref.child('teachers/').once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        schoolNum += 1;
        teacherList.push([childSnapshot.val().name, childSnapshot.key]);
        if (!childSnapshot.val().waiver) {
          var childSchool = childSnapshot.val().school;
          schoolsList.push([childSchool, childSnapshot.key]);
        }
        if (childSnapshot.val().students) {
          attendeeList = { ...attendeeList, ...childSnapshot.val().students };
        }
      });
    });
    this.setState({
      schoolsList: schoolsList,
      waiverSelectedSchool: schoolsList[0][1],
      attendeeSelectedTeacher: teacherList[0][1],
      schoolNum: schoolNum,
      attendeeList: attendeeList,
      teacherList: teacherList,
    });

    //bind
    this.handleWaiver = this.handleWaiver.bind(this);
    this.handleWaiverSubmit = this.handleWaiverSubmit.bind(this);
  }

  generateSchoolOptions() {
    var options = [];
    for (var i = 0; i < this.state.schoolsList.length; i++) {
      options.push(
        <option
          key={this.state.schoolsList[i][1]}
          value={this.state.schoolsList[i][1]}
        >
          {this.state.schoolsList[i][0]}
        </option>
      );
    }

    return options;
  }

  generateTeacherOptions() {
    var options = [];
    for (var i = 0; i < this.state.teacherList.length; i++) {
      options.push(
        <option
          key={this.state.teacherList[i][1]}
          value={this.state.teacherList[i][1]}
        >
          {this.state.teacherList[i][0]}
        </option>
      );
    }

    return options;
  }

  handleWaiver = (event) => {
    this.setState({
      waiverSelectedSchool: event.target.value,
    });
  };

  handleWaiverSubmit = async (event) => {
    var school = this.state.waiverSelectedSchool;
    await ref.child('teachers/' + school).update({
      waiver: true,
    });
  };

  handleAddAttendee = (event) => {
    event.preventDefault();
    var name = event.target.name.value;
    var email = event.target.email.value;
    var school = event.target.access.value;
    var grade = event.target.grade.value;
    addAttendee(email, (Math.random() + 1).toString(36), name, grade, school)
      .then(alert('Added attendee'))
      .catch((error) => {
        alert(error);
      });
  };

  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h">Admin Dashboard</h1>
          </Col>
          <Col md="2" sm="12" xs="12">
            <Link
              className="btn btn-secondary float-right mb-2"
              to="/dashboard"
            >
              Return
            </Link>
          </Col>
        </Row>

        <Row className="mt-3">
          <Card body>
            <CardTitle tag="h3">Conference Statistics</CardTitle>
            <CardText>
              <h5>Schools: {this.state.schoolNum}</h5>
              <h5>Attendees: {Object.keys(this.state.attendeeList).length}</h5>
            </CardText>
          </Card>
        </Row>
        <br />
        <hr />
        <h2>Update Waiver Status: </h2>
        <Form>
          <FormGroup>
            <h5>School:</h5>
            <Row>
              <Col md="10" sm="12" xs="12" className="mt-2">
                <Input
                  type="select"
                  name="school"
                  className="form-control"
                  id="school"
                  onChange={this.handleWaiver}
                >
                  {this.generateSchoolOptions()}
                </Input>
              </Col>
              <Col md="2" sm="12" xs="12" className="mt-2">
                <Input
                  type="button"
                  className="btn-primary float-right"
                  value="Confirm!"
                  onClick={this.handleWaiverSubmit}
                ></Input>
              </Col>
            </Row>
          </FormGroup>
        </Form>
        <hr />
        <br />
        <h2>Add Attendee:</h2>
        <Form onSubmit={this.handleAddAttendee}>
          <label>Name:</label>
          <Input type="text" name="name" id="name" />
          <label>Email:</label>
          <Input type="email" name="email" id="email" />
          <label>Grade:</label>
          <Input type="select" name="grade" id="grade" className="form-control">
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </Input>
          <label>Supervisor:</label>
          <Input
            type="select"
            name="access"
            id="access"
            className="form-control"
          >
            {this.generateTeacherOptions()}
          </Input>
          <Input
            type="submit"
            className="btn btn-primary mt-2"
            value="Add Attendee!"
          />
        </Form>
        <hr />
        <br />
        <h2>All Attendees</h2>
        <div id="table">
          <Table className="table table-responsive">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.state.attendeeList).map((student) => (
                <tr>
                  <td>{student[1].name}</td>
                  <td>{student[1].email}</td>
                  <td>
                    <Input
                      type="select"
                      value={student[1].p1}
                      className="form-control"
                    ></Input>
                  </td>
                  <td>
                    <Input
                      type="select"
                      value={student[1].p2}
                      className="form-control"
                    ></Input>
                  </td>
                  <td>{student[1].note}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}
