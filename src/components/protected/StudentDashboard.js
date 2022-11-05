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
  Input,
  Label,
  FormGroup,
  Card,
  Form,
  CardFooter,
} from 'reactstrap';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { deleteUserData, logout } from '../../helpers/auth';

export default class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebaseAuth.currentUser.uid;

    this.toggleModal = this.toggleModal.bind(this);
    this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this);

    this.state = {
      modal: false,

      inputNotes: '',
      inputPlen1: '',
      inputPlen2: '',

      name: '',
      userid: userId,
      school: '',
      teacher: '',
      p1: '',
      p2: '',
      notes: '',
      greet: [
        'What are you doing that early?',
        'Good Morning',
        'Good Afternoon',
        'Good Evening',
      ][parseInt((new Date().getHours() / 24) * 4)],
    };

    // bind everythiung
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handlePlen1Change = this.handlePlen1Change.bind(this);
    this.handlePlen2Change = this.handlePlen2Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Get users/${user.uid}
  }

  componentDidMount() {
    ref.child(`students/${this.state.userid}`).once('value', (snapshot) => {
      const teacher = snapshot.val().teacherID;
      // Get teachers/${user.uid}/students
      ref.child(`teachers/${teacher}`).once('value', (snapshot) => {
        this.setState({
          modal: false,
          name: snapshot.val().students[this.state.userid].name,
          school: snapshot.val().school,
          teacher: snapshot.val().name,
          teacherID: teacher,
          p1: snapshot.val().students[this.state.userid].p1,
          inputPlen1: snapshot.val().students[this.state.userid].p1,
          p2: snapshot.val().students[this.state.userid].p2,
          inputPlen2: snapshot.val().students[this.state.userid].p2,
          inputNotes: snapshot.val().students[this.state.userid].note,
          notes: snapshot.val().students[this.state.userid].note,
        });
      });
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  handleNoteChange(event) {
    this.setState({ inputNotes: event.target.value });
  }

  handlePlen1Change(event) {
    this.setState({ inputPlen1: event.target.value });
  }

  handlePlen2Change(event) {
    this.setState({ inputPlen2: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    // Update teachers/${user.uid}/students
    ref
      .child(`teachers/${this.state.teacherID}/students/${this.state.userid}`)
      .update({
        note: this.state.inputNotes,
        p1: this.state.inputPlen1,
        p2: this.state.inputPlen2,
      });

    this.setState({
      notes: this.state.inputNotes,
      p1: this.state.inputPlen1,
      p2: this.state.inputPlen2,
    });
  }

  proceedDeleteAccount() {
    deleteUserData(this.state.teacherID);
  }

  render() {
    return (
      <Container>
        <br />
        <Row>
          <Col md="8" sm="12" xs="12">
            <h1 className="fonted-h">
              {' '}
              {this.state.greet}, {this.state.name}{' '}
            </h1>
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
              className="fonted mb-2 float-right"
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
                Your information and will be deleted from our database. Do you
                want to proceed?
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
          <Col md="10" sm="12" xs="12">
            <b>School</b>: {this.state.school}
            <br />
            <b>Teacher</b>: {this.state.teacher}
            <br />
          </Col>
        </Row>
        <hr />
        <Card className="pt-4">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col sm="4" lg="6">
                <FormGroup check>
                  <Label>Choose Plenary 1 </Label>
                </FormGroup>
                <FormGroup
                  onChange={this.handlePlen1Change}
                  check
                  className="mr-2"
                >
                  <Input
                    value={this.state.inputPlen1}
                    className="form-control"
                    type="select"
                    name="select1"
                    id="select1"
                    disabled
                  >
                    <option value="Plenary 1">Plenary 1</option>
                    <option value="Plenary 2">Plenary 2</option>
                    <option value="Plenary 3">Plenary 3</option>
                    <option value="Plenary 4">Plenary 4</option>
                  </Input>
                </FormGroup>
                <br />
                <FormGroup check>
                  <Label>Choose Plenary 2 </Label>
                </FormGroup>
                <FormGroup
                  onChange={this.handlePlen2Change}
                  check
                  className="mr-2"
                >
                  <Input
                    value={this.state.inputPlen2}
                    className="form-control"
                    type="select"
                    name="select2"
                    id="select2"
                    disabled
                  >
                    <option value="Plenary 1">Plenary 1</option>
                    <option value="Plenary 2">Plenary 2</option>
                    <option value="Plenary 3">Plenary 3</option>
                    <option value="Plenary 4">Plenary 4</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col className="mt-3" sm="4" lg="6">
                <FormGroup check className="mr-2">
                  <Label for="accessibility">
                    Accessibility/Dietary Restrictions/Other Notes
                  </Label>
                  <Input
                    onChange={this.handleNoteChange}
                    className="form-control"
                    value={this.state.inputNotes}
                    type="textarea"
                    name="name"
                    id="accessibility"
                    placeholder="This input is optional."
                  />
                </FormGroup>
              </Col>
            </Row>

            <center className="mt-4">
              <button
                type="submit"
                className="btn btn-primary fonted"
                disabled={
                  this.state.inputPlen1 === this.state.p1 &&
                  this.state.inputPlen2 === this.state.p2 &&
                  this.state.inputNotes === this.state.notes
                }
              >
                Confirm!
              </button>
            </center>

            <br />
          </Form>
          <CardFooter>
            Plenary selection not available yet. Please check back later.
          </CardFooter>
        </Card>
        <br />
      </Container>
    );
  }
}
