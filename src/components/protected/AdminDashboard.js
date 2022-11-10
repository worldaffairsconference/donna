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
  Badge,
  Button,
  Progress,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { addAttendee, resetPassword } from '../../helpers/auth';

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebaseAuth.currentUser.uid;

    this.state = {
      userId: userId,
      schoolsList: [],
      teacherList: [],
      schoolNum: 0,
      attendeeList: {},
      changedAttendeeList: {},
      plenOptions: {
        open: false,
        p1: { name: '', students: {}, max: 0 },
        p2: { name: '', students: {}, max: 0 },
        p3: { name: '', students: {}, max: 0 },
        p4: { name: '', students: {}, max: 0 },
        p5: { name: '', students: {}, max: 0 },
        p6: { name: '', students: {}, max: 0 },
        p7: { name: '', students: {}, max: 0 },
        p8: { name: '', students: {}, max: 0 },
      },
    };
  }

  async componentDidMount() {
    var schoolsList = [['', '']];
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
          Object.entries(childSnapshot.val().students).forEach(([key, val]) => {
            attendeeList[key] = { ...val, teacher: childSnapshot.key };
          });
        }
      });
    });
    var plenOptions = await ref.child('plenaries').once('value');
    this.setState({
      schoolsList: schoolsList,
      waiverSelectedSchool: schoolsList[0][1],
      attendeeSelectedTeacher: teacherList[0][1],
      schoolNum: schoolNum,
      attendeeList: attendeeList,
      changedAttendeeList: attendeeList,
      teacherList: teacherList,
      plenOptions: plenOptions.val(),
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

  generateRows(list) {
    var rows = [];
    Object.entries(list).forEach((student, index) => {
      rows.push(
        <tr>
          <td>
            <Input
              type="text"
              value={student[1].name}
              onChange={(event) => {
                this.setState({
                  changedAttendeeList: {
                    ...this.state.changedAttendeeList,
                    [student[0]]: { ...student[1], name: event.target.value },
                  },
                });
              }}
              name={`name${student[0]}`}
            ></Input>
          </td>
          <td>{student[1].email}</td>
          <td>
            <Input
              type="select"
              value={student[1].p1}
              className="form-control"
              onChange={(event) => {
                this.setState({
                  changedAttendeeList: {
                    ...this.state.changedAttendeeList,
                    [student[0]]: { ...student[1], p1: event.target.value },
                  },
                });
              }}
            >
              <option value="p1">{this.state.plenOptions.p1.name}</option>
              <option value="p2">{this.state.plenOptions.p2.name}</option>
              <option value="p3">{this.state.plenOptions.p3.name}</option>
              <option value="p4">{this.state.plenOptions.p4.name}</option>
            </Input>
          </td>
          <td>
            <Input
              type="select"
              value={student[1].p2}
              className="form-control"
              onChange={(event) => {
                this.setState({
                  changedAttendeeList: {
                    ...this.state.changedAttendeeList,
                    [student[0]]: { ...student[1], p2: event.target.value },
                  },
                });
              }}
            >
              <option value="p5">{this.state.plenOptions.p5.name}</option>
              <option value="p6">{this.state.plenOptions.p6.name}</option>
              <option value="p7">{this.state.plenOptions.p7.name}</option>
              <option value="p8">{this.state.plenOptions.p8.name}</option>
            </Input>
          </td>
          <td>
            <Input
              className="form-control"
              value={student[1].note}
              onChange={(event) => {
                this.setState({
                  changedAttendeeList: {
                    ...this.state.changedAttendeeList,
                    [student[0]]: { ...student[1], note: event.target.value },
                  },
                });
              }}
              type="textarea"
              name="name"
              id="accessibility"
            />
          </td>
          <td>
            <Button
              color="primary"
              disabled={
                this.state.attendeeList[student[0]] ===
                this.state.changedAttendeeList[student[0]]
              }
              onClick={async () => {
                await ref
                  .child(
                    'teachers/' + student[1].teacher + '/students/' + student[0]
                  )
                  .update({
                    ...this.state.changedAttendeeList[student[0]],
                    teacher: null,
                  });
                if (
                  this.state.changedAttendeeList[student[0]].p1 !==
                    this.state.attendeeList[student[0]].p1 ||
                  this.state.changedAttendeeList[student[0]].p2 !==
                    this.state.attendeeList[student[0]].p2
                ) {
                  if (this.state.attendeeList[student[0]].p1 !== '') {
                    await ref
                      .child(
                        `plenaries/${
                          this.state.attendeeList[student[0]].p1
                        }/students/${student[0]}`
                      )
                      .remove();
                  }
                  if (this.state.attendeeList[student[0]].p2 !== '') {
                    await ref
                      .child(
                        `plenaries/${
                          this.state.attendeeList[student[0]].p2
                        }/students/${student[0]}`
                      )
                      .remove();
                  }

                  await ref
                    .child(
                      `plenaries/${
                        this.state.changedAttendeeList[student[0]].p1
                      }/students/${student[0]}`
                    )
                    .set(true);
                  await ref
                    .child(
                      `plenaries/${
                        this.state.changedAttendeeList[student[0]].p2
                      }/students/${student[0]}`
                    )
                    .set(true);
                }
                this.setState({
                  attendeeList: {
                    ...this.state.attendeeList,
                    [student[0]]: student[1],
                  },
                });
              }}
            >
              Update
            </Button>
          </td>
        </tr>
      );
    });
    return rows;
  }

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
              <hr />
              {this.state.plenOptions.open ? (
                <div>
                  <h2>
                    <Badge color="success">Open</Badge>
                  </h2>
                </div>
              ) : (
                <div>
                  <h2>
                    <Badge color="danger">Closed</Badge>
                  </h2>
                </div>
              )}
              <h5>
                {this.state.plenOptions.p1.name}:
                <Progress
                  value={
                    this.state.plenOptions.p1.students
                      ? Object.keys(this.state.plenOptions.p1.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p1.max}
                />
                {this.state.plenOptions.p1.students
                  ? Object.keys(this.state.plenOptions.p1.students).length
                  : 0}
                /{this.state.plenOptions.p1.max}
              </h5>
              <h5>
                {this.state.plenOptions.p2.name}:
                <Progress
                  value={
                    this.state.plenOptions.p2.students
                      ? Object.keys(this.state.plenOptions.p2.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p2.max}
                />
                {this.state.plenOptions.p2.students
                  ? Object.keys(this.state.plenOptions.p2.students).length
                  : 0}
                /{this.state.plenOptions.p2.max}
              </h5>
              <h5>
                {this.state.plenOptions.p3.name}:
                <Progress
                  value={
                    this.state.plenOptions.p3.students
                      ? Object.keys(this.state.plenOptions.p3.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p3.max}
                />
                {this.state.plenOptions.p3.students
                  ? Object.keys(this.state.plenOptions.p3.students).length
                  : 0}
                /{this.state.plenOptions.p3.max}
              </h5>
              <h5>
                {this.state.plenOptions.p4.name}:{' '}
                <Progress
                  value={
                    this.state.plenOptions.p4.students
                      ? Object.keys(this.state.plenOptions.p4.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p4.max}
                />
                {this.state.plenOptions.p4.students
                  ? Object.keys(this.state.plenOptions.p4.students).length
                  : 0}
                /{this.state.plenOptions.p4.max}
              </h5>
              <h5>
                {this.state.plenOptions.p5.name}:
                <Progress
                  value={
                    this.state.plenOptions.p5.students
                      ? Object.keys(this.state.plenOptions.p5.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p5.max}
                />
                {this.state.plenOptions.p5.students
                  ? Object.keys(this.state.plenOptions.p5.students).length
                  : 0}
                /{this.state.plenOptions.p5.max}
              </h5>
              <h5>
                {this.state.plenOptions.p6.name}:
                <Progress
                  value={
                    this.state.plenOptions.p6.students
                      ? Object.keys(this.state.plenOptions.p6.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p6.max}
                />
                {this.state.plenOptions.p6.students
                  ? Object.keys(this.state.plenOptions.p6.students).length
                  : 0}
                /{this.state.plenOptions.p6.max}
              </h5>
              <h5>
                {this.state.plenOptions.p7.name}:
                <Progress
                  value={
                    this.state.plenOptions.p7.students
                      ? Object.keys(this.state.plenOptions.p7.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p7.max}
                />
                {this.state.plenOptions.p7.students
                  ? Object.keys(this.state.plenOptions.p7.students).length
                  : 0}
                /{this.state.plenOptions.p7.max}
              </h5>
              <h5>
                {this.state.plenOptions.p8.name}:{' '}
                <Progress
                  value={
                    this.state.plenOptions.p8.students
                      ? Object.keys(this.state.plenOptions.p8.students).length
                      : 0
                  }
                  max={this.state.plenOptions.p8.max}
                />
                {this.state.plenOptions.p8.students
                  ? Object.keys(this.state.plenOptions.p8.students).length
                  : 0}
                /{this.state.plenOptions.p8.max}
              </h5>
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
          <Table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.generateRows(this.state.changedAttendeeList)}</tbody>
          </Table>
        </div>
      </Container>
    );
  }
}