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
} from 'reactstrap';
import { StudentRow } from './StudentRow';
import { ref, firebaseAuth } from '../../helpers/firebase';
import AddStudent from './AddStudent';
import {
  Plenaries,
  Year,
  EarlyBirdDueDate,
  DueDate,
  Links,
} from '../../config/config.js';
import { deleteTeacherUserData } from '../../helpers/auth';

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

    this.state = {
      myStudentDataKey: myStudentDataKey,
      myStudentDataArr: myStudentDataArr,
      modal: false,
    };

    // console.log(this.state.myStudentDataKey);
    // console.log(this.state.myStudentDataArr);

    ref.child('teachers/' + userId).once('value', (snapshot) =>
      this.setState({
        waiver: snapshot.val().waiver,
        name: snapshot.val().name,
        school: snapshot.val().school,
        students : snapshot.val().students,
      })
    );
  }
  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  proceedDeleteAccount() {
    deleteTeacherUserData();
  }

  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h">Teacher Dashboard</h1>
            <b>Teacher ID: {firebaseAuth.currentUser.uid}</b>
          </Col>
          <Col md="2" sm="12" xs="12">
            <Button
              color="danger"
              className="fonted"
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
        <br />
        {this.state.waiver ? (
          <div>
            <h2>
              Waiver Status: <br />
              <Badge color="success">Received</Badge>
            </h2>
          </div>
        ) : (
          <div>
            <h2>
              Waiver Status: <br />
              <Badge color="danger">Not Received</Badge>
            </h2>
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
                <th>Notes</th>
              </tr>
            </thead>
            <StudentRow
              studentData={this.state.myStudentDataArr}
              studentKey={this.state.myStudentDataKey}
            />
          </Table>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
    );
  }
}
