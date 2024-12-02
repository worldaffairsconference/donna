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

export default class StudentDashboard extends Component {
  constructor(props) {
    super(props);
    const userId = firebaseAuth.currentUser.uid;

    this.state = {
      p1_first: '', // First choice for Plenary 1
      p1_second: '', // Second choice for Plenary 1
      p1_third: '', // Third choice for Plenary 1
      p2_first: '', // First choice for Plenary 2
      p2_second: '', // Second choice for Plenary 2
      p2_third: '', // Third choice for Plenary 2
      p3_first: '', // First choice for Plenary 3
      p3_second: '', // Second choice for Plenary 3
      p3_third: '', // Third choice for Plenary 3
      inputNotes: '',
      lunch: false,
      plenOptions: {
        p1: [
          { id: 'p1o1', name: 'Plenary 1 Option 1' },
          { id: 'p1o2', name: 'Plenary 1 Option 2' },
          { id: 'p1o3', name: 'Plenary 1 Option 3' },
        ],
        p2: [
          { id: 'p2o1', name: 'Plenary 2 Option 1' },
          { id: 'p2o2', name: 'Plenary 2 Option 2' },
          { id: 'p2o3', name: 'Plenary 2 Option 3' },
        ],
        p3: [
          { id: 'p3o1', name: 'Plenary 3 Option 1' },
          { id: 'p3o2', name: 'Plenary 3 Option 2' },
          { id: 'p3o3', name: 'Plenary 3 Option 3' },
        ],
      },
      buttonStatus: ['Save Changes', 'btn btn-primary fonted'],
      userid: userId,
      teacherID: '', // Will be fetched dynamically
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // Fetch data from Firebase
    ref.child(`students/${this.state.userid}`).once('value', (snapshot) => {
      const studentData = snapshot.val();
      this.setState({
        inputNotes: studentData.note || '',
        lunch: studentData.lunch || false,
        teacherID: studentData.teacherID || '',
        // p1_first: studentData.p1 || '',
        // p1_second: studentData.p2 || '',
        // p1_third: studentData.p3 || '',
        // p2_first: studentData. || '',
        // p2_second: studentData.plen2 || '',
        // p2_third: studentData.plen3 || '',
        // p3_first: studentData.plen4 || '',
        // p3_second: studentData.plen5 || '',
        // p3_third: studentData.plen6 || '',
      });
      
      // Save plenary rankings to local storage
      localStorage.setItem('studentPlenaryRankings', JSON.stringify({
        p1_first: studentData.p1 || '',
        p1_second: studentData.p2 || '',
        p1_third: studentData.p3 || '',
        p2_first: studentData.plen1 || '',
        p2_second: studentData.plen2 || '',
        p2_third: studentData.plen3 || '',
        p3_first: studentData.plen4 || '',
        p3_second: studentData.plen5 || '',
        p3_third: studentData.plen6 || '',
      }));
      
      // Load plenary rankings from local storage if available
      const savedRankings = JSON.parse(localStorage.getItem('studentPlenaryRankings') || '{}');
      this.setState({
        p1_first: savedRankings.p1_first || studentData.p1 || '',
        p1_second: savedRankings.p1_second || studentData.p2 || '',
        p1_third: savedRankings.p1_third || studentData.p3 || '',
        p2_first: savedRankings.p2_first || studentData.plen1 || '',
        p2_second: savedRankings.p2_second || studentData.plen2 || '',
        p2_third: savedRankings.p2_third || studentData.plen3 || '',
        p3_first: savedRankings.p3_first || studentData.plen4 || '',
        p3_second: savedRankings.p3_second || studentData.plen5 || '',
        p3_third: savedRankings.p3_third || studentData.plen6 || '',
      });
    });
  }

  // Handle dropdown value changes
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  // Submit form and update Firebase
  async handleSubmit(event) {
    event.preventDefault();

    const {
      p1_first,
      p1_second,
      p1_third,
      p2_first,
      p2_second,
      p2_third,
      p3_first,
      p3_second,
      p3_third,
      inputNotes,
      lunch,
      teacherID,
      userid,
    } = this.state;

    // Validate rankings (no duplicates within a session)
    const validateRankings = (...choices) =>
      new Set(choices.filter(Boolean)).size === choices.length;

    if (
      !validateRankings(p1_first, p1_second, p1_third) ||
      !validateRankings(p2_first, p2_second, p2_third) ||
      !validateRankings(p3_first, p3_second, p3_third)
    ) {
      alert('Please ensure no duplicate rankings within a single plenary session.');
      return;
    }

    // Clear out plen1, plen2, and plen3 for now
    const cleanData = { // This is where we update Firebase
      p1: [p1_first, p1_second, p1_third].filter(Boolean),
      p2: [p2_first, p2_second, p2_third].filter(Boolean),
      p3: [p3_first, p3_second, p3_third].filter(Boolean),
      plen1: '', // Clear final assignment
      plen2: '', // Clear final assignment
      plen3: '', // Clear final assignment
      note: inputNotes || '',
      lunch: !!lunch,
      // rank1: null,
      // rank2: null,
      // rank3: null,
    };

    console.log('Submitting data to Firebase:', cleanData);

    // Update Firebase
    await ref.child(`teachers/${teacherID}/students/${userid}`).update(cleanData);

    this.setState({
      buttonStatus: ['Success!', 'btn btn-success fonted'],
    });

    setTimeout(() => {
      this.setState({
        buttonStatus: ['Save Changes', 'btn btn-primary fonted'],
      });
    }, 1200);
  }

  // Generate dropdown options dynamically for each plenary
  generateDropdownOptions(plenKey) {
    return this.state.plenOptions[plenKey].map((option) => (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ));
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md="12">
            <Card className="pt-4">
              <Form onSubmit={this.handleSubmit}>
                {/* Plenary 1 Rankings */}
                <h5>Plenary 1 Rankings</h5>
                <FormGroup>
                  <Label>First Choice</Label>
                  <Input
                    type="select"
                    name="p1_first"
                    value={this.state.p1_first}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p1')}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Second Choice</Label>
                  <Input
                    type="select"
                    name="p1_second"
                    value={this.state.p1_second}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p1')}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Third Choice</Label>
                  <Input
                    type="select"
                    name="p1_third"
                    value={this.state.p1_third}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p1')}
                  </Input>
                </FormGroup>

                {/* Plenary 2 Rankings */}
                <h5>Plenary 2 Rankings</h5>
                <FormGroup>
                  <Label>First Choice</Label>
                  <Input
                    type="select"
                    name="p2_first"
                    value={this.state.p2_first}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Second Choice</Label>
                  <Input
                    type="select"
                    name="p2_second"
                    value={this.state.p2_second}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Third Choice</Label>
                  <Input
                    type="select"
                    name="p2_third"
                    value={this.state.p2_third}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p2')}
                  </Input>
                </FormGroup>

                {/* Plenary 3 Rankings */}
                <h5>Plenary 3 Rankings</h5>
                <FormGroup>
                  <Label>First Choice</Label>
                  <Input
                    type="select"
                    name="p3_first"
                    value={this.state.p3_first}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Second Choice</Label>
                  <Input
                    type="select"
                    name="p3_second"
                    value={this.state.p3_second}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label>Third Choice</Label>
                  <Input
                    type="select"
                    name="p3_third"
                    value={this.state.p3_third}
                    onChange={this.handleChange}
                  >
                    <option value="">Select</option>
                    {this.generateDropdownOptions('p3')}
                  </Input>
                </FormGroup>

                {/* Notes */}
                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    type="textarea"
                    name="inputNotes"
                    value={this.state.inputNotes}
                    onChange={this.handleChange}
                  />
                </FormGroup>

                {/* Lunch Checkbox */}
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="lunch"
                      checked={this.state.lunch}
                      onChange={(e) => this.setState({ lunch: e.target.checked })}
                    />
                    Lunch?
                  </Label>
                </FormGroup>

                {/* Submit Button */}
                <center>
                  <Button type="submit" className={this.state.buttonStatus[1]}>
                    {this.state.buttonStatus[0]}
                  </Button>
                </center>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
