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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Label,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ref, firebaseAuth } from '../../helpers/firebase';
import {
  addAttendee,
  adminResetPassword,
  deleteUserData,
} from '../../helpers/auth';
import Papa from 'papaparse';

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebaseAuth.currentUser.uid;

    this.state = {
      modal: [false, '', '', ''],
      userId: userId,
      schoolsList: [],
      fullSchoolList: [],
      teacherList: [],
      schoolNum: 0,
      searchQuery: '',
      searchSchool: '',
      attendeeList: {},        // Keep only attendeeList, no changedAttendeeList
      plenOptions: {
        open: false,
        p1o1: { name: '', location: '', max: 0, students: {} },
        p1o2: { name: '', location: '', max: 0, students: {} },
        p1o3: { name: '', location: '', max: 0, students: {} },
        p2o1: { name: '', location: '', max: 0, students: {} },
        p2o2: { name: '', location: '', max: 0, students: {} },
        p2o3: { name: '', location: '', max: 0, students: {} },
        p3o1: { name: '', location: '', max: 0, students: {} },
        p3o2: { name: '', location: '', max: 0, students: {} },
        p3o3: { name: '', location: '', max: 0, students: {} },
      },
      gradeDropdownOpen: false,
      plenaryDropdownOpen: false,
      selectedGrades: [],
      selectedPlenaries: [],
      exportButtonStatus: 'Export Data',

      lunchCount: 0,
      waiverTrue: 0,
      waiverFalse: 0,
      schoolCounts: {},
      waiverSelectedSchool: '',
      attendeeSelectedTeacher: '',
    };

    // Bind
    this.handleWaiver = this.handleWaiver.bind(this);
    this.handleWaiverSubmit = this.handleWaiverSubmit.bind(this);
    this.copytoClipboard = this.copytoClipboard.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSchoolSearch = this.handleSchoolSearch.bind(this);
    this.toggleGradeDropdown = this.toggleGradeDropdown.bind(this);
    this.togglePlenaryDropdown = this.togglePlenaryDropdown.bind(this);
    this.handleGradeFilter = this.handleGradeFilter.bind(this);
    this.handlePlenaryFilter = this.handlePlenaryFilter.bind(this);
    this.exportData = this.exportData.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  copytoClipboard = (text) => {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  };

  toggle = (email, teacherid, uid) => {
    this.setState({
      modal: [
        !this.state.modal[0],
        email ? email : '',
        teacherid ? teacherid : '',
        uid ? uid : '',
      ],
    });
    if (!this.state.modal[0]) {
      this.copytoClipboard(uid);
    }
  };

  exportData() {
    const { teacherList, attendeeList } = this.state;
    if (!teacherList.length) {
      alert('No data available to export.');
      return;
    }

    const flattenedData = [];

    teacherList.forEach(([teacherName, teacherId, teacherSchool]) => {
      const students = Object.entries(attendeeList).filter(
        ([, student]) => student.teacher === teacherId
      );

      students.forEach(([studentId, student]) => {
        flattenedData.push({
          TeacherID: teacherId,
          TeacherName: teacherName,
          TeacherSchool: teacherSchool,
          StudentID: studentId,
          Name: student.name,
          Email: student.email,
          Grade: student.grade || '',
          Lunch: student.lunch ? 'Yes' : 'No',
          // If you really do use rank1, rank2, rank3, adjust below
          Plenary1: student.p1 || 'None',
          Plenary2: student.p2 || 'None',
          Plenary3: student.p3 || 'None',
          Note: student.note || '',
        });
      });
    });

    if (!flattenedData.length) {
      alert('No student data available to export.');
      return;
    }

    const csv = Papa.unparse(flattenedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'teachers_students_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.setState({ exportButtonStatus: 'Exported!' });
    setTimeout(() => {
      this.setState({ exportButtonStatus: 'Export Data' });
    }, 2000);
  }

  generateOptions() {
    const options = [];
    Object.entries(this.state.plenOptions).forEach(([key, plen]) => {
      if (key.startsWith('p') && plen.name) {
        options.push(
          <option key={key} value={key}>
            {plen.name}
          </option>
        );
      }
    });
    return options;
  }

  async componentDidMount() {
    let fullSchoolList = [''];
    let teacherList = [];
    let schoolNum = 0;
    let attendeeList = {};
    let schoolsList = [['', '']];
    let schoolCounts = {};
    let plenOptions = { open: false };
    let lunchCount = 0;
    let waiverTrue = 0;
    let waiverFalse = 0;

    // Grab teachers
    await ref.child('teachers/').once('value', (snapshot) => {
      schoolNum = 0;
      fullSchoolList = [''];
      teacherList = [];
      attendeeList = {};
      schoolsList = [['', '']];
      schoolCounts = {};

      snapshot.forEach((childSnapshot) => {
        schoolNum += 1;
        var childSchool = childSnapshot.val().school;
        var hasWaiver = childSnapshot.val().waiver || false;

        teacherList.push([childSnapshot.val().name, childSnapshot.key, childSchool]);
        fullSchoolList.push(childSchool);

        if (!hasWaiver) {
          schoolsList.push([childSchool, childSnapshot.key]);
          waiverFalse += 1;
        } else {
          waiverTrue += 1;
        }

        const students = childSnapshot.val().students || {};
        Object.entries(students).forEach(([key, val]) => {
          attendeeList[key] = {
            ...val,
            teacher: childSnapshot.key,
            school: childSchool,
          };

          if (val.lunch) {
            lunchCount += 1;
          }

          if (!schoolCounts[childSchool]) {
            schoolCounts[childSchool] = 0;
          }
          schoolCounts[childSchool] += 1;
        });
      });

      this.setState({
        fullSchoolList,
        schoolsList,
        teacherList,
        attendeeList,
        schoolNum,
        waiverSelectedSchool: schoolsList?.[0]?.[1] || '',
        attendeeSelectedTeacher: teacherList?.[0]?.[1] || '',
        lunchCount,
        waiverTrue,
        waiverFalse,
        schoolCounts,
      });
    });

    // Grab plenaries
    ref.child('plenaries').on('value', (snapshot) => {
      const p = snapshot.val() || { open: false };
      this.setState({ plenOptions: p });
    });
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
    const bars = [];
    Object.entries(this.state.plenOptions).forEach(([key, plen]) => {
      if (key.startsWith('p') && plen.name) {
        bars.push(
          <Row key={key}>
            <Col>
              <h5>
                {plen.name}:
                <Progress
                  value={plen.students ? Object.keys(plen.students).length : 0}
                  max={plen.max || 0}
                />
                {plen.students ? Object.keys(plen.students).length : 0}/
                {plen.max || 0}
              </h5>
            </Col>
          </Row>
        );
      }
    });
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

  handleWaiver(event) {
    this.setState({
      waiverSelectedSchool: event.target.value,
    });
  }

  async handleWaiverSubmit(event) {
    var school = this.state.waiverSelectedSchool;
    await ref.child('teachers/' + school).update({
      waiver: true,
    });
  }

  // Add Attendee
  handleAddAttendee = async (event) => {
    event.preventDefault();
    var name = event.target.name.value;
    var email = event.target.email.value;
    var school = event.target.access.value;
    var grade = event.target.grade.value;
    try {
      var uid = await addAttendee(
        email,
        (Math.random() + 1).toString(36),
        name,
        grade,
        school
      );
      console.log(uid.uid);
      this.copytoClipboard(uid.uid);
      alert('Added attendee with UID:' + uid.uid);
    } catch (e) {
      alert(e);
    }
  };

  // Modal actions
  resetPassword = () => {
    console.log('resetting password for ' + this.state.modal[1]);
    adminResetPassword(this.state.modal[1]);
    this.toggle();
  };

  deleteAccount = () => {
    console.log(
      'deleting account for ' +
        this.state.modal[1] +
        ' uid: ' +
        this.state.modal[3] +
        ' tid: ' +
        this.state.modal[2]
    );
    deleteUserData(this.state.modal[3], this.state.modal[2]);
    this.toggle();
  };

  // === APPROACH #2: Single source of truth in `attendeeList` ===

  /**
   * Whenever a field changes, update attendeeList[studentId] directly.
   */
  handleInputChange(event, studentId) {
    const { name, value, type, checked } = event.target;
    this.setState((prevState) => ({
      attendeeList: {
        ...prevState.attendeeList,
        [studentId]: {
          ...prevState.attendeeList[studentId],
          [name]: type === 'checkbox' ? checked : value,
        },
      },
    }));
  }

  /**
   * Called when user clicks the "Update" button.
   * Push the student’s current data from attendeeList into Firebase.
   */
  async handleUpdate(studentId) {
    const updatedStudent = this.state.attendeeList[studentId];
    if (!updatedStudent) return;

    try {
      // Update the Firebase database with the entire updated object
      await ref
        .child(`teachers/${updatedStudent.teacher}/students/${studentId}`)
        .update({ ...updatedStudent });

      alert('Student updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  }

  // === Filter / search logic ===

  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
  }

  handleSchoolSearch(event) {
    this.setState({ searchSchool: event.target.value });
  }

  toggleGradeDropdown() {
    this.setState({ gradeDropdownOpen: !this.state.gradeDropdownOpen });
  }

  togglePlenaryDropdown() {
    this.setState({ plenaryDropdownOpen: !this.state.plenaryDropdownOpen });
  }

  handleGradeFilter(grade) {
    const selectedGrades = [...this.state.selectedGrades];
    const index = selectedGrades.indexOf(grade);
    if (index > -1) {
      selectedGrades.splice(index, 1);
    } else {
      selectedGrades.push(grade);
    }
    this.setState({ selectedGrades });
  }

  handlePlenaryFilter(plenary) {
    const selectedPlenaries = [...this.state.selectedPlenaries];
    const index = selectedPlenaries.indexOf(plenary);
    if (index > -1) {
      selectedPlenaries.splice(index, 1);
    } else {
      selectedPlenaries.push(plenary);
    }
    this.setState({ selectedPlenaries });
  }

  render() {
    const {
      attendeeList,
      searchQuery,
      searchSchool,
      selectedGrades,
      selectedPlenaries,
      schoolCounts,
    } = this.state;

    // Filter logic: build an array from attendeeList entries, then filter by name/school/grade/plenary
    const filteredStudents = Object.entries(attendeeList).filter(
      ([, student]) => {
        if (!student) return false; // safety
        // Match name
        const nameMatch = student.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        // Match school
        const schoolMatch = student.school
          .toLowerCase()
          .includes(searchSchool.toLowerCase());
        // Match grade
        const gradeMatch =
          selectedGrades.length === 0 || selectedGrades.includes(student.grade);
        // Match plenary
        const plenaryMatch =
          selectedPlenaries.length === 0 ||
          selectedPlenaries.some(
            (p) => student.p1 === p || student.p2 === p || student.p3 === p
          );

        return nameMatch && schoolMatch && gradeMatch && plenaryMatch;
      }
    );

    // We will group those filtered students by their school
    const groupedBySchool = {};
    filteredStudents.forEach(([studentId, student]) => {
      const sch = student.school || 'Unknown School';
      if (!groupedBySchool[sch]) {
        groupedBySchool[sch] = [];
      }
      groupedBySchool[sch].push([studentId, student]);
    });

    return (
      <Container>
        {/* Modal for account actions */}
        <Modal isOpen={this.state.modal[0]} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Account Actions</ModalHeader>
          <ModalBody>Select actions to perform on account</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.resetPassword}>
              Reset Password
            </Button>{' '}
            <Button color="warning" onClick={this.deleteAccount}>
              Delete Account
            </Button>{' '}
            <Button color="danger" onClick={this.toggle}>
              Close
            </Button>{' '}
          </ModalFooter>
        </Modal>

        <br />
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h text-white">Admin Dashboard</h1>
          </Col>
          <Col md="2" sm="12" xs="12">
            <Link className="btn btn-secondary float-right mb-2" to="/dashboard">
              Return
            </Link>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Button color="info" onClick={this.exportData}>
              {this.state.exportButtonStatus}
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Card body className="inner-container">
            <CardTitle tag="h3" className="text-white">
              Conference Statistics
            </CardTitle>
            <CardText>
              <h5>Schools: {this.state.schoolNum}</h5>
              <h5>Attendees: {Object.keys(this.state.attendeeList).length}</h5>
              <h5>Lunch Orders: {this.state.lunchCount}</h5>
              <h5>Waivers Signed: {this.state.waiverTrue}</h5>
              <h5>Waivers Pending: {this.state.waiverFalse}</h5>
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

        {/* Waiver Status Update */}
        <h2 className="text-white">Update Waiver Status:</h2>
        <Form>
          <FormGroup>
            <h5 className="text-white">School:</h5>
            <Row>
              <Col md="10" sm="12" xs="12" className="mt-2">
                <Input
                  type="select"
                  name="school"
                  className="form-control inner-container input-border-grey"
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

        {/* Add Attendee */}
        <h2 className="text-white">Add Attendee:</h2>
        <Form onSubmit={this.handleAddAttendee}>
          <Label className="text-white">Name:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="text"
            name="name"
            id="name"
          />
          <Label className="text-white">Email:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="email"
            name="email"
            id="email"
          />
          <Label className="text-white">Grade:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="select"
            name="grade"
            id="grade"
          >
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="other">Other</option>
          </Input>
          <Label className="text-white">Supervisor:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="select"
            name="access"
            id="access"
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

        {/* All Attendees */}
        <h2 className="text-white">All Attendees</h2>
        <Row className="mb-4">
          <Col md="3" sm="5" xs="10">
            <Input
              className="form-control inner-container input-border-grey"
              type="text"
              placeholder="Search by name"
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
          </Col>
          <Col md="3" sm="5" xs="12">
            <Input
              className="form-control inner-container input-border-grey"
              type="text"
              placeholder="Search by school"
              value={this.state.searchSchool}
              onChange={this.handleSchoolSearch}
            />
          </Col>
          <Col md="9" sm="7" xs="12" className="d-flex align-items-center">
            <Label className="mr-2 mb-0 text-white">Filters:</Label>
            <Dropdown
              isOpen={this.state.gradeDropdownOpen}
              toggle={this.toggleGradeDropdown}
              className="mr-2"
            >
              <DropdownToggle caret>Grade</DropdownToggle>
              <DropdownMenu style={{ minWidth: '190px' }}>
                {['7', '8', '9', '10', '11', '12', 'other'].map((grade) => (
                  <div key={grade} className="px-5 py-1 d-flex align-items-center">
                    <Input
                      type="checkbox"
                      checked={this.state.selectedGrades.includes(grade)}
                      onChange={() => this.handleGradeFilter(grade)}
                      className="mr-2"
                    />
                    <span>Grade {grade}</span>
                  </div>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown
              isOpen={this.state.plenaryDropdownOpen}
              toggle={this.togglePlenaryDropdown}
            >
              <DropdownToggle caret>Plenary</DropdownToggle>
              <DropdownMenu style={{ minWidth: '500px', columns: '2' }}>
                {Object.entries(this.state.plenOptions)
                  .filter(([key, val]) => key.startsWith('p') && val.name)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="px-5 py-1 d-flex align-items-top"
                      style={{ breakInside: 'avoid' }}
                    >
                      <Input
                        type="checkbox"
                        checked={this.state.selectedPlenaries.includes(key)}
                        onChange={() => this.handlePlenaryFilter(key)}
                        className="mr-2"
                      />
                      <span style={{ whiteSpace: 'normal' }}>{val.name}</span>
                    </div>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>

        {(selectedGrades.length > 0 || selectedPlenaries.length > 0) && (
          <Row className="mb-3">
            <Col>
              <h5 className="text-white">Active Filters:</h5>
              {selectedGrades.map((grade) => (
                <Badge key={grade} color="info" className="mr-2 p-2">
                  Grade {grade}
                  <span
                    className="ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleGradeFilter(grade)}
                  >
                    ×
                  </span>
                </Badge>
              ))}
              {selectedPlenaries.map((plenary) => (
                <Badge key={plenary} color="info" className="mr-2 p-2">
                  {this.state.plenOptions[plenary].name}
                  <span
                    className="ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handlePlenaryFilter(plenary)}
                  >
                    ×
                  </span>
                </Badge>
              ))}
            </Col>
          </Row>
        )}

        <div id="table">
          <Table className="table">
            <thead className="text-white">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Lunch</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Plenary #3</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedBySchool).length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-white">
                    No attendees found.
                  </td>
                </tr>
              ) : (
                Object.entries(groupedBySchool).map(([school, students]) => (
                  <React.Fragment key={school}>
                    <tr>
                      <th
                        colSpan="8"
                        style={{
                          textAlign: 'center',
                          fontSize: '18px',
                          backgroundColor: '#222',
                          color: 'white',
                        }}
                      >
                        {school} ({students.length} students)
                      </th>
                    </tr>
                    {students.map(([studentId, student]) => (
                      <tr key={studentId}>
                        <td>
                          <Input
                            type="text"
                            name="name"
                            value={student.name || ''}
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          />
                        </td>
                        <td>
                          <a
                            className="passwdresetclick"
                            style={{ cursor: 'pointer', color: '#0dcaf0' }}
                            onClick={() => {
                              this.toggle(student.email, student.teacher, studentId);
                            }}
                          >
                            {student.email}
                          </a>
                        </td>
                        <td>
                          <Input
                            type="checkbox"
                            name="lunch"
                            checked={!!student.lunch}
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="select"
                            name="p1"
                            value={student.p1 || 'None'}
                            className="form-control"
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          >
                            <option value="None">None</option>
                            {this.generateOptions()}
                          </Input>
                        </td>
                        <td>
                          <Input
                            type="select"
                            name="p2"
                            value={student.p2 || 'None'}
                            className="form-control"
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          >
                            <option value="None">None</option>
                            {this.generateOptions()}
                          </Input>
                        </td>
                        <td>
                          <Input
                            type="select"
                            name="p3"
                            value={student.p3 || 'None'}
                            className="form-control"
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          >
                            <option value="None">None</option>
                            {this.generateOptions()}
                          </Input>
                        </td>
                        <td>
                          <Input
                            type="textarea"
                            name="note"
                            value={student.note || ''}
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                            }}
                            onClick={() => this.handleUpdate(studentId)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div>
          <br />
          <hr />
          <h2 className="text-white">School List:</h2>
          {this.state.fullSchoolList.map((school, index) => {
            return (
              <p className="text-white" key={index}>
                {school}
              </p>
            );
          })}
        </div>
      </Container>
    );
  }
}
