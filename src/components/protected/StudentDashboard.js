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
      buttonStatus: ['Save Changes', 'btn btn-primary'],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);

    // Initialize data retrieval
    this.initializeData(userId);

    // console.log('Initial state:', this.state);
  }

  // Fetch the teacherID and then student data
  initializeData(userId) {
    // Fetch the teacherID from the `students` node
    ref.child(`students/${userId}`).once('value', (snapshot) => {
      const studentData = snapshot.val();
      if (studentData && studentData.teacherID) {
        // console.log('Fetched teacherID:', studentData.teacherID);

        // Set the teacherID in the state
        this.setState({ teacherID: studentData.teacherID }, () => {
          // Now fetch the student's data under the teacher node
          ref.child(`teachers/${studentData.teacherID}/students/${userId}`).once('value', (snapshot) => {
            const studentDetails = snapshot.val();
            if (studentDetails) {
              // console.log('Student details retrieved:', studentDetails);

              // Map the retrieved data to the state
              this.setState({
                p1_rank1: studentDetails.p1?.rank1 || '',
                p1_rank2: studentDetails.p1?.rank2 || '',
                p1_rank3: studentDetails.p1?.rank3 || '',
                p2_rank1: studentDetails.p2?.rank1 || '',
                p2_rank2: studentDetails.p2?.rank2 || '',
                p2_rank3: studentDetails.p2?.rank3 || '',
                p3_rank1: studentDetails.p3?.rank1 || '',
                p3_rank2: studentDetails.p3?.rank2 || '',
                p3_rank3: studentDetails.p3?.rank3 || '',
                inputNotes: studentDetails.note || '',
                lunch: studentDetails.lunch || false,
              });
            } else {
              console.error('Student data not found under teacher node!');
            }
          });
        });
      } else {
        console.error('TeacherID not found for the student!');
      }
    });
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

  async handleSubmit(event) {
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
    } = this.state;
  
    // Validation for duplicates and blanks
    const checkForDuplicatesOrBlanks = (values) => {
      const filteredValues = values.filter((value) => value !== ''); // Ignore blank entries
      const uniqueValues = new Set(filteredValues);
      return {
        hasBlanks: values.includes(''),
        hasDuplicates: uniqueValues.size !== filteredValues.length,
      };
    };
  
    const p1Validation = checkForDuplicatesOrBlanks([p1_rank1, p1_rank2, p1_rank3]);
    const p2Validation = checkForDuplicatesOrBlanks([p2_rank1, p2_rank2, p2_rank3]);
    const p3Validation = checkForDuplicatesOrBlanks([p3_rank1, p3_rank2, p3_rank3]);
  
    if (
      p1Validation.hasBlanks ||
      p2Validation.hasBlanks ||
      p3Validation.hasBlanks
    ) {
      alert('Please make sure all ranks are selected for each plenary.');
      return;
    }
  
    if (
      p1Validation.hasDuplicates ||
      p2Validation.hasDuplicates ||
      p3Validation.hasDuplicates
    ) {
      alert('Duplicate selections detected. Please ensure all ranks are unique within each plenary.');
      return;
    }
  
    // If no errors, proceed with Firebase update
    const {
      userid,
      teacherID,
      inputNotes,
      lunch,
    } = this.state;
  
    const updateData = {
      p1: {
        rank1: p1_rank1,
        rank2: p1_rank2,
        rank3: p1_rank3,
      },
      p2: {
        rank1: p2_rank1,
        rank2: p2_rank2,
        rank3: p2_rank3,
      },
      p3: {
        rank1: p3_rank1,
        rank2: p3_rank2,
        rank3: p3_rank3,
      },
      note: inputNotes,
      lunch,
    };
  
    console.log('Submitting data:', updateData);
  
    await ref.child(`teachers/${teacherID}/students/${userid}`).update(updateData);
  
    this.setState({
      buttonStatus: ['Success!', 'btn btn-success'],
    });
  
    setTimeout(() => {
      this.setState({
        buttonStatus: ['Save Changes', 'btn btn-primary'],
      });
    }, 1200);
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

  render() {
    return (
      <Container>
        <Row>
          <Col md="10">
            <h1>Student Dashboard</h1>
          </Col>
          <Col md="2">
            <Button color="secondary" className="float-right" onClick={logout}>
              Log Out
            </Button>
          </Col>
        </Row>

        <Card className="mt-4">
          <Form onSubmit={this.handleSubmit}>
            <Row>
              {/* Plenary 1 Section */}
              <Col md="4">
                <h5>Plenary 1</h5>
                <FormGroup>
                  <Label for="p1_rank1">Rank 1</Label>
                  <Input
                    type="select"
                    name="p1_rank1"
                    id="p1_rank1"
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
                    value={this.state.p1_rank3}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p1')}
                  </Input>
                </FormGroup>
              </Col>

              {/* Plenary 2 Section */}
              <Col md="4">
                <h5>Plenary 2</h5>
                <FormGroup>
                  <Label for="p2_rank1">Rank 1</Label>
                  <Input
                    type="select"
                    name="p2_rank1"
                    id="p2_rank1"
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
                    value={this.state.p2_rank3}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>
              </Col>

              {/* Plenary 3 Section */}
              <Col md="4">
                <h5>Plenary 3</h5>
                <FormGroup>
                  <Label for="p3_rank1">Rank 1</Label>
                  <Input
                    type="select"
                    name="p3_rank1"
                    id="p3_rank1"
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
                    value={this.state.p3_rank3}
                    onChange={this.handleDropdownChange}
                  >
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            {/* Notes and Lunch Section */}
            <Row className="mt-4">
              {/* Notes */}
              <Col md="6">
                <FormGroup>
                  <Label for="notes">Accessibility/Dietary Restrictions/Other Notes</Label>
                  <Input
                    type="textarea"
                    name="notes"
                    id="notes"
                    placeholder="This input is optional."
                    value={this.state.inputNotes}
                    onChange={(e) => this.setState({ inputNotes: e.target.value })}
                  />
                </FormGroup>
              </Col>

              {/* Lunch Checkbox */}
              <Col md="6" className="d-flex align-items-center justify-content-start">
                <FormGroup check>
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
            </Row>

            {/* Submit Button */}
            <Row>
              <Col className="text-center mt-4">
                <Button
                  color="primary"
                  type="submit"
                  className={this.state.buttonStatus[1]}
                >
                  {this.state.buttonStatus[0]}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    );
  }
}
