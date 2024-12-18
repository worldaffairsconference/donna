import React, { Component } from 'react';
import {
  Button,
  Badge,
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  Alert,
  CardText,
  CardTitle,
  Input,
} from 'reactstrap';
import { StudentRow } from './StudentRow';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { deleteTeacherUserData, logout } from '../../helpers/auth';
import QRCode from 'react-qr-code';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    const userId = firebaseAuth.currentUser.uid;
    // var myStudentDataKey = [];
    // var myStudentDataArr = [];

    // ref
    //   .child('teachers/' + userId + '/students/')
    //   .on('value', function (snapshot) {
    //     snapshot.forEach(function (childSnapshot) {
    //       var childKey = childSnapshot.key;
    //       myStudentDataKey.push(childKey);
    //       var childData = childSnapshot.val();
    //       myStudentDataArr.push(childData);
    //     });
    //   });

    this.toggleModal = this.toggleModal.bind(this);
    this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      userId,
      students: [],
      searchQuery: '',
      alert: false,
      plenOptions: {
        p1: {
          name: 'Plenary 1',
          options: [
            { id: 'p1o1', name: 'Plenary 1 Option 1' },
            { id: 'p1o2', name: 'Plenary 1 Option 2' },
            { id: 'p1o3', name: 'Plenary 1 Option 3' },
          ],
        },
        p2: {
          name: 'Plenary 2',
          options: [
            { id: 'p2o1', name: 'Plenary 2 Option 1' },
            { id: 'p2o2', name: 'Plenary 2 Option 2' },
            { id: 'p2o3', name: 'Plenary 2 Option 3' },
          ],
        },
        p3: {
          name: 'Plenary 3',
          options: [
            { id: 'p3o1', name: 'Plenary 3 Option 1' },
            { id: 'p3o2', name: 'Plenary 3 Option 2' },
            { id: 'p3o3', name: 'Plenary 3 Option 3' },
          ],
        },
      },
    };

    this.initializeData = this.initializeData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    // Initialize data retrieval
    this.initializeData(userId);

    // console.log(this.state.myStudentDataKey);
    // console.log(this.state.myStudentDataArr);

    // ref.child('teachers/' + userId).once('value', (snapshot) =>
    //   this.setState({
    //     waiver: snapshot.val().waiver,
    //     name: snapshot.val().name,
    //     school: snapshot.val().school,
    //     students: snapshot.val().students,
    //   })
    // );

    // ref.child('plenaries').once('value', (snapshot) => {
    //   this.setState({ plenOptions: snapshot.val() });
    // });
  }

  componentDidMount() {
    this.initializeData(this.state.userId);
  }

  initializeData(userId) {
    ref.child(`teachers/${userId}/students`).on('value', (snapshot) => {
      const studentData = snapshot.val();
      if (studentData) {
        const students = Object.entries(studentData).map(([id, data]) => ({
          id,
          ...data,
        }));
        this.setState({ students });
      }
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  proceedDeleteAccount() {
    deleteTeacherUserData();
  }

  handleCopy() {
    const text = `https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`;
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    // Show the alert
    this.setState({ alert: true });

    // Hide the alert after 3 seconds
    setTimeout(() => {
      this.setState({ alert: false });
    }, 3000);
  }

  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
  }

  render() {
    const { students, searchQuery } = this.state;
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Container>
        <br />
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h" class="text-white">Teacher Dashboard</h1>
          </Col>
          <Col md="2" sm="12" xs="12">
            <Button
              color="secondary"
              className="float-right mb-2"
              onClick={() => {
                logout();
              }}
            >
              Log Out
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 class="text-white">Supervisor: {this.state.name}</h4>
            <h4 class="text-white">School: {this.state.school}</h4>
          </Col>
        </Row>
        <Row className="mt-3">
          <Card body className="inner-container">
            <CardTitle tag="h5">
              <b>Student Registration Instructions</b>
            </CardTitle>
            <CardText>
              Share the following registration link with your students to register:
            </CardText>
            <CardText>
              <b>
                <a
                  href={`https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                </a>
              </b>
            </CardText>
            <Button color="primary" onClick={this.handleCopy}>
              Copy Registration Link
            </Button>
            {this.state.alert && (
              <Alert color="success" className="mt-2">
                Registration link copied!
              </Alert>
            )}
          </Card>
        </Row>
        <br />
        <hr />
        <h2 class="text-white">Waiver Status: </h2>
        <p class="text-white">
          You will need to complete and sign a waiver before attending the
          conference. Please download the document below and complete the form.
          Send the completed form via this{' '}
          <a href="https://coda.io/form/Waiver_deuhNh1mvi4">link</a>. Once we
          have received and processed your waiver, the status below will change
          to "Received".
        </p>
        {this.state.waiver ? (
          <div>
            <h2>
              <Badge color="success">Received</Badge>
            </h2>
          </div>
        ) : (
          <div>
            <h2>
              <Badge color="danger">Not Received</Badge>
            </h2>
            <Button
              color="primary"
              href="/resources/Teacher Responsibility and Liability Waiver v08.2022.pdf"
              target="_blank"
            >
              Download PDF
            </Button>
          </div>
        )}
        <hr />
        <br />
        <h2 class="text-white">My Students</h2>
        <br />
        <Col md="3" sm="5" xs="10">
        <Input
          type="text"
          className="form-control inner-container input-border-grey"
          placeholder="Search by name"
          value={this.state.searchQuery}
          onChange={this.handleSearch}
        />
        </Col>
        <br />
        <div id="table">
          <Table className="text-white">
            <thead class="text-white">
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Lunch</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Plenary #3</th>
                <th style={{width: '200px'}}>Notes</th>
              </tr>
            </thead>
            <StudentRow
              class="text-white"
              studentData={filteredStudents}
              plenOptions={this.state.plenOptions}
            />
          </Table>
        </div>
      </Container>
    );
  }
}
