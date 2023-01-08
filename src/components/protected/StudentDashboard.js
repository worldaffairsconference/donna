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
    this.toggleModal2 = this.toggleModal2.bind(this);
    this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this);
    this.handleMagicCode = this.handleMagicCode.bind(this);

    this.state = {
      magic: '',
      special: '',
      ucc_student: false,
      buttonStatus: ['Save Changes', 'btn btn-primary fonted'],
      modal: false,
      modal2: false,
      inputNotes: '',
      inputPlen1: '',
      inputPlen2: '',
      inputPlen3: '',
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
      name: '',
      userid: userId,
      school: '',
      teacher: '',
      p1: '',
      p2: '',
      p3: '',
      notes: '',
      greet: [
        'What are you doing that early? ',
        'Good Morning, ',
        'Good Afternoon, ',
        'Good Evening, ',
      ][parseInt((new Date().getHours() / 24) * 4)],
    };

    // bind everythiung
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handlePlen1Change = this.handlePlen1Change.bind(this);
    this.handlePlen2Change = this.handlePlen2Change.bind(this);
    this.handlePlen3Change = this.handlePlen3Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    ref.child(`students/${this.state.userid}`).once('value', (snapshot) => {
      const teacher = snapshot.val().teacherID;
      var teacher_name;
      var ucc_student = false;

      // Get teachers/${user.uid}/students
      ref.child(`teachers/${teacher}`).once('value', (snapshot) => {
        var p1 = snapshot.val().students[this.state.userid].p1;
        var p2 = snapshot.val().students[this.state.userid].p2;
        var p3 = snapshot.val().students[this.state.userid].p3;
        if (snapshot.val().students[this.state.userid].ucc_advisor) {
          teacher_name = snapshot.val().students[this.state.userid].ucc_advisor;
          ucc_student = true;
        } else {
          teacher_name = snapshot.val().name;
        }
        if (snapshot.val().students[this.state.userid].p1) {
          this.setState({
            plenholder: snapshot.val().students[this.state.userid].p1,
          });
        }

        if (snapshot.val().students[this.state.userid].p2) {
          this.setState({
            plenholder: snapshot.val().students[this.state.userid].p2,
          });
        }

        if (snapshot.val().students[this.state.userid].p3) {
          this.setState({
            plenholder: snapshot.val().students[this.state.userid].p3,
          });
        }

        this.setState({
          modal: false,
          ucc_student: ucc_student,
          name: snapshot.val().students[this.state.userid].name,
          school: snapshot.val().school,
          teacher: teacher_name,
          teacherID: teacher,
          p1: snapshot.val().students[this.state.userid].p1,
          inputPlen1: snapshot.val().students[this.state.userid].p1,
          p2: snapshot.val().students[this.state.userid].p2,
          inputPlen2: snapshot.val().students[this.state.userid].p2,
          p3: snapshot.val().students[this.state.userid].p3,
          inputPlen3: snapshot.val().students[this.state.userid].p3,
          inputNotes: snapshot.val().students[this.state.userid].note,
          notes: snapshot.val().students[this.state.userid].note,
        });

        if (
          p1 == 'SPRINT' ||
          p1 == 'SECURITY' ||
          p1 == 'EXECUTIVE' ||
          p1 == 'VOLUNTEER' ||
          p1 == 'OTHER'
        ) {
          this.setState({ special: p1, inputPlen1: '' });
        }
        if (
          p2 == 'SPRINT' ||
          p2 == 'SECURITY' ||
          p2 == 'EXECUTIVE' ||
          p2 == 'VOLUNTEER' ||
          p2 == 'OTHER'
        ) {
          this.setState({ special: p2, inputPlen2: '' });
        }
        if (
          p3 == 'SPRINT' ||
          p3 == 'SECURITY' ||
          p3 == 'EXECUTIVE' ||
          p3 == 'VOLUNTEER' ||
          p3 == 'OTHER'
        ) {
          this.setState({ special: p3, inputPlen3: '' });
        }
      });
    });

    // Get plenaries
    ref.child('plenaries').once('value', (snapshot) => {
      this.setState({ plenOptions: snapshot.val() });
    });

    //console log when command+shift+m is pressed
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 77 && e.shiftKey && e.metaKey) {
        this.toggleModal2();
      }
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  toggleModal2() {
    this.setState({
      modal2: !this.state.modal2,
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

  handlePlen3Change(event) {
    this.setState({ inputPlen3: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await ref.child('plenaries').once('value', (snapshot) => {
      this.setState({ plenOptions: snapshot.val() });
    });
    // Check for plenary maximum capacity

    if (
      this.state.inputPlen1 != '' &&
      this.state.plenOptions[this.state.inputPlen1].students &&
      this.state.inputPlen1 !== this.state.p1
    ) {
      if (
        Object.keys(this.state.plenOptions[this.state.inputPlen1].students)
          .length >= this.state.plenOptions[this.state.inputPlen1].max
      ) {
        alert(
          'Selected Plenary 1 is full! Please select another plenary or try again later.'
        );
        return;
      }
    }

    if (
      this.state.inputPlen2 != '' &&
      this.state.plenOptions[this.state.inputPlen2].students &&
      this.state.inputPlen2 !== this.state.p2
    ) {
      if (
        Object.keys(this.state.plenOptions[this.state.inputPlen2].students)
          .length >= this.state.plenOptions[this.state.inputPlen2].max
      ) {
        alert(
          'Selected Plenary 2 is full! Please select another plenary or try again later.'
        );
        return;
      }
    }

    if (
      this.state.inputPlen3 != '' &&
      this.state.plenOptions[this.state.inputPlen3].students &&
      this.state.inputPlen3 !== this.state.p3
    ) {
      if (
        Object.keys(this.state.plenOptions[this.state.inputPlen3].students)
          .length >= this.state.plenOptions[this.state.inputPlen3].max
      ) {
        alert(
          'Selected Plenary 3 is full! Please select another plenary or try again later.'
        );
        return;
      }
    }
    await ref
      .child(`teachers/${this.state.teacherID}/students/${this.state.userid}`)
      .update({
        note: this.state.inputNotes,
      });
    // Update teachers/${user.uid}/students
    if (this.state.special) {
      alert(
        'Plenary selection is locked for your account as you have been assigned a special event. However, your notes will be updated.'
      );

      return;
    }
    await ref
      .child(`teachers/${this.state.teacherID}/students/${this.state.userid}`)
      .update({
        p1: this.state.inputPlen1,
        p2: this.state.inputPlen2,
        p3: this.state.inputPlen3,
      });

    if (
      this.state.inputPlen1 !== this.state.p1 ||
      this.state.inputPlen2 !== this.state.p2 ||
      this.state.inputPlen3 !== this.state.p3
    ) {
      if (this.state.p1 !== '') {
        await ref
          .child(`plenaries/${this.state.p1}/students/${this.state.userid}`)
          .remove();
      }

      if (this.state.p2 !== '') {
        await ref
          .child(`plenaries/${this.state.p2}/students/${this.state.userid}`)
          .remove();
      }

      if (this.state.p3 !== '') {
        await ref
          .child(`plenaries/${this.state.p3}/students/${this.state.userid}`)
          .remove();
      }

      if (this.state.inputPlen1 !== '') {
        await ref
          .child(
            `plenaries/${this.state.inputPlen1}/students/${this.state.userid}`
          )
          .set(true);
      }

      if (this.state.inputPlen2 !== '') {
        await ref
          .child(
            `plenaries/${this.state.inputPlen2}/students/${this.state.userid}`
          )
          .set(true);
      }

      if (this.state.inputPlen3 !== '') {
        await ref
          .child(
            `plenaries/${this.state.inputPlen3}/students/${this.state.userid}`
          )
          .set(true);
      }
    }

    this.setState({
      notes: this.state.inputNotes,
      p1: this.state.inputPlen1,
      p2: this.state.inputPlen2,
      p3: this.state.inputPlen3,
      buttonStatus: ['Success!', 'btn btn-success fonted'],
    });

    setTimeout(() => {
      this.setState({
        buttonStatus: ['Save Changes', 'btn btn-primary fonted'],
      });
    }, 1200);
  }

  async handleMagicCode(event) {
    const magicCode = this.state.magic;
    const tid = this.state.teacherID;
    const uid = this.state.userid;
    console.log(magicCode, tid, uid);
    const response = await fetch(
      'https://us-central1-worldaffairscon-8fdc5.cloudfunctions.net/magic',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ code: magicCode, tid, uid }),
      }
    );
    const data = await response.text();
    console.log(data);
    if (data !== 'Invalid Code') {
      this.setState({ modal2: false });
      this.toggleModal2();
      location.reload();
    } else {
      this.toggleModal2();
      alert('Invalid Code');
    }
  }

  proceedDeleteAccount() {
    deleteUserData(this.state.teacherID);
  }

  render() {
    return (
      <Container>
        <Modal
          isOpen={this.state.modal2}
          toggle={this.toggleModal2}
          className="modal-dialog"
        >
          <ModalHeader toggle={this.toggleModal2}>Magic Code Entry</ModalHeader>
          <ModalBody>
            <input
              type="text"
              className="form-control"
              value={this.state.magic}
              onChange={(e) => {
                this.setState({ magic: e.target.value });
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleMagicCode}>
              Submit
            </Button>
            <Button color="secondary" onClick={this.toggleModal2}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <br />
        <Row>
          <Col md="8" sm="12" xs="12">
            <h1 className="fonted-h">
              {this.state.greet}
              {this.state.name}
            </h1>
          </Col>
          {this.state.ucc_student ? (
            <Col md="4" sm="12" xs="12">
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
          ) : (
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
          )}
          {!this.state.ucc_student && (
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
          )}
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
            <Row sm={1} md={1} lg={2}>
              <Col sm="6" lg="6">
                <FormGroup check>
                  <Label>Choose Plenary 1 </Label>
                </FormGroup>
                <FormGroup
                  onChange={this.handlePlen1Change}
                  check
                  className="mr-3"
                >
                  <Input
                    value={this.state.inputPlen1}
                    className="form-control"
                    type="select"
                    name="select1"
                    id="select1"
                    disabled={!this.state.plenOptions.open}
                  >
                    {this.state.special && (
                      <option value="">{this.state.special}</option>
                    )}
                    <option value="">None</option>
                    <option value="p1">{this.state.plenOptions.p1.name}</option>
                    <option value="p2">{this.state.plenOptions.p2.name}</option>
                    <option value="p3">{this.state.plenOptions.p3.name}</option>
                  </Input>
                </FormGroup>
                <br />
                <FormGroup check>
                  <Label>Choose Plenary 2 </Label>
                </FormGroup>
                <FormGroup
                  onChange={this.handlePlen2Change}
                  check
                  className="mr-3"
                >
                  <Input
                    value={this.state.inputPlen2}
                    className="form-control"
                    type="select"
                    name="select2"
                    id="select2"
                    disabled={!this.state.plenOptions.open}
                  >
                    {this.state.special && (
                      <option value="">{this.state.special}</option>
                    )}
                    <option value="">None</option>
                    <option value="p4">{this.state.plenOptions.p4.name}</option>
                    <option value="p5">{this.state.plenOptions.p5.name}</option>
                    <option value="p6">{this.state.plenOptions.p6.name}</option>
                  </Input>
                </FormGroup>
                <br />
                <FormGroup check>
                  <Label>Choose Plenary 3 </Label>
                </FormGroup>
                <FormGroup
                  onChange={this.handlePlen3Change}
                  check
                  className="mr-3"
                >
                  <Input
                    value={this.state.inputPlen3}
                    className="form-control"
                    type="select"
                    name="select3"
                    id="select3"
                    disabled={!this.state.plenOptions.open}
                  >
                    {this.state.special && (
                      <option value="">{this.state.special}</option>
                    )}
                    <option value="">None</option>
                    <option value="p7">{this.state.plenOptions.p7.name}</option>
                    <option value="p8">{this.state.plenOptions.p8.name}</option>
                    <option value="p9">{this.state.plenOptions.p9.name}</option>
                  </Input>
                </FormGroup>
              </Col>
              <br />
              <Col sm="6" lg="6">
                <FormGroup check className="mr-3">
                  <Label for="accessibility" className="mt-2">
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
                className={this.state.buttonStatus[1]}
                disabled={
                  this.state.inputPlen1 === this.state.p1 &&
                  this.state.inputPlen2 === this.state.p2 &&
                  this.state.inputPlen3 === this.state.p3 &&
                  this.state.inputNotes === this.state.notes
                }
              >
                {this.state.buttonStatus[0]}
              </button>
            </center>

            <br />
          </Form>
          {!this.state.plenOptions.open && (
            <CardFooter>
              Plenary selection will be available on <b>January 18th</b>. Please
              check back later.
            </CardFooter>
          )}
        </Card>
        <br />
      </Container>
    );
  }
}
