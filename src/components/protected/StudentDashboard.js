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
            { id: 'p1o1', name: '[Keynote] Keith Pelley | President & CEO of Maple Leafs Sports and Entertainment' },
            { id: 'p1o2', name: 'Andrew Healey | Organ Donation and Transplant - Success on the Edge' },
            { id: 'p1o3', name: 'John Sitilides | Trump & the World 2025: The New Geopolitics of Trade, Energy, Diplomacy, and War' },
            { id: 'p1o4', name: 'Dr. Jeremy Wang | Propelling Progress: Driving Positive Change Through Entrepreneurship and Drones' },
            { id: 'p1o5', name: 'Dr. Justina Ray | Biodiversity Conservation in a Rapidly Changing Environment: A Canadian Perspective' },
          ],
        },
        p2: {
          name: 'Plenary 2',
          options: [
            { id: 'p2o1', name: 'Michael Kaufman | Why Women’s Rights & Gender Equality Are Great for Boys and Men!' },
            { id: 'p2o2', name: 'Sylvia Torres Guillen | Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy' },
            { id: 'p2o3', name: 'Shirley Blumberg | Imagining the Future: Building on the Past' },
            { id: 'p2o4', name: 'John Smol | Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication' },
            { id: 'p2o5', name: 'Wolfgang Schwartz and Yan Boechat | Eyes on the Frontlines: challenges and triumphs of reporting in conflict zones' },
          ],
        },
        p3: {
          name: 'Plenary 3',
          options: [
            { id: 'p3o1', name: 'James Suh | Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?' },
            { id: 'p3o2', name: 'Emma Lozhkin | From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation' },
            { id: 'p3o3', name: 'Eric Zhu | High School Hallways to Startup Success: Eric Zhu’s Journey with Aviato' },
            { id: 'p3o4', name: 'Curtis VanWelleghem | From Idea to Reality – Using the Earth as a Battery' },
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
    alert('Plenary selections saved successfully! Your detailed conference schedule will be published on March 3rd.');
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

  plenDetails = {
    p1o1: { time: '10:25 AM - 11:15 AM', title: 'Keith Pelley | The Future of Maple Leafs Sports and Entertainment', speaker: 'Keith Pelley', location: 'Laidlaw Hall' },
    p1o2: { time: '10:25 AM - 11:15 AM', title: 'Organ Donation and Transplant - Success on the Edge', speaker: 'Andrew Healey', location: 'Student Centre' },
    p1o3: { time: '10:25 AM - 11:15 AM', title: 'Trump & the World 2025: The New Geopolitics of Trade, Energy, Diplomacy, and War', speaker: 'John Sitilides', location: 'Manucha & Bellamy Studio Theatre' },
    p1o4: { time: '10:25 AM - 11:15 AM', title: 'Propelling Progress: Driving Positive Change Through Entrepreneurship and Drones', speaker: 'Dr. Jeremy Wang', location: 'Student Centre' },
    p1o5: { time: '10:25 AM - 11:15 AM', title: 'Biodiversity Conservation in a Rapidly Changing Environment: A Canadian Perspective', speaker: 'Dr. Justina Ray', location: 'Room 232' },
    p2o1: { time: '11:45 AM - 12:35 PM', title: 'Breaking Barriers: Engaging Men in Gender Equality for a Better World', speaker: 'Michael Kaufman', location: 'Laidlaw Hall' },
    p2o2: { time: '11:45 AM - 12:35 PM', title: 'Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy', speaker: 'Sylvia Torres Guillen', location: 'Student Centre' },
    p2o3: { time: '11:45 AM - 12:35 PM', title: 'Imagining the Future: Building on the Past', speaker: 'Shirley Blumberg', location: 'Rooms 248 + 249' },
    p2o4: { time: '11:45 AM - 12:35 PM', title: 'Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication', speaker: 'John Smol', location: 'Rooms 248 + 249' },
    p2o5: { time: '11:45 AM - 12:35 PM', title: 'Eyes on the Frontlines: Challenges and Triumphs of Reporting in Conflict Zones', speaker: 'Wolfgang Schwartz and Yan Boechat', location: 'Room 232' },
    p3o1: { time: '1:35 PM - 2:25 PM', title: 'Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?', speaker: 'James Suh', location: 'Laidlaw Hall' },
    p3o2: { time: '1:35 PM - 2:25 PM', title: 'From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation', speaker: 'Emma Lozhkin', location: 'Rooms 248 + 249' },
    p3o3: { time: '1:35 PM - 2:25 PM', title: 'High School Hallways to Startup Success: Eric Zhu’s Journey with Aviato', speaker: 'Eric Zhu', location: 'Manucha & Bellamy Studio Theatre' },
    p3o4: { time: '1:35 PM - 2:25 PM', title: 'From Idea to Reality – Using the Earth as a Battery', speaker: 'Curtis Van Welleghem', location: 'Manucha & Bellamy Studio Theatre' },
    p3o5: { time: '1:35 PM - 2:25 PM', title: 'AI Horizons: Inspiring the Next Generation of Innovators', speaker: 'Dr. Sebastian Maurice', location: 'Room 232' }
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

        <Row className="mt-2">
          <Col md="12">
            <h3 class="text-white">Plenary selection is now open!</h3>
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

        <Row className="mt-2">
          <Col md="12">
            <h5 className="text-white">Below, you will have the opportunity to choose your <strong>top 3</strong> most preferred plenaries in each time slot. <br />We will try our best to <strong>accommodate your preferences.</strong> Happy Choosing!</h5>
            <p className="text-white mt-2">In addition to the plenaries, all attendees will attend the <strong>Opening and Closing Keynotes at 9am and 2:30pm</strong>, respectively. Lastly, please note that in <strong>Plenary Session 1</strong>, there is an alternative <strong>keynote option</strong> led by speaker <strong>Keith Pelley, President & CEO of Maple Leafs Sports and Entertainment.</strong></p>
          </Col>
        </Row> 
      

        <Card className="mt-2 inner-container">
          <Form onSubmit={this.handleSavePlenaries}>
            <Row>              
              <Col md="4">
                <h5>Plenary 1 (10:25am - 11:15am)
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
                  style={{
                    width: '90vw',
                    maxWidth: 'none',      // up to 80% of the viewport width
                    whiteSpace: 'normal',  // let text wrap onto multiple lines
                    overflow: 'visible',    // crucial for showing content that overflows
                    border: '1px solid #ccc',
                    boxShadow: '0 0 8px rgba(0,0,0,0.2)' // optional styling
                  }}
                  // toggle={this.togglePopoverP1}
                  // trigger="hover"
                >
                  <div
                    onMouseEnter={this.handlePopoverMouseEnterP1}
                    onMouseLeave={this.handlePopoverMouseLeaveP1}
                    style={{
                      backgroundColor: 'white',
                      overflow: 'visible',  // let it expand beyond bounding box
                    }}
                  ></div>
                  <PopoverHeader style={{
                    backgroundColor: 'white',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textAlign: 'center',
                  }}> 
                    Plenary 1 Speakers
                  </PopoverHeader>
                  <PopoverBody
                    style={{
                      backgroundColor: 'white',
                      whiteSpace: 'normal',
                      overflow: 'visible',
                    }}
                  >
                    <strong>Keith Pelley</strong> is the CEO of MLSE, a $10 billion organization that owns the Toronto Maple Leafs, Toronto Raptors, Toronto FC, Toronto Argonauts, and more. Keith is also the former CEO of Rogers Media and President of the PGA. His insight into the business of pro sports is unrivalled and he’s an excellent speaker. <br/><br/>
                    <strong>Dr. Andrew Healey</strong> is an emergency and critical care specialist currently working in Hamilton, Ontario as the Chief of Critical care at St. Joseph's Hamilton.  After completing vigorous training in the organ donation field, Dr Healey now holds the position of Provincial Medical Director for Donation with Trillium Gift of Life (organ transplants through Ontario Health).  Dr Healey uses adaptive leadership to ensure that the people he works with have excellent experiences within the organ transplant and healthcare realm. <br/><br/>
                    <strong>John Sitilides</strong> has been a State Department Diplomacy Consultant for Presidents Trump, Biden, Obama, and Bush. He is a National Security Senior Fellow at the Foreign Policy Research Institute and explores the complex geopolitical and geo-economic decisions that impact markets in Asia, Europe, the Middle East, and worldwide. He was Southern Europe Regional Coordinator at the Foreign Service Institute, the State Department's professional development and diplomacy academy for American foreign policy professionals as well as the Board Chairman of the Woodrow Wilson Center Southeast Europe Project from 2005-2011. <br/><br/>
                    <strong>Dr. Jeremy Wang</strong> is the co-founder and current serving COO of the aviation service Ribbit, recipient of the Mitacs Change Agent Entrepreneur Award, and PhD graduate of Mechanical & Mechatronics Engineering from Waterloo, Dr.Wang has lead numerous teams in revolutionizing automated aerospace in Canada. He has also served at The Sky Guys, where he developed his own division creating NATO class I drones for use in North America. <br/><br/>
                    <strong>Dr. Justina Ray</strong>  has been President and Senior Scientist of WCS Canada since 2004 and has been actively involved in biodiversity conservation with a focus on northern boreal landscapes. Dr. Justina Ray has held positions on many government panels such as the Terrestrial Mammals Subcommittee of the Committee on the Status of Endangered Wildlife in Canada (COSEWIC) from 2009-2017 and a member of the IUCN Taskforce on Biodiversity and Protected Areas in (2012-2016). She has also edited or authored 3 books and a large amount of articles, and is currently Adjunct Professor at the University of Toronto (Department of Ecology and Evolution; Graduate Department of Forestry) and Trent University (Environmental & Life Sciences Graduate Program). <br/><br/>
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
                <h5>Plenary 2 (11:45am - 12:35pm)
                <br />
                <Button
                    id="PopoverP2"
                    color="link"
                    onMouseEnter={this.handlePopoverMouseEnterP2}
                    onMouseLeave={this.handlePopoverMouseLeaveP2}
                    onClick={(e) => e.preventDefault()}
                    style={{ padding: 0, fontSize: '0.9rem' }}
                  >
                  Info
                  </Button>
                </h5>
                <Popover
                  placement="bottom-start"
                  isOpen={this.state.popoverOpenP2}
                  target="PopoverP2"
                  popper={false}
                  style={{
                    position: 'absolute',
                    left: '-33vw', // Move it near Plenary 1, or wherever you want
                    width: '90vw', // or '90vw'
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                    whiteSpace: 'normal',
                    overflow: 'visible'
                  }}
                  
                  // toggle={this.togglePopoverP2}
                  // trigger="hover"
                >
                  <div
                    onMouseEnter={this.handlePopoverMouseEnterP2}
                    onMouseLeave={this.handlePopoverMouseLeaveP2}
                    style={{
                      backgroundColor: 'white',
                      overflow: 'visible',  // let it expand beyond bounding box
                    }}
                  ></div>
                  <PopoverHeader style={{
                    backgroundColor: 'white',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textAlign: 'center',
                  }}> Plenary 2 Speakers</PopoverHeader>
                  <PopoverBody
                    style={{
                      backgroundColor: 'white',
                      whiteSpace: 'normal',
                      overflow: 'visible',
                    }}
                  >
                    <strong>Michael Kaufman</strong>, PhD, is a Canadian author and educator dedicated to engaging men and boys in promoting gender equality and ending violence against women. He co-founded the White Ribbon Campaign, the world's largest movement of men working to end violence against women. Over four decades, his work with the United Nations, governments, NGOs, and corporations has spanned fifty countries.<br/><br/>
                    <strong>Sylvia Torres-Guillen</strong> is a graduate of Harvard & UC Berkeley Law and is currently the Executive Director and Director of Litigation for the Disability Rights Legal Center. A public defender of 23 years, she has had over 40 trials in federal court. Someone with a strong sense of righteousness and justice in and out of the classroom, we will be excited to hear her speak.<br/><br/>
                    <strong>Shirley Blumberg</strong> is a renowned Canadian architect and a founding partner of KPMB Architects, known for her innovative and socially conscious designs. She has played a significant role in shaping modern urban architecture, focusing on sustainable and community-driven projects. Her work includes cultural institutions, academic buildings, and affordable housing, earring her numerous accolades, including the Order of Canada for her contributions to architecture and social equity.<br/><br/>
                    <strong>Dr. John P. Smol</strong> is a Distinguished University Professor at Queen’s University. His pioneering research focuses on long-term ecosystem changes, exploring the impacts of climate change and other environmental stressors. Dr. Smol has authored over 720 academic papers and 24 books, making significant contributions to environmental science. With more than 100 prestigious teaching and research awards to his name, he is widely recognized for his lasting influence on both academia and environmental policy.<br/><br/>
                    <strong>Wolfgang Schwarz</strong> is a former Austrian figure skater best known for winning the gold medal at the 1968 Winter Olympics in Grenoble. A highly skilled competitor, he also earned silver medals at the World Champions (1966,1967) and multiple podium finishes at the European Championships. His skating career showcased technical precision and artistic excellence, making him one of Austria’s notable Olympic champions.<br/><br/>
                    <strong>Yan Boechat</strong> has been a journalist for over 20 years. Throughout most of his career, he worked as a writer-reporter, writing for the largest publications in Brazil, both in daily newspapers, magazines, and news sites. He is or was a collaborator also in international vehicles, such as The New York Times, BBC, Deutsche Welle, Voice of America, NBC News, among others.<br/><br/>
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
                <h5>Plenary 3 (1:35pm - 2:25pm)
                <br />
                <Button
                    id="PopoverP3"
                    color="link"
                    onMouseEnter={this.handlePopoverMouseEnterP3}
                    onMouseLeave={this.handlePopoverMouseLeaveP3}
                    onClick={(e) => e.preventDefault()}
                    style={{ padding: 0, fontSize: '0.9rem' }}
                  >
                    Info
                </Button>
                </h5>
                <Popover
                  placement="bottom-start"
                  isOpen={this.state.popoverOpenP3}
                  target="PopoverP3"
                  popper={false}
                  style={{
                    position: 'absolute',
                    left: '-58vw', // Move it near Plenary 1, or wherever you want
                    width: '90vw', // or '90vw'
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    boxShadow: '0 0 8px rgba(0,0,0,0.2)',
                    whiteSpace: 'normal',
                    overflow: 'visible'
                  }}
                  // toggle={this.togglePopoverP3}
                  // trigger="hover"
                >
                  <div
                    onMouseEnter={this.handlePopoverMouseEnterP3}
                    onMouseLeave={this.handlePopoverMouseLeaveP3}
                    style={{
                      backgroundColor: 'white',
                      overflow: 'visible',  // let it expand beyond bounding box
                    }}
                  ></div>
                  <PopoverHeader style={{
                    backgroundColor: 'white',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textAlign: 'center',
                  }}>Plenary 3 Speakers</PopoverHeader>
                  <PopoverBody
                    style={{
                      backgroundColor: 'white',
                      whiteSpace: 'normal',
                      overflow: 'visible',
                    }}
                  >
                    <strong>James Suh</strong> is the CFO of the NHL’s Florida Panthers, managing the finances and legalities of the Sunshine Sports and Entertainment league alongside the Panthers themselves, culminating in a Stanley Cup victory in 2024. Before joining the Panther’s management, he lived in Toronto working for Maple Leaf Sports & Entertainment as VP of Finance, as well as having finance and audit roles at Canadian Tire, Unilever, and PwC. <br/><br/>
                    <strong>Emma Lozhkin</strong> has been a successful software engineer at NVIDIA, the international computer manufacturing corporation, for over two years. In her role, she has worked on innovative projects that push the boundaries of technology and artificial intelligence. Before embarking on her career in tech, Emma was a member of the Canadian Rhythmic Gymnastics National Team from 2012 to 2017. During this time, she represented Canada in several prestigious international competitions, including the 2014 Youth Olympic Games, showcasing her exceptional skill and dedication. Her transition from elite athletics to Branksome alum to a thriving career in software engineering highlights her versatility, discipline, and drive for excellence.<br/><br/>
                    <strong>Eric Zhu</strong> is the 17 year old CEO and co-founder of Aviato, an analytical platform for private market data, often described as a “Bloomberg Terminal” for private markets. At 15 Eric started his business out of his high school bathroom, taking business calls in the stalls. He has worked with several famous investors like 8VC, Soma Capital, and the SoftBank-Naver Fund and has raised around 2.3 million dollars to date.<br/><br/>
                    <strong>Curtis VanWelleghem</strong> is the Co-Founder and CEO of Hydrostor and has led the company through technology development into commercial operations, with a multi-GW pipeline globally. Prior to Hydrostor, Curtis held positions at nuclear generator Bruce Power and in Deloitte’s Corporate Strategy Consulting Practice.<br/><br/>
                    <strong>Dr. Sebastian Maurice</strong> is Founder and CTO of OTICS, a company that applies transactional machine learning and AI to real-time data streams. Sebastian has close to 25 years of experience in public and private sectors with emphasis on providing AI strategy, software development and solutions.  He has led global teams to solve critical business problems with machine learning in Oil and Gas, Retail, Utilities, Manufacturing, Finance and Insurance, and Healthcare.  In addition to founding OTICS, he was Principal Architect at Ayla Networks in Silicon Valley, Associate Director at Gartner, Canadian Data Science Lead for Accenture, Director of Architecture and Analytics for Hitachi Solutions, Head of Data Science at Capgemini, and Energy Analytics Practice Lead at SAS.  He was also (Interim) Chief Analytics Officer at Finning Digital.
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
      