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
    var userId = firebaseAuth.currentUser.uid;
    var myStudentDataKey = [];
    var myStudentDataArr = [];

    ref
      .child('teachers/' + userId + '/students/')
      .on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          myStudentDataKey.push(childKey);
          var childData = childSnapshot.val();
          myStudentDataArr.push(childData);
        });
      });

    this.toggleModal = this.toggleModal.bind(this);
    this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      myStudentDataKey: myStudentDataKey,
      myStudentDataArr: myStudentDataArr,
      searchQuery: '',
      modal: false,
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
      alert: true,
    };

    // console.log(this.state.myStudentDataKey);
    // console.log(this.state.myStudentDataArr);

    ref.child('teachers/' + userId).once('value', (snapshot) =>
      this.setState({
        waiver: snapshot.val().waiver,
        name: snapshot.val().name,
        school: snapshot.val().school,
        students: snapshot.val().students,
      })
    );

    ref.child('plenaries').once('value', (snapshot) => {
      this.setState({ plenOptions: snapshot.val() });
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
    var Text = `https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`;
    var dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = Text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    // alert then dissapear after 3 seconds
    this.setState({ alert: false });
    setTimeout(() => {
      this.setState({ alert: true });
    }, 3000);
  }

  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
  }

  render() {
    const { myStudentDataArr, searchQuery } = this.state;
    const filteredStudents = myStudentDataArr.filter((student) =>
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
                >
                </a>
              </b>
            </CardText>
            <Button color="primary" onClick={this.handleCopy}>
              Copy Registration Link
            </Button>
            {!this.state.alert && <Alert color="success">Registration link copied!</Alert>}
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
          <Table>
            <thead class="text-white">
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Plenary #3</th>
                <th>Notes</th>
              </tr>
            </thead>
            <StudentRow
              class="text-white"
              studentData={filteredStudents}
              studentKey={this.state.myStudentDataKey}
              plenOptions={this.state.plenOptions}
            />
          </Table>
        </div>
      </Container>
    );
  }
}
