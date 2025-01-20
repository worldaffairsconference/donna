// import React, { Component } from 'react';
// import {
//   Button,
//   FormGroup,
//   Label,
//   Input,
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
// } from 'reactstrap';
// import { ref, firebaseAuth } from '../../helpers/firebase';
// import { logout } from '../../helpers/auth';

// export default class StudentDashboard extends Component {
//   constructor(props) {
//     super(props);
//     const userId = firebaseAuth.currentUser.uid;

//     this.state = {
//       userid: userId,
//       teacherID: '',
//       name: '', // Student's name
//       teacherName: '', // Teacher's name
//       school: '', // School name
//       wacDate: '', // WAC date
//       greeting: '', // Greeting message
//       p1_rank1: '',
//       p1_rank2: '',
//       p1_rank3: '',
//       p1_rank4: '',
//       p1_rank5: '',
//       p2_rank1: '',
//       p2_rank2: '',
//       p2_rank3: '',
//       p2_rank4: '',
//       p2_rank5: '',
//       p3_rank1: '',
//       p3_rank2: '',
//       p3_rank3: '',
//       p3_rank4: '',
//       p3_rank5: '',
//       inputNotes: '',
//       lunch: false,
//       plenOptions: {
//         p1: {
//           name: 'Plenary 1',
//           options: [
//             { id: 'p1o1', name: 'Plenary 1 Option 1' },
//             { id: 'p1o2', name: 'Plenary 1 Option 2' },
//             { id: 'p1o3', name: 'Plenary 1 Option 3' },
//             { id: 'p1o4', name: 'Plenary 1 Option 4' },
//             { id: 'p1o5', name: 'Plenary 1 Option 5' },
//           ],
//         },
//         p2: {
//           name: 'Plenary 2',
//           options: [
//             { id: 'p2o1', name: 'Plenary 2 Option 1' },
//             { id: 'p2o2', name: 'Plenary 2 Option 2' },
//             { id: 'p2o3', name: 'Plenary 2 Option 3' },
//             { id: 'p2o4', name: 'Plenary 2 Option 4' },
//             { id: 'p2o5', name: 'Plenary 2 Option 5' },
//           ],
//         },
//         p3: {
//           name: 'Plenary 3',
//           options: [
//             { id: 'p3o1', name: 'Plenary 3 Option 1' },
//             { id: 'p3o2', name: 'Plenary 3 Option 2' },
//             { id: 'p3o3', name: 'Plenary 3 Option 3' },
//             { id: 'p3o4', name: 'Plenary 3 Option 4' },
//             { id: 'p3o5', name: 'Plenary 3 Option 5' },
//           ],
//         },
//       },
//       magic: '',
//       modal2: false,
//       buttonStatus: ['Save Changes', 'btn btn-primary'],
//     };

//     this.handleSavePlenaries = this.handleSavePlenaries.bind(this);
//     this.handleNotesAndLunchSubmit = this.handleNotesAndLunchSubmit.bind(this);
//     this.handleDropdownChange = this.handleDropdownChange.bind(this);
//     this.handleNoteChange = this.handleNoteChange.bind(this);
//     this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
//     this.toggleModal2 = this.toggleModal2.bind(this);

//     this.initializeData = this.initializeData.bind(this);
//   }

//   // Fetch student and related data
//   initializeData(userId) {
//     ref.child(`students/${userId}`).once('value', (snapshot) => {
//       const studentData = snapshot.val();
//       if (studentData) {
//         const { teacherID, name, school, wacDate } = studentData;

//         this.setState({
//           teacherID: teacherID || '',
//           name: name || 'Student',
//           school: school || 'Your School',
//           wacDate: wacDate || 'March 5th, 2025',
//         });

//         if (teacherID) {
//           ref.child(`teachers/${teacherID}/name`).once('value', (teacherSnapshot) => {
//             const teacherName = teacherSnapshot.val();
//             this.setState({ teacherName: teacherName || 'Your Teacher' });
//           });

//           ref.child(`teachers/${teacherID}/school`).once('value', (schoolSnapshot) => {
//             const schoolName = schoolSnapshot.val();
//             this.setState({ school: schoolName || 'Your School' });
//           });

//           ref.child(`teachers/${teacherID}/students/${userId}`).once('value', (studentDetailsSnapshot) => {
//             const studentDetails = studentDetailsSnapshot.val();
//             if (studentDetails) {
//               this.setState({
//                 p1_rank1: studentDetails.p1?.rank1 || '',
//                 p1_rank2: studentDetails.p1?.rank2 || '',
//                 p1_rank3: studentDetails.p1?.rank3 || '',
//                 p1_rank4: studentDetails.p1?.rank4 || '',
//                 p1_rank5: studentDetails.p1?.rank5 || '',
//                 p2_rank1: studentDetails.p2?.rank1 || '',
//                 p2_rank2: studentDetails.p2?.rank2 || '',
//                 p2_rank3: studentDetails.p2?.rank3 || '',
//                 p2_rank4: studentDetails.p2?.rank4 || '',
//                 p2_rank5: studentDetails.p2?.rank5 || '',
//                 p3_rank1: studentDetails.p3?.rank1 || '',
//                 p3_rank2: studentDetails.p3?.rank2 || '',
//                 p3_rank3: studentDetails.p3?.rank3 || '',
//                 p3_rank4: studentDetails.p3?.rank4 || '',
//                 p3_rank5: studentDetails.p3?.rank5 || '',
//                 inputNotes: studentDetails.note || '',
//                 lunch: studentDetails.lunch || false,
//               });
//             }
//           });
//         }
//       }
//     });
//   }

//   componentDidMount() {
//     const userId = this.state.userid;

//     const currentHour = new Date().getHours();
//     const greeting = currentHour < 12
//       ? 'Good morning'
//       : currentHour < 18
//       ? 'Good afternoon'
//       : 'Good evening';

//     this.setState({ greeting });
//     this.initializeData(userId);
//   }

//   // Generate dropdown options dynamically
//   generateDropdownOptions(plenKey) {
//     const plenOptions = this.state.plenOptions[plenKey]?.options || [];
//     return (
//       <>
//         <option value="">Select an option</option>
//         {plenOptions.map((option) => (
//           <option key={option.id} value={option.id}>
//             {option.name}
//           </option>
//         ))}
//       </>
//     );
//   }

//   render() {
//     const { greeting, name, teacherName, school, wacDate } = this.state;

//     const dropdownStyle = {
//       border: '1px solid #ccc',
//       borderRadius: '4px',
//       padding: '8px',
//     };

//     return (
//       <Container>
//         {/* Greeting Section */}
//         <Row>
//           <Col md="10">
//             <h1 className="text-white">Student Dashboard</h1>
//           </Col>
//           <Col md="2">
//             <Button color="secondary" className="float-right" onClick={logout}>
//               Log Out
//             </Button>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <h1 className="text-primary">{`${greeting}, ${name}`}</h1>
//             <p className="text-muted">
//               WAC Date: {wacDate} | Teacher: {teacherName} | School: {school}
//             </p>
//           </Col>
//         </Row>

//         {/* Plenaries Section */}
//         <Card className="mt-4 inner-container">
//           <Form>
//             <Row>
//               {['p1', 'p2', 'p3'].map((plenKey, plenIndex) => (
//                 <Col md="4" key={plenKey}>
//                   <h5>{`Plenary ${plenIndex + 1}`}</h5>
//                   {[...Array(5)].map((_, rankIndex) => {
//                     const rank = `rank${rankIndex + 1}`;
//                     const fieldName = `${plenKey}_${rank}`;
//                     return (
//                       <FormGroup key={rank}>
//                         <Label for={fieldName}>{`Rank ${rankIndex + 1}`}</Label>
//                         <Input
//                           style={dropdownStyle}
//                           type="select"
//                           name={fieldName}
//                           id={fieldName}
//                           value={this.state[fieldName]}
//                           onChange={this.handleDropdownChange}
//                         >
//                           {this.generateDropdownOptions(plenKey)}
//                         </Input>
//                       </FormGroup>
//                     );
//                   })}
//                 </Col>
//               ))}
//             </Row>

//             <Row>
//               <Col className="text-center mt-4">
//                 <Button color="primary" type="submit" onClick={this.handleSavePlenaries}>
//                   Save Plenary Selections
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>

//         {/* Notes and Lunch Section */}
//         <Card className="mt-4 inner-container">
//           <Form onSubmit={this.handleNotesAndLunchSubmit}>
//             <Row>
//               <Col md="6">
//                 <FormGroup>
//                   <Label for="notes">Notes</Label>
//                   <Input
//                     type="textarea"
//                     name="notes"
//                     value={this.state.inputNotes}
//                     onChange={this.handleNoteChange}
//                   />
//                 </FormGroup>
//               </Col>
//               <Col md="6" className="d-flex align-items-center justify-content-start">
//                 <FormGroup className="mb-0">
//                   <Label check>
//                     <Input
//                       type="checkbox"
//                       checked={this.state.lunch}
//                       onChange={this.handleCheckboxChange}
//                       className="mr-2"
//                     />
//                     I will be eating the catered lunch (provided by Aramark)
//                   </Label>
//                 </FormGroup>
//               </Col>
//             </Row>
//             <Row>
//               <Col className="text-center mt-4">
//                 <Button color="primary" type="submit">
//                   Save Notes and Lunch
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </Card>
//       </Container>
//     );
//   }
// }






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
          name: name || 'Student',
          school: school || 'Your School',
          wacDate: wacDate || 'March 5th, 2025',
        });
  
        if (teacherID) {
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
  

  render() {
    const { greeting, name, teacherName, school, wacDate } = this.state;
    return (
      
      <Container>
        <Row>
          <Col md="10">
            <h1 className="text-white"></h1>
          </Col>
          <Col md="2">
            <Button color="secondary" className="float-right" onClick={logout}>
              Log Out
            </Button>
          </Col>
        </Row>

        {/* Greeting and Info Section */}
        <Row>
          <Col>
            <h1 className="text-primary">{`${greeting}, ${name}`}</h1>
            <p className="text-muted">
              WAC Date: {wacDate} | Teacher: {teacherName} | School: {school}
            </p>
          </Col>
        </Row>

        <Card className="mt-4 inner-container">
          {/* Plenaries Section */}
          <Form>
            <Row>
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

            <Row>
              <Col className="text-center mt-4">
                <Button
                  color="primary" 
                  type="submit"
                  onClick={this.handleSavePlenaries}
                >
                  Save Plenary Selections
                </Button>
              </Col>
            </Row>
          </Form>


          {/* Notes and Lunch Section */}
          <Form onSubmit={this.handleNotesAndLunchSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="notes">Notes</Label>
                  <Input
                    type="textarea"
                    name="notes"
                    value={this.state.inputNotes}
                    onChange={this.handleNoteChange}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="d-flex align-items-center justify-content-start">
                <FormGroup className="mb-0">
                <Label check>
                  <Input
                    type="checkbox"
                    checked={this.state.lunch}
                    onChange={this.handleCheckboxChange}
                    className="mr-2"
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
      </Container>
    );
  }
}






