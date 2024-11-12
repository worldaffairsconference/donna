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
      plen1: '',
      plen2: '',
      plen3: '',
      lunch: false, // added a new lunch property for the object
      // plenOptions: {
      //   open: false,
      //   p1: { name: '', students: {}, max: 0 },
      //   p2: { name: '', students: {}, max: 0 },
      //   p3: { name: '', students: {}, max: 0 },
      //   p4: { name: '', students: {}, max: 0 },
      //   p5: { name: '', students: {}, max: 0 },
      //   p6: { name: '', students: {}, max: 0 },
      //   p7: { name: '', students: {}, max: 0 },
      //   p8: { name: '', students: {}, max: 0 },
      //   p9: { name: '', students: {}, max: 0 },
      // },
      plenOptions: {
        open: false,
        p1: {
          name: 'Plenary 1',
          options: [
            { id: 'p1o1', name: 'Plenary 1 op1', max: 0 },
            { id: 'p1o2', name: 'Plenary 1 op2', max: 0 },
            { id: 'p1o3', name: 'Plenary 1 op3', max: 0 },
          ],
        },
        p2: {
          name: 'Plenary 2',
          options: [
            { id: 'p2o1', name: 'Plenary 2 op1', max: 0 },
            { id: 'p2o2', name: 'Plenary 2 op2', max: 0 },
            { id: 'p2o3', name: 'Plenary 2 op3', max: 0 },
          ],
        },
        p3: {
          name: 'Plenary 3',
          options: [
            { id: 'p3o1', name: 'Plenary 3 op1', max: 0 },
            { id: 'p3o2', name: 'Plenary 3 op2', max: 0 },
            { id: 'p3o3', name: 'Plenary 3 op3', max: 0 },
          ],
        },
      },
      name: '',
      userid: userId,
      school: '',
      teacher: '',
      // p1: '',
      // p2: '',
      // p3: '',
      // p1o1: 'Plenary 1 op1',
      // p1o2: 'Plenary 1 op2',
      // p1o3: 'Plenary 1 op3',
      // p2o1: 'Plenary 2 op1',
      // p2o2: 'Plenary 2 op2',
      // p2o3: 'Plenary 2 op3',
      // p3o1: 'Plenary 3 op1',
      // p3o2: 'Plenary 3 op2',
      // p3o3: 'Plenary 3 op3',
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
        const studentData = snapshot.val().students[this.state.userid];
        const validPlenOptions = Object.values(this.state.plenOptions).map((plen) => plen.name);

        // var p1 = snapshot.val().students[this.state.userid].plen1;
        // var p2 = snapshot.val().students[this.state.userid].plen2;
        // var p3 = snapshot.val().students[this.state.userid].plen3;

        if (snapshot.val().students[this.state.userid].ucc_advisor) {
          teacher_name = snapshot.val().students[this.state.userid].ucc_advisor;
          ucc_student = true;
        } else {
          teacher_name = snapshot.val().name;
        }

        this.setState({
          modal: false,
          ucc_student: ucc_student,
          name: studentData.name || '',
          school: snapshot.val().school,
          teacher: teacher_name,
          teacherID: teacher,
          p1: validPlenOptions.includes(studentData.plen1) ? studentData.plen1 : '',
          p2: validPlenOptions.includes(studentData.plen2) ? studentData.plen2 : '',
          p3: validPlenOptions.includes(studentData.plen3) ? studentData.plen3 : '',
          
          inputNotes: studentData.note || '',
          notes: studentData.note || '',
          inputPlen1: studentData.plen1 || '',
          inputPlen2: studentData.plen2 || '',
          inputPlen3: studentData.plen3 || '',
          lunch: studentData.lunch || false,
        });
      });
    });


    document.addEventListener('keydown', (e) => {
      if ((e.keyCode === 75 && e.metaKey) || (e.keyCode === 75 && e.ctrlKey)) {
        this.toggleModal2();
      }
    });
  }

  generateDropdownOptions = (plenKey) => {
    const plenOptions = this.state.plenOptions[plenKey].options;
    return (
      <>
        <option value="">Select an option</option>
        {plenOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </>
    );
  };

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

  // componentDidMount() {
  //   // Fetch saved values from the database
  //   ref.child(`students/${this.state.userid}`).once('value', (snapshot) => {
  //     const data = snapshot.val();
  //     this.setState({
  //       p1: data.plen1 || '',
  //       p2: data.plen2 || '',
  //       p3: data.plen3 || '',
  //       // other state variables
  //     });
  //   });
  // }


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
    await ref
      .child(`teachers/${this.state.teacherID}/students/${this.state.userid}`)
      .update({
        note: this.state.inputNotes,
        p1: this.state.inputPlen1,
        p2: this.state.inputPlen2,
        p3: this.state.inputPlen3,
        
        lunch: this.state.lunch, // Update lunch status in the database
      });
    // Update teachers/${user.uid}/students
    this.setState({
      notes: this.state.inputNotes,
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


        <Row>
          <Col md="12" sm="12" xs="12"></Col>
        </Row>
        <Card className="pt-4">
          <Form onSubmit={this.handleSubmit}>
            <Row sm={1} md={1} lg={2}>
              
              <Col sm="6" lg="6" className="mt-2">
                <FormGroup check>
                  <Label>Plenary Session 1 - 10:40 AM</Label>
                  <div>
                    <select
                      value={this.state.inputPlen1 || ""}
                      onChange={this.handlePlen1Change}
                      className="form-control"
                      id="p1"
                    >
                      {this.generateDropdownOptions('p1')}
                    </select>
                  </div>
                </FormGroup>

                <FormGroup check>
                  <Label>Plenary Session 2 - 11:35 AM</Label>
                  <div>
                    <select
                      value={this.state.inputPlen2 || ""}
                      onChange={this.handlePlen2Change}
                      className="form-control"
                      id="p2"
                    >
                      {this.generateDropdownOptions('p2')}
                    </select>
                  </div>
                </FormGroup>

                <FormGroup check>
                  <Label>Plenary Session 3 - 01:35 PM</Label>
                  <div>
                    <select
                      value={this.state.inputPlen3 || ""}
                      onChange={this.handlePlen3Change}
                      className="form-control"
                      id="p3"
                    >
                      {this.generateDropdownOptions('p3')}
                    </select>
                  </div>
                </FormGroup>
                <br />
                <FormGroup check className="mt-2" style={{ marginLeft: '123px', transform: 'scale(1.5)' }}>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={this.state.lunch}
                      onChange={(e) => this.setState({ lunch: e.target.checked })}
                    />
                    Lunch?
                  </Label>
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
                  this.state.inputPlen1 ===this.state.plen1 &&
                  this.state.inputPlen2 ===this.state.plen2 &&
                  this.state.inputPlen3 ===this.state.plen3 &&
                  this.state.inputNotes === this.state.notes
                }
              >
                {this.state.buttonStatus[0]}
              </button>
            </center>


            <br />
          </Form>
        </Card>
        <br />
      </Container>
    );
  }
}
