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
import { addAttendee, adminResetPassword } from '../../helpers/auth';

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebaseAuth.currentUser.uid;

    this.state = {
      modal: [false, ''],
      userId: userId,
      schoolsList: [],
      fullSchoolList: [],
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
        p9: { name: '', students: {}, max: 0 },
      },
    };
  }

  toggle = (email) => {
    this.setState({
      modal: [!this.state.modal[0], email ? email : ''],
    });
  };

  generateOptions() {
    var options = [];
    var length = Object.keys(this.state.plenOptions).length;
    for (var i = 1; i < length; i++) {
      if (this.state.plenOptions['p' + i].name != '') {
        options.push(
          <option value={'p' + i}>
            {this.state.plenOptions['p' + i].name}
          </option>
        );
      }
    }
    return options;
  }

  async componentDidMount() {
    var schoolsList = [['', '']];
    var fullSchoolList = [''];
    var teacherList = [];
    var schoolNum = 0;
    var attendeeList = {};
    var teamAttendeeCount = 0;
    await ref.child('teachers/').once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        schoolNum += 1;
        var childSchool = childSnapshot.val().school;
        teacherList.push([
          childSnapshot.val().name,
          childSnapshot.key,
          childSchool,
        ]);
        fullSchoolList.push(childSchool);
        if (!childSnapshot.val().waiver) {
          schoolsList.push([childSchool, childSnapshot.key]);
        }
        if (childSnapshot.val().students) {
          Object.entries(childSnapshot.val().students).forEach(([key, val]) => {
            attendeeList[key] = {
              ...val,
              teacher: childSnapshot.key,
              school: childSchool,
            };
          });
        }
        if (childSnapshot.key === 'pgZud1mNSaZLDbRxLuA4NRoH4Qk2') {
          teamAttendeeCount = Object.keys(childSnapshot.val().students).length;
        }
      });
    });
    var plenOptions = await ref.child('plenaries').once('value');
    this.setState({
      schoolsList: schoolsList,
      fullSchoolList: fullSchoolList,
      waiverSelectedSchool: schoolsList[0][1],
      attendeeSelectedTeacher: teacherList[0][1],
      schoolNum: schoolNum,
      attendeeList: attendeeList,
      changedAttendeeList: attendeeList,
      teacherList: teacherList,
      plenOptions: plenOptions.val(),
      teamAttendeeCount: teamAttendeeCount,
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

  generateStatusBars() {
    var length = Object.keys(this.state.plenOptions).length;
    var bars = [];
    //<h5>
    //{this.state.plenOptions.p1.name}:
    //<Progress
    //value={
    //this.state.plenOptions.p1.students
    //? Object.keys(this.state.plenOptions.p1.students).length
    //: 0
    //}
    //max={this.state.plenOptions.p1.max}
    ///>
    //{this.state.plenOptions.p1.students
    //? Object.keys(this.state.plenOptions.p1.students).length
    //: 0}
    ///{this.state.plenOptions.p1.max}
    //</h5>

    for (var i = 1; i < length; i++) {
      var plen = this.state.plenOptions['p' + i];
      bars.push(
        <Row>
          <Col>
            <h5>
              {plen.name}:
              <Progress
                value={plen.students ? Object.keys(plen.students).length : 0}
                max={plen.max}
              />
              {plen.students ? Object.keys(plen.students).length : 0}/{plen.max}
            </h5>
          </Col>
        </Row>
      );
    }

    return bars;
  }

  generateTeacherOptions() {
    var options = [];
    for (var i = 0; i < this.state.teacherList.length; i++) {
      options.push(
        <option
          key={this.state.teacherList[i][1]}
          value={this.state.teacherList[i][1]}
        >
          {this.state.teacherList[i][0]}, {this.state.teacherList[i][2]}
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

  resetPassword = () => {
    console.log('resetting password for ' + this.state.modal[1]);
    adminResetPassword(this.state.modal[1]);
    this.toggle();
  };

  generateRows(list) {
    var rows = [];
    let previousSchool = '';
    Object.entries(list).forEach((student, index) => {
      if (student[1].school !== previousSchool) {
        // Add devider row
        rows.push(
          <tr>
            <td colSpan="6" className="table-secondary">
              {student[1].school} -{' '}
              {
                this.state.teacherList.filter(
                  (teacher) => teacher[1] === student[1].teacher
                )[0][0]
              }
            </td>
          </tr>
        );
        previousSchool = student[1].school;
      }

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
          <td>
            <a
              className="passwdresetclick"
              onClick={() => {
                this.toggle(student[1].email);
              }}
            >
              {student[1].email}
            </a>
          </td>
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
              <option value="">None</option>
              {this.generateOptions()}
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
              <option value="">None</option>

              {this.generateOptions()}
            </Input>
          </td>
          <td>
            <Input
              type="select"
              value={student[1].p3}
              className="form-control"
              onChange={(event) => {
                this.setState({
                  changedAttendeeList: {
                    ...this.state.changedAttendeeList,
                    [student[0]]: { ...student[1], p3: event.target.value },
                  },
                });
              }}
            >
              <option value="">None</option>
              {this.generateOptions()}
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
                    this.state.attendeeList[student[0]].p2 ||
                  this.state.changedAttendeeList[student[0]].p3 !==
                    this.state.attendeeList[student[0]].p3
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
                  if (this.state.attendeeList[student[0]].p3 !== '') {
                    await ref
                      .child(
                        `plenaries/${
                          this.state.attendeeList[student[0]].p3
                        }/students/${student[0]}`
                      )
                      .remove();
                  }

                  if (this.state.changedAttendeeList[student[0]].p1 !== '') {
                    await ref
                      .child(
                        `plenaries/${
                          this.state.changedAttendeeList[student[0]].p1
                        }/students/${student[0]}`
                      )
                      .set(true);
                  }
                  if (this.state.changedAttendeeList[student[0]].p2 !== '') {
                    await ref
                      .child(
                        `plenaries/${
                          this.state.changedAttendeeList[student[0]].p2
                        }/students/${student[0]}`
                      )
                      .set(true);
                  }
                  if (this.state.changedAttendeeList[student[0]].p3 !== '') {
                    await ref
                      .child(
                        `plenaries/${
                          this.state.changedAttendeeList[student[0]].p3
                        }/students/${student[0]}`
                      )
                      .set(true);
                  }
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
        <Modal isOpen={this.state.modal[0]} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            What is an Access Code?
          </ModalHeader>
          <ModalBody>Confirm you want to send password reset email?</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.resetPassword}>
              Confirm!
            </Button>{' '}
            <Button color="danger" onClick={this.toggle}>
              Close
            </Button>{' '}
          </ModalFooter>
        </Modal>
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
              {/* <h5>Attendees: {(Object.keys(this.state.attendeeList).length - this.state.teamAttendeeCount)}</h5> */}
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
              <hr />
              {this.generateStatusBars()}
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
            <option value="other">Other</option>
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
                <th>Plenary #3</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{this.generateRows(this.state.changedAttendeeList)}</tbody>
          </Table>
        </div>
        <div>
          <br />
          <hr />
          <h2>School List:</h2>
          {this.state.fullSchoolList.map((school, index) => {
            return <p>{school}</p>;
          })}
        </div>
      </Container>
    );
  }
}
