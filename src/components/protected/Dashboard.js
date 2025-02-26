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
  Card,
  Alert,
  CardText,
  CardTitle,
  Input,
} from 'reactstrap';
import { StudentRow } from './StudentRow';
import { ref, firebaseAuth } from '../../helpers/firebase';
import { deleteTeacherUserData, logout } from '../../helpers/auth';
import QRCode from 'react-qr-code';


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    const userId = firebaseAuth.currentUser.uid;
    // var myStudentDataKey = [];
    // var myStudentDataArr = [];


    // ref
    //   .child('teachers/' + userId + '/students/')
    //   .on('value', function (snapshot) {
    //     snapshot.forEach(function (childSnapshot) {
    //       var childKey = childSnapshot.key;
    //       myStudentDataKey.push(childKey);
    //       var childData = childSnapshot.val();
    //       myStudentDataArr.push(childData);
    //     });
    //   });


    this.toggleModal = this.toggleModal.bind(this);
    this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleSearch = this.handleSearch.bind(this);


    this.state = {
      userId,
      name: '',
      greeting: '',
      students: [],
      searchQuery: '',
      alert: false,
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
            { id: 'p2o1', name: 'Michael Kaufman | Breaking Barriers: Engaging Men in Gender Equality for a Better World' },
            { id: 'p2o2', name: 'Sylvia Torres Guillen | Mi Camino A La Justicia: How Challenging the Legal System Results in a Real Democracy' },
            { id: 'p2o3', name: 'Shirley Blumberg | Imagining the Future: Building on the Past' },
            { id: 'p2o4', name: 'John Smol | Our “Anthropocene” World: The Critical Role of Science Literacy and Effective Communication' },
            { id: 'p2o5', name: 'Wolfgang Schwan and Yan Boechat | Eyes on the Frontlines: challenges and triumphs of reporting in conflict zones' },
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
    };


    this.initializeData = this.initializeData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);


    // Initialize data retrieval
    this.initializeData(userId);


    // console.log(this.state.myStudentDataKey);
    // console.log(this.state.myStudentDataArr);


    // ref.child('teachers/' + userId).once('value', (snapshot) =>
    //   this.setState({
    //     waiver: snapshot.val().waiver,
    //     name: snapshot.val().name,
    //     school: snapshot.val().school,
    //     students: snapshot.val().students,
    //   })
    // );


    // ref.child('plenaries').once('value', (snapshot) => {
    //   this.setState({ plenOptions: snapshot.val() });
    // });
  }


  componentDidMount() {
    // Set greeting based on the current time
    const currentHour = new Date().getHours();
    let greeting = '';
    if (currentHour < 12) greeting = 'Good morning';
    else if (currentHour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';


    this.setState({ greeting });


    this.initializeData(this.state.userId);


  }
  initializeData(userId) {
    ref.child(`teachers/${userId}`).on('value', (snapshot) => {
      const teacherData = snapshot.val();
      if (teacherData) {
        this.setState({
          name: teacherData.name || 'Unknown',  // Fetch teacher's name
          school: teacherData.school || 'Unknown School',  // Fetch school name
          waiver: teacherData.waiver || false,  // Fetch waiver status
          students: teacherData.students // Fetch student data
            ? Object.entries(teacherData.students).map(([id, data]) => ({
                id,
                ...data,
              }))
            : [],
        });
      }
    });
  }


  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }


  proceedDeleteAccount() {
    deleteTeacherUserData();
  }


  handleCopy() {
    const text = `https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`;
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    this.setState({ alert: true });

    setTimeout(() => {
      this.setState({ alert: false });
    }, 1000);
  }


  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
  }


  render() {
    const { greeting, students, searchQuery } = this.state;
    const filteredStudents = students.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
      <Container>
        <br />
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h" class="text-white">{`${greeting}, ${this.state.name}`}</h1>
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
        </Row>
        <Row>
          <Col>
            {/* <h4 class="text-white">Supervisor: {this.state.name}</h4> */}
            <h4 class="text-white">School: {this.state.school}</h4>
          </Col>
        </Row>
        <Row className="mt-3">
          <Card body className="inner-container">
            <CardTitle tag="h5">
              <b>Student Registration Instructions</b>
            </CardTitle>
            <CardText>
              Share the following registration link with your students to register:
            </CardText>
            <CardText>
              <b>
                <a
                  href={`https://reg.worldaffairscon.org/register?access=${firebaseAuth.currentUser.uid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                </a>
              </b>
            </CardText>
            <CardText className="mt-1">
              <Button color="primary" onClick={this.handleCopy}>
                Copy Registration Link
              </Button>
            </CardText>
            <hr className="my-2" color='white'/>
            <CardText className="mt-3">
              Alternatively, give your students this access code: <b>{firebaseAuth.currentUser.uid}</b>
            </CardText>
            <CardText className="mt-1">
              <Button
                color="primary"
                onClick={this.handleCopy}
              >
                Copy Access Code
              </Button>
            </CardText>
            {(this.state.alert || this.state.alertCopyCode) && (
              <Alert color="success" className="mt-2">
                Copy Successful!
              </Alert>
            )}
          </Card>
        </Row>
        <br />
        <hr />
        <h2 class="text-white">Cancellation Policy: </h2>
        <p class="text-white">
          If you can no longer attend WAC, kindly email us at <a href="mailto:2wac@ucc.on.ca">wac@ucc.on.ca</a>. 
        </p>
        <p class="text-white">
          After <strong>Friday, February 28th 2025</strong>, all lunch orders are final and your school will be charged for all orders as they appear on that date.
        </p>
        <br />
        <h2 class="text-white">Waiver Status: </h2>
        <p class="text-white">
          You will need to complete and sign a waiver before attending the
          conference. Please download the document below and complete the form.
          {/* Send the completed form via this{' '} */}
          {/* <a href="https://coda.io/form/Waiver_deuhNh1mvi4">link</a>.  */}
          Please stand by as we are creating a new form. Once we
          have received and processed your waiver, the status below will change
          to "Received".
        </p>
        {this.state.waiver ? (
          <div>
            <h2>
              <Badge color="success">Received</Badge>
            </h2>
          </div>
        ) : (
          <div>
            <h2>
              <Badge color="danger">Not Received</Badge>
            </h2>
            <Button
              color="primary"
              href="/resources/Faculty Waiver 2025.pdf"
              target="_blank"
            >
              Download PDF
            </Button>
          </div>
        )}
        <hr />
        <br />
        <h2 class="text-white">My Students</h2>
        <br />
        <Col md="3" sm="5" xs="10">
        <Input
          type="text"
          className="form-control inner-container input-border-grey"
          placeholder="Search by name"
          value={this.state.searchQuery}
          onChange={this.handleSearch}
        />
        </Col>
        <br />
        <div id="table">
          <Table className="text-white">
            <thead class="text-white">
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Lunch</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Plenary #3</th>
                <th style={{width: '200px'}}>Notes</th>
              </tr>
            </thead>
            <StudentRow
              class="text-white"
              studentData={filteredStudents}
              plenOptions={this.state.plenOptions}
            />
          </Table>
        </div>
      </Container>
    );
  }
}
