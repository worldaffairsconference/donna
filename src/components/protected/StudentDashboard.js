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
  Popover,
  PopoverHeader,
  PopoverBody,
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
            { id: 'p1o1', name: 'John Sitilides | Trump & the World 2025: The New Geopolitics of Trade, Energy, Diplomacy, and War' },
            { id: 'p1o2', name: 'Sylvia Torres-Guillen | Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy' },
            { id: 'p1o3', name: 'Dr. Justina Ray | Biodiversity Conservation in a Rapidly Changing Environment: A Canadian Perspective' },
            { id: 'p1o4', name: 'Emma Lozhkin | From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation' },
            // { id: 'p1o5', name: 'Plenary 1 Option 5' },
          ],
        },
        p2: {
          name: 'Plenary 2',
          options: [
            { id: 'p2o1', name: 'Michael Kaufman | Breaking Barriers: Engaging Men in Gender Equality for a Better World' },
            { id: 'p2o2', name: 'Andrew Healey | Organ Donation and Transplant - Success on the Edge' },
            { id: 'p2o3', name: ' Curtis VanWelleghem | From Idea to Reality – Using the Earth as a Battery' },
            { id: 'p2o4', name:  'John Smol | Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication' },
            { id: 'p2o5', name: 'Wolfgang Schwan and Yan Boechat | Eyes on the Frontlines: challenges and triumphs of reporting in conflict zones' },
          ],
        },
        p3: {
          name: 'Plenary 3',
          options: [
            { id: 'p3o1', name: 'James Suh | Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?' },
            { id: 'p3o2', name: 'Dr. Jeremy Wang | Propelling Progress: Driving Positive Change Through Entrepreneurship and Drones' },
            { id: 'p3o3', name: 'Eric Zhu | High School Hallways to Startup Success: Eric Zhu’s Journey with Aviato' },
            { id: 'p3o4', name: 'Shirley Blumberg | Imagining the Future: Building on the Past' },
            { id: 'p3o5', name: 'Dr. Sebastian Maurice | AI Horizons: Inspiring the Next Generation of Innovators' },
          ],
        },
      },
      magic: '',
      modal2: false,
      popoverOpenP1: false,
      popoverOpenP2: false,
      popoverOpenP3: false,
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

  popoverCloseTimerP1 = null;
  popoverCloseTimerP2 = null;
  popoverCloseTimerP3 = null;

  handlePopoverMouseEnterP1 = () => {
    // Clear any closing timer if the mouse enters the target or popover
    if (this.popoverCloseTimerP1) {
      clearTimeout(this.popoverCloseTimerP1);
      this.popoverCloseTimerP1 = null;
    }
    this.setState({ popoverOpenP1: true });
  };

  handlePopoverMouseLeaveP1 = () => {
    // Set a delay before closing the popover
    this.popoverCloseTimerP1 = setTimeout(() => {
      this.setState({ popoverOpenP1: false });
    }, 300); // 300ms delay; adjust as needed
  };

  handlePopoverMouseEnterP2 = () => {
    // Clear any closing timer if the mouse enters the target or popover
    if (this.popoverCloseTimerP2) {
      clearTimeout(this.popoverCloseTimerP2);
      this.popoverCloseTimerP2 = null;
    }
    this.setState({ popoverOpenP2: true });
  };

  handlePopoverMouseLeaveP2 = () => {
    // Set a delay before closing the popover
    this.popoverCloseTimerP2 = setTimeout(() => {
      this.setState({ popoverOpenP2: false });
    }, 300); // 300ms delay; adjust as needed
  };

  handlePopoverMouseEnterP3 = () => {
    // Clear any closing timer if the mouse enters the target or popover
    if (this.popoverCloseTimerP3) {
      clearTimeout(this.popoverCloseTimerP3);
      this.popoverCloseTimerP3 = null;
    }
    this.setState({ popoverOpenP3: true });
  };

  handlePopoverMouseLeaveP3 = () => {
    // Set a delay before closing the popover
    this.popoverCloseTimerP3 = setTimeout(() => {
      this.setState({ popoverOpenP3: false });
    }, 300); // 300ms delay; adjust as needed
  };

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


  // DOUBLE CHECK WITH LIYANG TO SEE IF EVERYTHING IS CORRECT

  plenaryDetails = {
    p1o1: { time: '10:25 AM - 11:15 AM', title: 'Trump & the World 2025: The New Geopolitics of Trade, Energy, Diplomacy, and War', speaker: 'John Sitilides', location: 'Laidlaw Hall' },
    p1o2: { time: '10:25 AM - 11:15 AM', title: 'Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy', speaker: 'Sylvia Torres-Guillen', location: 'Student Centre'},
    p1o3: { time: '10:25 AM - 11:15 AM', title: 'Biodiversity Conservation in a Rapidly Changing Environment: A Canadian Perspective', speaker: 'Dr. Justina Ray', location: 'Manucha & Bellamy Studio Theatre' },
    p1o4: { time: '10:25 AM - 11:15 AM', title: 'From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation', speaker: 'Emma Lozhkin', location: 'Rooms 248 + 249' },
    p2o1: { time: '11:45 AM - 12:35 PM', title: 'Breaking Barriers: Engaging Men in Gender Equality for a Better World', speaker: 'Michael Kaufman', location: 'Laidlaw Hall' },
    p2o2: { time: '11:45 AM - 12:35 PM', title: 'Organ Donation and Transplant - Success on the Edge', speaker: 'Andrew Healey', location: 'Student Centre' },
    p2o3: { time: '11:45 AM - 12:35 PM', title: 'From Idea to Reality – Using the Earth as a Battery', speaker: 'Curtis VanWelleghem', location: 'Manucha & Bellamy Studio Theatre' },
    p2o4: { time: '11:45 AM - 12:35 PM', title: 'Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication', speaker: 'John Smol', location: 'Rooms 248 + 249' },
    p2o5: { time: '11:45 AM - 12:35 AM', title: 'Eyes on the Frontlines: Challenges and Triumphs of Reporting in Conflict Zones', speaker: 'Wolfgang Schwan and Yan Boechat', location: 'Room 232' },
    p3o1: { time: '1:35 PM - 2:25 PM', title: 'Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?', speaker: 'James Suh', location: 'Laidlaw Hall' },
    p3o2: { time: '1:35 PM - 2:25 PM', title: 'Propelling Progress: Driving Positive Change Through Entrepreneurship and Drones', speaker: 'Dr. Jeremy Wang', location: 'Student Centre' },
    p3o3: { time: '1:35 PM - 2:25 PM', title: 'High School Hallways to Startup Success: Eric Zhu’s Journey with Aviato', speaker: 'Eric Zhu', location: 'Manucha & Bellamy Studio Theatre' },
    p3o4: { time: '1:35 PM - 2:25 PM', title: 'Imagining the Future: Building on the Past', speaker: 'Shirley Blumberg', location: 'Rooms 248 + 249' },
    p3o5: { time: '1:35 PM - 2:25 PM', title: 'AI Horizons: Inspiring the Next Generation of Innovators', speaker: 'Dr. Sebastian Maurice', location: 'Room 232' },
  };

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
          // This will be filled using the algorithm
          plenarySelections: {
            p1: studentData.p1 || '',
            p2: studentData.p2 || '',
            p3: studentData.p3 || '',
          },
          lunch: studentData.lunch || false,
        },
        this.generateSchedule
      );  

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

  // generateSchedule = () => {
  //   const { plenarySelections } = this.state;
  //   const schedule = [
  //     { time: '8:30 AM - 9:00 AM', title: 'Registration', speaker: '', location: 'Bernick Foyer' },
  //     { time: '9:10 AM - 10:20 AM', title: 'Opening Keynote', speaker: 'Bill Weir', location: 'Laidlaw Hall' },
  //     { time: '10:25 AM - 11:15 AM', ...this.plenaryDetails[plenarySelections.p1] },
  //     { time: '11:15 AM - 11:45 AM', title: 'Various Events', speaker: 'Various', location: 'Various' },
  //     { time: '11:45 AM - 12:35 PM', ...this.plenaryDetails[plenarySelections.p2] },
  //     { time: '12:35 PM - 1:35 PM', title: 'Lunch', speaker: '', location: 'Lett Gym' },
  //     { time: '1:35 PM - 2:25 PM', ...this.plenaryDetails[plenarySelections.p3] },
  //     { time: '2:25 PM - 2:30 PM', title: '5-Minute Break', speaker: 'N/A', location: 'N/A' },
  //     { time: '2:30 PM - 3:40 PM', title: 'Closing Keynote', speaker: 'Dr. James Orbinski', location: 'Laidlaw Hall' },
  //   ].filter(event => event.title);

  //   this.setState({ schedule });
  // };

  render() {
    const { greeting, name, teacherName, school, wacDate } = this.state;

    {/* Greeting and Info Section */}
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

        {/* PLENARY SELECTION */}
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
                <h5>Plenary 1
                <br />
                <Button
                      id="PopoverP1"
                      color="link"
                      onMouseEnter={this.handlePopoverMouseEnterP1}
                      onMouseLeave={this.handlePopoverMouseLeaveP1}
                      onClick={(e) => e.preventDefault()}
                      style={{ padding: 0, fontSize: '0.9rem' }}
                    >
                      Info
                  </Button>
                </h5>
                <Popover
                  placement="bottom"
                  isOpen={this.state.popoverOpenP1}
                  target="PopoverP1"
                  // toggle={this.togglePopoverP1}
                  // trigger="hover"
                >
                  <div
                    onMouseEnter={this.handlePopoverMouseEnterP1}
                    onMouseLeave={this.handlePopoverMouseLeaveP1}
                  ></div>
                  <PopoverHeader>Plenary 1 Speakers</PopoverHeader>
                  <PopoverBody>
                    <strong>John Sitilides</strong> (Jan 27): We’re proud to announce our first plenary speaker for WAC ’25!<br/><br/>
                    <strong>Sylvia Torres-Guillen</strong> (Feb 18): From the courtroom to the conference stage, join us in welcoming her!<br/><br/>
                    <strong>Dr. Justina Ray</strong> (Feb 19): President and Senior Scientist with extensive expertise in biodiversity conservation.<br/><br/>
                    <strong>Emma Lozhkin</strong> (Feb 12): Former Canadian National Gymnast turned software engineer at NVIDIA.
                  </PopoverBody>
                </Popover>
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
                <h5>Plenary 2
                <br />
                <Button
                    id="PopoverP2"
                    color="link"
                    onMouseEnter={this.handlePopoverMouseEnterP2}
                    onMouseLeave={this.handlePopoverMouseLeaveP2}
                    style={{ padding: 0, fontSize: '0.9rem' }}
                  >
                    Info
                  </Button>
                </h5>
                <Popover
                  placement="bottom"
                  isOpen={this.state.popoverOpenP2}
                  target="PopoverP2"
                  // toggle={this.togglePopoverP2}
                  // trigger="hover"
                >
                  <div
                    onMouseEnter={this.handlePopoverMouseEnterP2}
                    onMouseLeave={this.handlePopoverMouseLeaveP2}
                  ></div>
                  <PopoverHeader>Plenary 2 Speakers</PopoverHeader>
                  <PopoverBody>
                    <strong>Michael Kaufman</strong> (Feb 10): Renowned for engaging men in gender equality.<br/><br/>
                    <strong>Dr. Andrew Healey</strong> (Feb 3): Critical care specialist and transplant expert.<br/><br/>
                    <strong>Curtis VanWelleghem</strong> (Feb 14): Innovative thinker turning ideas into reality.<br/><br/>
                    <strong>John Smol</strong> (Jan 30): Distinguished professor known for pioneering environmental research.<br/><br/>
                    <strong>Wolfgang Schwarz</strong> (Feb 25): Celebrated former Olympic figure skater.
                  </PopoverBody>
                </Popover>
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
                <h5>Plenary 3
                <br />
                <Button
                    id="PopoverP3"
                    color="link"
                    onMouseEnter={this.handlePopoverMouseEnterP3}
                    onMouseLeave={this.handlePopoverMouseLeaveP3}
                    style={{ padding: 0, fontSize: '0.9rem' }}
                  >
                    Info
                </Button>
                </h5>
                <Popover
                  placement="bottom"
                  isOpen={this.state.popoverOpenP3}
                  target="PopoverP3"
                  // toggle={this.togglePopoverP3}
                  // trigger="hover"
                >
                  <div
                    onMouseEnter={this.handlePopoverMouseEnterP3}
                    onMouseLeave={this.handlePopoverMouseLeaveP3}
                  ></div>
                  <PopoverHeader>Plenary 3 Speakers</PopoverHeader>
                  <PopoverBody>
                    <strong>James Suh</strong> (Feb 20): CFO with leadership in sports business.<br/><br/>
                    <strong>Dr. Jeremy Wang</strong> (Jan 29): COO and innovator in aerospace and drone technology.<br/><br/>
                    <strong>Eric Zhu</strong> (Feb 5): Young CEO who began his entrepreneurial journey in high school.<br/><br/>
                    <strong>Shirley Blumberg</strong> (Feb 17): Acclaimed architect known for sustainable designs.<br/><br/>
                    <strong>Dr. Sebastian Maurice</strong> (Feb 23): Esteemed academic and keynote plenary speaker.
                  </PopoverBody>
                </Popover>

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
        </Card> 
        {/* MOVE THIS TO THE BOTTOM OF THE PAGE AFTER BOTH FORMS */}

          <Form onSubmit={this.handleNotesAndLunchSubmit} style={{ color: 'white' }}>

            <Row className="mt-4">
              <Col md="6">
                <FormGroup>
                  <Label for="notes" style={{ color: 'white' }}>Accessibility/Dietary Restrictions/Other Notes</Label>
                  <Input
                    type="textarea"
                    name="notes"
                    id="notes"
                    value={this.state.inputNotes}
                    onChange={this.handleNoteChange}
                    style={{ color: '#333' }}
                  />
                </FormGroup>
              </Col>
              <Col md="6" className="d-flex align-items-center">
                <FormGroup check>
                  <Label check style={{ color: 'white' }}>
                    <Input
                      type="checkbox"
                      checked={this.state.lunch}
                      onChange={this.handleCheckboxChange}
                      style={{ color: '#333' }}

                      /*Uncomment to disable lunch orders

                      disabled

                      Uncomment to disable lunch orders*/
                    />
                    I will be eating the catered lunch provided by Aramark for <strong>$15</strong>
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className="text-center mt-4">
                <Button color="primary" type="submit" style={{ backgroundColor: '#4a8dee', borderColor: '#4a8dee' }}>
                  Save Notes and Lunch
                </Button>
              </Col>
            </Row>
          </Form>

        {/* <Card className="mt-4 p-4">
          <h3 className="text-center">Your Schedule</h3>
          <Table striped bordered className="mt-3">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Speaker</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((event, index) => (
                <tr key={index}>
                  <td>{event.time}</td>
                  <td>{event.title || 'TBD'}</td>
                  <td>{event.speaker || 'TBD'}</td>
                  <td>{event.location || 'TBD'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container> */}

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

// {/* <Row className="mt-4">
//   <Col md="12">
//     <h3 class="text-white">Plenary selection will open shortly. Stay tuned.</h3>
//     {/* <h3 class="text-white">Your Schedule</h3> */}
//   </Col>
// </Row>  */}
      