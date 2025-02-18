import React, { Component } from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Card,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { logout } from '../../helpers/auth';

export default class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    const userId = firebaseAuth.currentUser.uid;

    this.state = {
      userid: userId,
      teacherID: '',
      name: '', // Student's name
      teacherName: '', // Teacher's name
      school: '', // School name
      wacDate: '', // WAC date
      greeting: '', // Greeting message
      p1_rank1: '',
      p1_rank2: '',
      p1_rank3: '',
      p2_rank1: '',
      p2_rank2: '',
      p2_rank3: '',
      p3_rank1: '',
      p3_rank2: '',
      p3_rank3: '',
      inputNotes: '',
      lunch: false,
      plenOptions: {

        // Add these plenary names in once we know what slot (p1, p2, p3)
        // they should be in

        // AI Horizons: Inspiring the Next Generation of Innovators
        // 
        // On the Frontlines: Reporting Wildfires, Climate Change, and a Warming World
        // Beyond Borders: The inspiring story of Dr. Orbinski’s work with Médecins Sans Frontières
        //  
        // 
        // 
        // Eyes on the Frontlines: challenges and triumphs of reporting in conflict zones

        // Add the rest of the plenaries once the titles are known (check speaker doc)
        
        p1: {
          name: 'Plenary 1',
          options: [
            { id: 'p1o1', name: 'Trump & the World 2025: The New Geopolitics of Trade, Energy, Diplomacy, and War' },
            { id: 'p1o2', name: 'Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy' },
            { id: 'p1o3', name: 'TBD' },
            { id: 'p1o4', name: 'From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation' },
            // { id: 'p1o5', name: 'Plenary 1 Option 5' },
          ],
        },
        p2: {
          name: 'Plenary 2',
          options: [
            { id: 'p2o1', name: 'Breaking Barriers: Engaging Men in Gender Equality for a Better World' },
            { id: 'p2o2', name: 'TBD' },
            { id: 'p2o3', name: 'TBD' },
            { id: 'p2o4', name: 'Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication' },
            // { id: 'p2o5', name: 'Plenary 2 Option 5' },
          ],
        },
        p3: {
          name: 'Plenary 3',
          options: [
            { id: 'p3o1', name: 'Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?' },
            { id: 'p3o2', name: 'Propelling Progress: Driving Positive Change Through Entrepreneurship and Drones' },
            { id: 'p3o3', name: 'High School Hallways to Startup Success: Eric Zhu’s Journey with Aviato' },
            { id: 'p3o4', name: 'TBD' },
            // { id: 'p3o5', name: 'Plenary 3 Option 5' },
          ],
        },
      },
      magic: '',
      modal2: false,
      buttonStatus: ['Save Changes', 'btn btn-primary'],
    };

    this.handleSavePlenaries = this.handleSavePlenaries.bind(this);
    this.handleNotesAndLunchSubmit = this.handleNotesAndLunchSubmit.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.toggleModal2 = this.toggleModal2.bind(this);
    this.handleMagicCode = this.handleMagicCode.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.initializeData = this.initializeData.bind(this);
  }

  // Handle saving the plenaries section
  async handleSavePlenaries(event) {
    event.preventDefault();

    const {
      p1_rank1,
      p1_rank2,
      p1_rank3,
      p2_rank1,
      p2_rank2,
      p2_rank3,
      p3_rank1,
      p3_rank2,
      p3_rank3,
      userid,
      teacherID,
    } = this.state;

    // Validate selections (no duplicates or blanks)
    const checkForDuplicatesOrBlanks = (values) => {
      const filteredValues = values.filter((value) => value !== '');
      const uniqueValues = new Set(filteredValues);
      return {
        hasBlanks: values.includes(''),
        hasDuplicates: uniqueValues.size !== filteredValues.length,
      };
    };

    const p1Validation = checkForDuplicatesOrBlanks([p1_rank1, p1_rank2, p1_rank3]);
    const p2Validation = checkForDuplicatesOrBlanks([p2_rank1, p2_rank2, p2_rank3]);
    const p3Validation = checkForDuplicatesOrBlanks([p3_rank1, p3_rank2, p3_rank3]);

    if (p1Validation.hasBlanks || p2Validation.hasBlanks || p3Validation.hasBlanks) {
      alert('Please make sure all ranks are selected for each plenary.');
      return;
    }

    if (p1Validation.hasDuplicates || p2Validation.hasDuplicates || p3Validation.hasDuplicates) {
      alert('Duplicate selections detected. Please ensure all ranks are unique within each plenary.');
      return;
    }

    const updatePlenaries = {
      p1: { rank1: p1_rank1, rank2: p1_rank2, rank3: p1_rank3 },
      p2: { rank1: p2_rank1, rank2: p2_rank2, rank3: p2_rank3 },
      p3: { rank1: p3_rank1, rank2: p3_rank2, rank3: p3_rank3 },
    };

    await ref.child(`teachers/${teacherID}/students/${userid}`).update(updatePlenaries);
    alert('Plenary selections saved successfully!');
  }

  // Handle saving the notes and lunch section
  async handleNotesAndLunchSubmit(event) {
    event.preventDefault();

    const { userid, teacherID, inputNotes, lunch } = this.state;

    const updateNotesLunch = {
      note: inputNotes,
      lunch,
    };

    await ref.child(`teachers/${teacherID}/students/${userid}`).update(updateNotesLunch);
    alert('Notes and lunch preferences saved successfully!');
  }

  handleDropdownChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleNoteChange(event) {
    this.setState({ inputNotes: event.target.value });
  }

  handleCheckboxChange(event) {
    this.setState({ lunch: event.target.checked });
  }

  toggleModal2() {
    this.setState((prevState) => ({ modal2: !prevState.modal2 }));
  }

  generateDropdownOptions(plenKey) {
    const plenOptions = this.state.plenOptions[plenKey]?.options || [];
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
  }

  initializeData(userId) {
    
    // Fetch the student data
    ref.child(`students/${userId}`).once('value', (snapshot) => {
      const studentData = snapshot.val();
      if (studentData) {
        const { teacherID, name, school, wacDate } = studentData;

        // Set initial student-related state
        this.setState({
          teacherID: teacherID || '',
          school: school || 'Your School',
          wacDate: wacDate || 'March 5th, 2025',
        });


        if (teacherID) {
          ref.child(`teachers/${teacherID}/students/${userId}`).once('value', (teacherStudentSnapshot) => {
            const teacherStudentData = teacherStudentSnapshot.val();
            if (teacherStudentData) {
              this.setState({
                name: teacherStudentData.name || 'Student',
              });
            } else {
              console.error('Student entry not found under teachers node.');
            }
          });

          // Fetch teacher's name using the teacherID
          ref.child(`teachers/${teacherID}/name`).once('value', (teacherSnapshot) => {
            const teacherName = teacherSnapshot.val();
            this.setState({
              teacherName: teacherName || 'Your Teacher',
            });
          });

          // Fetch teacher's school using the teacherID
          ref.child(`teachers/${teacherID}/school`).once('value', (schoolSnapshot) => {
            const schoolName = schoolSnapshot.val();
            this.setState({
              school: schoolName || 'Your School',
            });
          });

          // Fetch plenary and notes/lunch data
          ref.child(`teachers/${teacherID}/students/${userId}`).once('value', (studentDetailsSnapshot) => {
            const studentDetails = studentDetailsSnapshot.val();
            if (studentDetails) {
              this.setState({
                // Populate plenary data
                p1_rank1: studentDetails.p1?.rank1 || '',
                p1_rank2: studentDetails.p1?.rank2 || '',
                p1_rank3: studentDetails.p1?.rank3 || '',
                p2_rank1: studentDetails.p2?.rank1 || '',
                p2_rank2: studentDetails.p2?.rank2 || '',
                p2_rank3: studentDetails.p2?.rank3 || '',
                p3_rank1: studentDetails.p3?.rank1 || '',
                p3_rank2: studentDetails.p3?.rank2 || '',
                p3_rank3: studentDetails.p3?.rank3 || '',

                // Populate notes and lunch data
                inputNotes: studentDetails.note || '',
                lunch: studentDetails.lunch || false,
              });
            } else {
              console.error('Student details not found under teacher node.');
            }
          });
        } else {
          console.error('TeacherID not found for the student.');
          this.setState({
            teacherName: 'Your Teacher',
            schoolName: 'Your School',
          });
        }
      } else {
        console.error('Student data not found.');
      }
    });
  }

  componentDidMount() {
    const userId = this.state.userid;

    // Set greeting based on the current time
    const currentHour = new Date().getHours();
    let greeting = '';
    if (currentHour < 12) greeting = 'Good morning';
    else if (currentHour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    this.setState({ greeting });

    // Fetch user data (name, WAC date, teacher, school)
    this.initializeData(userId);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    // Check for Meta key (Command on Mac) + K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleModal2();
    }
  }

  toggleModal2() {
    this.setState((prevState) => ({
      modal2: !prevState.modal2,
    }));
  }

  async handleMagicCode() {
    const magicCode = this.state.magic;
    const tid = this.state.teacherID;
    const uid = this.state.userid;
    // console.log(magicCode, tid, uid);

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
    // console.log(data);

    if (data !== 'Invalid Code') {
      try {
        await ref.root.child(`admin/${uid}`).set(true); // Adding admin entry under "admin" folder
        this.setState({ modal2: false });
        alert('Magic Code Accepted! You are now an admin.');
        location.reload();
      } catch (error) {
        // console.error('Error updating database:', error);
        alert('Magic Code Accepted, but an error occurred while updating the database.');
      }
    } else {
      this.toggleModal2();
      alert('Invalid Code');
    }
  }

  render() {
    const { greeting, name, teacherName, school, wacDate } = this.state;

    return (
      <Container>
        <Row>
          <Col md="10">
            <h1 className="text-primary">{`${greeting}, ${name}`}</h1>
          </Col>
          <Col md="2">
            <Button color="secondary" className="float-right" onClick={logout}>
              Log Out
            </Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md="12">
            <h3 class="text-white">Plenary selection will open shortly. Stay tuned.</h3>
          </Col>
        </Row>

        {/* Greeting and Info Section */}
        <Row>
          <Col>
            <p className="text-muted">
              WAC Date: {wacDate} | Teacher: {teacherName} | School: {school}
            </p>
          </Col>
        </Row>

        <Card className="mt-4 inner-container">
          <Form onSubmit={this.handleSavePlenaries}>
            <Row>              
              <Col md="4">
                <h5>Plenary 1</h5>

                <FormGroup>
                  <Label for="p1_rank1">Rank 1</Label>
                  <Input
                    type="select"
                    name="p1_rank1"
                    id="p1_rank1"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p1_rank1}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p1')}
                    
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="p1_rank2">Rank 2</Label>
                  <Input
                    type="select"
                    name="p1_rank2"
                    id="p1_rank2"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p1_rank2}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p1')}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="p1_rank3">Rank 3</Label>
                  <Input
                    type="select"
                    name="p1_rank3"
                    id="p1_rank3"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p1_rank3}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p1')}
                  </Input>
                </FormGroup>
              </Col>
              
              <Col md="4">
                <h5>Plenary 2</h5>

                <FormGroup>
                  <Label for="p2_rank1">Rank 1</Label>
                  <Input
                    type="select"
                    name="p2_rank1"
                    id="p2_rank1"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p2_rank1}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="p2_rank2">Rank 2</Label>
                  <Input
                    type="select"
                    name="p2_rank2"
                    id="p2_rank2"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p2_rank2}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="p2_rank3">Rank 3</Label>
                  <Input
                    type="select"
                    name="p2_rank3"
                    id="p2_rank3"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p2_rank3}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>
              </Col>

              <Col md="4">
                <h5>Plenary 3</h5>

                <FormGroup>
                  <Label for="p3_rank1">Rank 1</Label>
                  <Input
                    type="select"
                    name="p3_rank1"
                    id="p3_rank1"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p3_rank1}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="p3_rank2">Rank 2</Label>
                  <Input
                    type="select"
                    name="p3_rank2"
                    id="p3_rank2"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p3_rank2}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>

                <FormGroup>
                  <Label for="p3_rank3">Rank 3</Label>
                  <Input
                    type="select"
                    name="p3_rank3"
                    id="p3_rank3"
                    className="form-control inner-container border-color-grey form-select"
                    value={this.state.p3_rank3}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="text-center mt-4">
                <Button color="primary" type="submit">
                  Save Plenary Selections
                </Button>
              </Col>
            </Row>
          </Form>

          <Form onSubmit={this.handleNotesAndLunchSubmit}>

            <Row className="mt-4">
              <Col md="6">
                <FormGroup>
                  <Label for="notes">Accessibility/Dietary Restrictions/Other Notes</Label>
                  <Input
                    type="textarea"
                    name="notes"
                    id="notes"
                    value={this.state.inputNotes}
                    onChange={this.handleNoteChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      checked={this.state.lunch}
                      onChange={this.handleCheckboxChange}
                    />
                    I will be eating the catered lunch (provided by Aramark)
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="text-center mt-4">
                <Button color="primary" type="submit">
                  Save Notes and Lunch
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>


        {/* Magic Modal */}
        <Modal isOpen={this.state.modal2} toggle={this.toggleModal2}>
          <ModalHeader toggle={this.toggleModal2}>Magic Code Entry</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              placeholder="Enter Magic Code"
              value={this.state.magic}
              onChange={(e) => this.setState({ magic: e.target.value })}
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
      </Container>
    );
  }
}









