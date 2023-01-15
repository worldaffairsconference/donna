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

    this.state = {
      myStudentDataKey: myStudentDataKey,
      myStudentDataArr: myStudentDataArr,
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
    var Text = `Register: https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`;
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

  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col md="8" sm="12" xs="12">
            <h1 className="fonted-h">Teacher Dashboard</h1>
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
          <Col md="2" sm="12" xs="12">
            <Button
              color="danger"
              className="fonted float-right mb-2"
              onClick={this.toggleModal}
            >
              Delete Account
            </Button>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggleModal}
              className="modal-dialog"
            >
              <ModalHeader toggle={this.toggleModal}>
                Delete Account
              </ModalHeader>
              <ModalBody>
                Your information and registered students will be deleted from
                our database. Do you want to proceed?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.proceedDeleteAccount}>
                  Delete
                </Button>{' '}
                <Button color="secondary" onClick={this.toggleModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Supervisor: {this.state.name}</h4>
            <h4>School: {this.state.school}</h4>
          </Col>
        </Row>
        <Row className="mt-3">
          <Card body>
            <CardTitle tag="h5">
              <b> Student Registration Instructions</b>
            </CardTitle>
            <CardText>
              Please have your students register for the conference using this
              website, you will be able to see them listed below once they have
              registered. Copy the student access code below and provide it to
              your student delegates. Alternatively, students can scan the QR
              code which contains the access code information. If you have any
              questions, please
              <a href="mailto:wac@ucc.on.ca"> contact us</a>.
              <br />
              <hr />
              <Row>
                <Col lg={9} md={9} sm={12} xs={12} className="mt-2">
                  <Alert color="success" hidden={this.state.alert}>
                    {' '}
                    Copied to clipboard!{' '}
                  </Alert>
                  <center>
                    <h5>
                      <b>Access Code: </b>
                      {firebaseAuth.currentUser.uid}
                    </h5>
                    <br />
                    <Button
                      color="primary"
                      onClick={this.handleCopy}
                      className="mt-2"
                    >
                      Copy Registration Info to Clipboard
                    </Button>
                  </center>
                </Col>
                <Col lg={3} md={3} sm={12} xs={12} className="mt-2">
                  <center>
                    {' '}
                    <QRCode
                      value={`https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`}
                      style={{
                        height: 'auto',
                        width: '100%',
                        maxWidth: '200px',
                      }}
                      viewBox={`0 0 256 256`}
                    />
                  </center>
                </Col>
              </Row>
            </CardText>
          </Card>
        </Row>
        <br />
        <hr />
        <h2>Waiver Status: </h2>
        <p>
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
        <h2>My Students</h2>
        <br />
        <div id="table">
          <Table>
            <thead>
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
              studentData={this.state.myStudentDataArr}
              studentKey={this.state.myStudentDataKey}
              plenOptions={this.state.plenOptions}
            />
          </Table>
        </div>
      </Container>
    );
  }
}
