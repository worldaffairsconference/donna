import React, { Component } from 'react';
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Badge,
  Button,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ref, firebaseAuth } from '../../helpers/firebase';
import {
  addAttendee,
  adminResetPassword,
  deleteUserData,
} from '../../helpers/auth';
import Papa from 'papaparse';

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebaseAuth.currentUser.uid;

    this.state = {
      // Existing state
      signedWaiverDropdownOpen: false,
      unsignedWaiverDropdownOpen: false,
      signedWaiverSchools: [],
      unsignedWaiverSchools: [],
      modal: [false, '', '', ''],
      userId: userId,
      schoolsList: [],
      fullSchoolList: [],
      teacherList: [],
      schoolNum: 0,
      searchQuery: '',
      searchSchool: '',
      attendeeList: {},
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
            { id: 'p2o5', name: 'Wolfgang Schwartz and Yan Boechat | Eyes on the Frontlines: challenges and triumphs of reporting in conflict zones' },
          ],
        },
        p3: {
          name: 'Plenary 3',
          options: [
            { id: 'p3o1', name: 'James Suh | Behind the Stanley Cup: What Makes a Winning Team with a Championship Mindset?' },
            { id: 'p3o2', name: 'Emma Lozhkin | From Gymnastics to GPUs: Balancing Athletic Discipline and Technological Innovation' },
            { id: 'p3o3', name: 'Curtis VanWelleghem | From Idea to Reality – Using the Earth as a Battery' },
            { id: 'p3o4', name: 'Dr. Sebastian Maurice | AI Horizons: Inspiring the Next Generation of Innovators' },
          ],
        },
      },
      
      gradeDropdownOpen: false,
      plenaryDropdownOpen: false,
      selectedGrades: [],
      selectedPlenaries: [],
      exportButtonStatus: 'Export Data',

      lunchCount: 0,
      waiverTrue: 0,
      waiverFalse: 0,
      schoolCounts: {},
      waiverSelectedSchool: '',
      attendeeSelectedTeacher: '',

      // NEW: For "Add Attendee" confirmation
      addAttendeeModalOpen: false,
      newAttendeeDraft: { name: '', email: '', grade: '7', access: '' },

      // NEW: For "Delete Account" final confirmation
      deleteConfirmModalOpen: false,
      userToDelete: { email: '', teacherid: '', uid: '' },
    };

    // Bind
    this.toggleSignedWaiverDropdown = this.toggleSignedWaiverDropdown.bind(this);
    this.toggleUnsignedWaiverDropdown = this.toggleUnsignedWaiverDropdown.bind(this);
    this.handleWaiver = this.handleWaiver.bind(this);
    this.handleWaiverSubmit = this.handleWaiverSubmit.bind(this);
    this.copytoClipboard = this.copytoClipboard.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSchoolSearch = this.handleSchoolSearch.bind(this);
    this.toggleGradeDropdown = this.toggleGradeDropdown.bind(this);
    this.togglePlenaryDropdown = this.togglePlenaryDropdown.bind(this);
    this.handleGradeFilter = this.handleGradeFilter.bind(this);
    this.handlePlenaryFilter = this.handlePlenaryFilter.bind(this);
    this.exportData = this.exportData.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    // NEW: these for the two new modals
    this.toggleAddAttendeeModal = this.toggleAddAttendeeModal.bind(this);
    this.handleOpenAddAttendeeModal = this.handleOpenAddAttendeeModal.bind(this);
    this.confirmAddAttendee = this.confirmAddAttendee.bind(this);

    this.openDeleteConfirmModal = this.openDeleteConfirmModal.bind(this);
    this.closeDeleteConfirmModal = this.closeDeleteConfirmModal.bind(this);
    this.confirmDeleteAccount = this.confirmDeleteAccount.bind(this);
  }


  /*
  
  NOTE: CSV Column names MUST match those stated on the dashboard above the button.

  */

  handleBatchRegister = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Alert the user to not close the page until completion
    alert("File uploaded. Processing batch registration. Please do not close the page until complete.");
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        console.log("CSV parsing complete. Data:", results.data);
        for (const row of results.data) {
          // Normalize keys: lowercase and remove spaces
          const normalizedRow = Object.keys(row).reduce((acc, key) => {
            let newKey = key.toLowerCase().replace(/\s+/g, '');
            acc[newKey] = row[key];
            return acc;
          }, {});
  
          // Check required fields
          if (
            !normalizedRow.email ||
            !normalizedRow.firstname ||
            !normalizedRow.lastname ||
            !(normalizedRow.grade || normalizedRow.yearlevel) ||
            !normalizedRow.access
          ) {
            console.error("Missing required fields in row:", normalizedRow);
            continue;
          }
  
          try {
            // Combine first and last name
            const fullName = `${normalizedRow.firstname} ${normalizedRow.lastname}`;
            // Get grade from either 'grade' or 'yearlevel' and remove "Year" if present
            let grade = normalizedRow.grade || normalizedRow.yearlevel || "";
            grade = grade.replace(/year\s*/i, "").trim();
            // Use the access code from CSV as provided (trim whitespace)
            const access = normalizedRow.access.trim();
            // Generate a random temporary password
            const pw = (Math.random() + 1).toString(36);
  
            const newUser = await addAttendee(
              normalizedRow.email,
              pw,
              fullName,
              grade,
              access
            );
            console.log(`Registered ${normalizedRow.email} with uid: ${newUser.uid}`);
          } catch (error) {
            console.error("Error registering attendee for", normalizedRow.email, error);
          }
        }
        alert("Batch registration complete!");
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };  

  copytoClipboard(text) {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  toggleSignedWaiverDropdown = () => {
    this.setState((prevState) => ({
      signedWaiverDropdownOpen: !prevState.signedWaiverDropdownOpen,
    }));
  };
  
  toggleUnsignedWaiverDropdown = () => {
    this.setState((prevState) => ({
      unsignedWaiverDropdownOpen: !prevState.unsignedWaiverDropdownOpen,
    }));
  };

  toggle = (email = '', teacherid = '', uid = '') => {
    // The existing "Account Actions" modal
    this.setState((prevState) => ({
      modal: [!prevState.modal[0], email, teacherid, uid],
    }));
    if (!this.state.modal[0]) {
      this.copytoClipboard(uid);
    }
  }

  // --------------------------------------------------
  //   ADD/DELETE CONFIRMATION LOGIC
  // --------------------------------------------------

  // Opening the "Add Attendee" confirm modal
  handleOpenAddAttendeeModal(e) {
    e.preventDefault();
    // Grab form values
    const name = e.target.name.value;
    const email = e.target.email.value;
    const grade = e.target.grade.value;
    const access = e.target.access.value;

    // Store them in newAttendeeDraft
    this.setState({
      newAttendeeDraft: { name, email, grade, access },
      addAttendeeModalOpen: true,
    });
  }

  // Toggling the "Add Attendee" confirm modal
  toggleAddAttendeeModal() {
    this.setState((prevState) => ({
      addAttendeeModalOpen: !prevState.addAttendeeModalOpen,
    }));
  }

  // Actually add the attendee after confirmation
  async confirmAddAttendee() {
    const { name, email, grade, access } = this.state.newAttendeeDraft;

    try {
      var uid = await addAttendee(
        email,
        (Math.random() + 1).toString(36),
        name,
        grade,
        access
      );
      console.log(uid.uid);
      this.copytoClipboard(uid.uid);
      alert('Added attendee with UID:' + uid.uid);
    } catch (e) {
      alert(e);
    }

    // Close the confirmation modal
    this.setState({
      addAttendeeModalOpen: false,
      newAttendeeDraft: { name: '', email: '', grade: '7', access: '' },
    });
  }

  // Called from the first "Account Actions" modal
  openDeleteConfirmModal() {
    // This pulls from the state.modal array: [isOpen, email, teacherid, uid]
    const [isOpen, email, teacherid, uid] = this.state.modal;
    this.setState({
      deleteConfirmModalOpen: true,
      userToDelete: { email, teacherid, uid },
    });
  }

  closeDeleteConfirmModal = () => {
    this.setState((prevState) => ({
      deleteConfirmModalOpen: false,
      userToDelete: { email: '', teacherid: '', uid: '' },
    }));
  };  

  // Actually confirm delete
  confirmDeleteAccount() {
    const { email, teacherid, uid } = this.state.userToDelete;
    console.log(`Deleting account for ${email}, uid: ${uid}, tid: ${teacherid}`);

    deleteUserData(uid, teacherid);

    // close both modals
    this.closeDeleteConfirmModal();

    // also close the original "Account Actions" modal
    this.toggle();
  }

  // --------------------------------------------------
  //   Existing logic
  // --------------------------------------------------

  exportData() {
    const { teacherList, attendeeList } = this.state;
    let flattenedData = [];
    
    // Loop through each teacher record
    teacherList.forEach(([teacherName, teacherId, teacherSchool, teacherEmail]) => {
      // Filter all students who belong to this teacher
      const students = Object.entries(attendeeList).filter(
        ([, student]) => student.teacher === teacherId
      );
      
      // Loop through each student and build a flattened object
      students.forEach(([studentId, student]) => {
        flattenedData.push({
          TeacherID: teacherId,
          TeacherName: teacherName,
          TeacherEmail: teacherEmail,
          TeacherSchool: teacherSchool,
          StudentID: studentId,
          Name: student.name,
          Email: student.email,
          Grade: student.grade || '',
          Lunch: student.lunch ? 'Yes' : 'No',
          "Plenary1 Rank 1": student.p1 && student.p1.rank1 ? student.p1.rank1 : 'None',
          "Plenary1 Rank 2": student.p1 && student.p1.rank2 ? student.p1.rank2 : 'None',
          "Plenary1 Rank 3": student.p1 && student.p1.rank3 ? student.p1.rank3 : 'None',
          "Plenary2 Rank 1": student.p2 && student.p2.rank1 ? student.p2.rank1 : 'None',
          "Plenary2 Rank 2": student.p2 && student.p2.rank2 ? student.p2.rank2 : 'None',
          "Plenary2 Rank 3": student.p2 && student.p2.rank3 ? student.p2.rank3 : 'None',
          "Plenary3 Rank 1": student.p3 && student.p3.rank1 ? student.p3.rank1 : 'None',
          "Plenary3 Rank 2": student.p3 && student.p3.rank2 ? student.p3.rank2 : 'None',
          "Plenary3 Rank 3": student.p3 && student.p3.rank3 ? student.p3.rank3 : 'None',
          Note: student.note || '',
        });
      });
    });
    
    if (!flattenedData.length) {
      alert('No student data available to export.');
      return;
    }
    
    const csv = Papa.unparse(flattenedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'teachers_students_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.setState({ exportButtonStatus: 'Exported!' });
    setTimeout(() => {
      this.setState({ exportButtonStatus: 'Export Data' });
    }, 2000);
  }  

  generateOptions(plenKey) {
    const plen = this.state.plenOptions[plenKey];
    if (!plen || !plen.options) return null;
    
    return (
      <>
        {/* <option value="">None</option> */}
        {plen.options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </>
    );
  }
  

  async componentDidMount() {
    let fullSchoolList = [''];
    let teacherList = [];
    let schoolNum = 0;
    let attendeeList = {};
    let schoolsList = [['', '']];
    let schoolCounts = {};
    let lunchCount = 0;
    let waiverTrue = 0;
    let waiverFalse = 0;
    let signedWaiverSchools = [];
    let unsignedWaiverSchools = [];

    // Grab teachers
    await ref.child('teachers/').once('value', (snapshot) => {
      schoolNum = 0;
      fullSchoolList = [''];
      teacherList = [];
      attendeeList = {};
      schoolsList = [['', '']];
      schoolCounts = {};

      snapshot.forEach((childSnapshot) => {
        schoolNum += 1;
        var childSchool = childSnapshot.val().school;
        var hasWaiver = childSnapshot.val().waiver || false;

        teacherList.push([
          childSnapshot.val().name,
          childSnapshot.key,
          childSchool,
          childSnapshot.val().email || '',
        ]);
        fullSchoolList.push(childSchool);

        if (!hasWaiver) {
          schoolsList.push([childSchool, childSnapshot.key]);
          waiverFalse += 1;
          unsignedWaiverSchools.push(childSchool);
        } else {
          waiverTrue += 1;
          signedWaiverSchools.push(childSchool)
        }

        const students = childSnapshot.val().students || {};
        Object.entries(students).forEach(([key, val]) => {
          attendeeList[key] = {
            ...val,
            teacher: childSnapshot.key,
            school: childSchool,
          };

          if (val.lunch) {
            lunchCount += 1;
          }

          if (!schoolCounts[childSchool]) {
            schoolCounts[childSchool] = 0;
          }
          schoolCounts[childSchool] += 1;
        });
      });

      this.setState({
        fullSchoolList,
        schoolsList,
        teacherList,
        attendeeList,
        schoolNum,
        waiverSelectedSchool: schoolsList?.[0]?.[1] || '',
        attendeeSelectedTeacher: teacherList?.[0]?.[1] || '',
        lunchCount,
        waiverTrue,
        waiverFalse,
        schoolCounts,
        signedWaiverSchools,
        unsignedWaiverSchools,
      });
    });

    // Grab plenaries
    // ref.child('plenaries').on('value', (snapshot) => {
    //   const p = snapshot.val() || { open: false };
    //   this.setState({ plenOptions: p });
    // });
  }

  generateSchoolOptions() {
    var options = [];
    for (var i = 0; i < this.state.schoolsList.length; i++) {
      options.push(
        <option
          key={this.state.schoolsList[i][1]}
          value={this.state.schoolsList[i][1]}
        >
          {this.state.schoolsList[i][0]}
        </option>
      );
    }
    return options;
  }

  // Returns the capacity for a given location.
  getCapacityForLocation(location) {
    const mapping = {
      "Manucha & Bellamy Studio Theatre": 100,
      "Room 232": 35,
      "Laidlaw Hall": 800,
      "Student Centre": 180,
      "Rooms 248 + 249": 55,
      "Rooms 247 + 249": 55, // in case you use this variant
    };
    return mapping[location] || 100;
  }

  // Generates a progress bar for every plenary option (using its id)
 // Returns the capacity for a given location
getCapacityForLocation(location) {
  const capacityMap = {
    "Manucha & Bellamy Studio Theatre": 100,
    "Room 232": 35,
    "Laidlaw Hall": 800,
    "Student Centre": 180,
    "Rooms 248 + 249": 55,
    "Rooms 247 + 249": 55, // in case this variant is used
  };
  return capacityMap[location] || 100;
}

  // Generates a progress bar for every option (using its ID)
  // It iterates over each plenary group (p1, p2, p3) and each option therein.
  generateAllProgressBars() {
    const { plenOptions, attendeeList } = this.state;
    if (!plenOptions) return null;
    
    const bars = [];
    // Loop through each plenary group (e.g., p1, p2, p3)
    Object.keys(plenOptions).forEach((groupKey) => {
      const group = plenOptions[groupKey];
      if (group && group.options) {
        group.options.forEach((option) => {
          // Look up the plenary details using the option's id
          const detail = this.plenDetails[option.id];
          // If detail is not found, skip this option
          if (!detail) return;
          // Get capacity for the option's location
          const capacity = this.getCapacityForLocation(detail.location);
          // Count how many attendees selected this option in the group (e.g., student['p1'])
          let count = 0;
          Object.values(attendeeList).forEach((student) => {
            if (student[groupKey] === option.id) {
              count++;
            }
          });
          bars.push(
            <Row key={option.id} className="mb-2">
              <Col>
                <h6>
                  {option.name} – {detail.location}
                </h6>
                <Progress value={count} max={capacity} className="mt-1" />
                <span>{` ${count} / ${capacity}`}</span>
              </Col>
            </Row>
          );
        });
      }
    });
    return bars;
  }

  generateTeacherOptions() {
    var options = [];
    for (var i = 0; i < this.state.teacherList.length; i++) {
      options.push(
        <option
          key={this.state.teacherList[i][1]}
          value={this.state.teacherList[i][1]}
        >
          {this.state.teacherList[i][0]}, {this.state.teacherList[i][2]}
        </option>
      );
    }
    return options;
  }

  handleWaiver(event) {
    this.setState({
      waiverSelectedSchool: event.target.value,
    });
  }

  async handleWaiverSubmit(event) {
    var school = this.state.waiverSelectedSchool;
    await ref.child('teachers/' + school).update({
      waiver: true,
    });
  }

  // === Single source of truth for attendeeList ===

  handleInputChange(event, studentId) {
    const { name, value, type, checked } = event.target;
    this.setState((prevState) => ({
      attendeeList: {
        ...prevState.attendeeList,
        [studentId]: {
          ...prevState.attendeeList[studentId],
          [name]: type === 'checkbox' ? checked : value,
        },
      },
    }));
  }

  async handleUpdate(studentId) {
    const updatedStudent = this.state.attendeeList[studentId];
    if (!updatedStudent) return;

    try {
      await ref
        .child(`teachers/${updatedStudent.teacher}/students/${studentId}`)
        .update({ ...updatedStudent });

      alert('Student updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  }

  // === Filter / search logic ===

  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
  }

  handleSchoolSearch(event) {
    this.setState({ searchSchool: event.target.value });
  }

  toggleGradeDropdown() {
    this.setState({ gradeDropdownOpen: !this.state.gradeDropdownOpen });
  }

  togglePlenaryDropdown() {
    this.setState({ plenaryDropdownOpen: !this.state.plenaryDropdownOpen });
  }

  handleGradeFilter(grade) {
    const selectedGrades = [...this.state.selectedGrades];
    const index = selectedGrades.indexOf(grade);
    if (index > -1) {
      selectedGrades.splice(index, 1);
    } else {
      selectedGrades.push(grade);
    }
    this.setState({ selectedGrades });
  }

  handlePlenaryFilter(plenary) {
    const selectedPlenaries = [...this.state.selectedPlenaries];
    const index = selectedPlenaries.indexOf(plenary);
    if (index > -1) {
      selectedPlenaries.splice(index, 1);
    } else {
      selectedPlenaries.push(plenary);
    }
    this.setState({ selectedPlenaries });
  }

  // --------------------------------------------------
  //   RENDER
  // --------------------------------------------------

  render() {
    const {
      attendeeList,
      searchQuery,
      searchSchool,
      selectedGrades,
      selectedPlenaries,
    } = this.state;

    // Filter logic
    const filteredStudents = Object.entries(attendeeList).filter(
      ([, student]) => {
        if (!student) return false;
        const nameMatch = student.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const schoolMatch = student.school
          .toLowerCase()
          .includes(searchSchool.toLowerCase());
        const gradeMatch =
          selectedGrades.length === 0 ||
          selectedGrades.includes(student.grade);
        const plenaryMatch =
          selectedPlenaries.length === 0 ||
          selectedPlenaries.some(
            (p) => student.p1 === p || student.p2 === p || student.p3 === p
          );
        return nameMatch && schoolMatch && gradeMatch && plenaryMatch;
      }
    );

    // Group by school
    const groupedBySchool = {};
    filteredStudents.forEach(([studentId, student]) => {
      const sch = student.school || 'Unknown School';
      if (!groupedBySchool[sch]) {
        groupedBySchool[sch] = [];
      }
      groupedBySchool[sch].push([studentId, student]);
    });

    return (
      <Container>
        {/* 1) MODAL: "Account Actions" (already existed) */}
        <Modal isOpen={this.state.modal[0]} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Account Actions</ModalHeader>
          <ModalBody>Select actions to perform on account</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.resetPassword}>
              Reset Password
            </Button>{' '}
            {/* Instead of calling `deleteAccount` directly, 
                we now open the second confirmation modal. */}
            <Button color="warning" onClick={this.openDeleteConfirmModal}>
              Delete Account
            </Button>{' '}
            <Button color="danger" onClick={this.toggle}>
              Close
            </Button>{' '}
          </ModalFooter>
        </Modal>

        {/* 2) MODAL: "Delete Confirm" (NEW) */}
        <Modal
          isOpen={this.state.deleteConfirmModalOpen}
          toggle={this.closeDeleteConfirmModal}
        >
          <ModalHeader toggle={this.closeDeleteConfirmModal}>
            Confirm Delete
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to <strong>permanently delete</strong> this
              user?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.confirmDeleteAccount}>
              Yes, Delete
            </Button>
            <Button color="secondary" onClick={this.closeDeleteConfirmModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* 3) MODAL: "Add Attendee Confirm" (NEW) */}
        <Modal
          isOpen={this.state.addAttendeeModalOpen}
          toggle={this.toggleAddAttendeeModal}
        >
          <ModalHeader toggle={this.toggleAddAttendeeModal}>
            Confirm New Attendee
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to add:
              <br />
              <strong>Name:</strong> {this.state.newAttendeeDraft.name}
              <br />
              <strong>Email:</strong> {this.state.newAttendeeDraft.email}
              <br />
              <strong>Grade:</strong> {this.state.newAttendeeDraft.grade}
              <br />
              <strong>Supervisor:</strong> {this.state.newAttendeeDraft.access}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.confirmAddAttendee}>
              Confirm
            </Button>
            <Button color="secondary" onClick={this.toggleAddAttendeeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Title Row */}
        <br />
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h text-white">Admin Dashboard</h1>
          </Col>
          <Col md="2" sm="12" xs="12">
            <Link className="btn btn-secondary float-right mb-2" to="/dashboard">
              Return
            </Link>
          </Col>
        </Row>
        
        {/* Export Button */}
        <Row className="mb-3">
          <Col>
            <Button color="info" onClick={this.exportData}>
              {this.state.exportButtonStatus}
            </Button>
          </Col>
        </Row>

        {/* UCC Batch Reg Button*/}

        <div>
          <h2 className="text-white">Batch Register</h2>
          <p className="text-white">
            Please ensure your CSV file is formatted with a header row containing the following columns:
            <br />
            <strong>First name, Last name, email, grade, access</strong>
            <br />
            Each subsequent row should provide the corresponding values for each attendee.
            <br />
            All students will be added to the school corresponding to their access code.
          </p>
          <input type="file" accept=".csv" onChange={this.handleBatchRegister} />
        </div>

        <br></br>


        {/* Conference Statistics */}
        <Row className="mt-3">
          <Card body className="inner-container">
            <CardTitle tag="h3" className="text-white">
              Conference Statistics
            </CardTitle>
            <CardText>
              <h5>Schools: {this.state.schoolNum}</h5>
              <h5>
                Attendees: {Object.keys(this.state.attendeeList).length}
              </h5>
              <h5>Lunch Orders: {this.state.lunchCount}</h5>
              <h5>
                Waivers Signed: {this.state.waiverTrue}{' '}
                <Dropdown
                  isOpen={this.state.signedWaiverDropdownOpen}
                  toggle={this.toggleSignedWaiverDropdown}
                >
                  <DropdownToggle caret color="success" size="sm">
                    View Schools
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.signedWaiverSchools.length > 0 ? (
                      this.state.signedWaiverSchools.map((school, index) => (
                        <DropdownItem key={index}>{school}</DropdownItem>
                      ))
                    ) : (
                      <DropdownItem disabled>No schools</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </h5>

              <h5>
                Waivers Pending: {this.state.waiverFalse}{' '}
                <Dropdown
                  isOpen={this.state.unsignedWaiverDropdownOpen}
                  toggle={this.toggleUnsignedWaiverDropdown}
                >
                  <DropdownToggle caret color="warning" size="sm">
                    View Schools
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.unsignedWaiverSchools.length > 0 ? (
                      this.state.unsignedWaiverSchools.map((school, index) => (
                        <DropdownItem key={index}>{school}</DropdownItem>
                      ))
                    ) : (
                      <DropdownItem disabled>No schools</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </h5>

              <hr />
              {this.state.plenOptions.open ? (
                <div>
                  <h2>
                    <Badge color="success">Open</Badge>
                  </h2>
                </div>
              ) : (
                <div>
                  <h2>
                    <Badge color="danger">Closed</Badge>
                  </h2>
                </div>
              )}
              <hr />
              <Row className="mt-3">
                <Col>
                  <h4 className="text-white">Plenary Option Assignments</h4>
                  {/* {this.generateAllProgressBars()} */}
                </Col>
              </Row>
            </CardText>
          </Card>
        </Row>

        <br />
        <hr />

        {/* Waiver Status Update */}
        <h2 className="text-white">Update Waiver Status:</h2>
        <Form>
          <FormGroup>
            <h5 className="text-white">School:</h5>
            <Row>
              <Col md="10" sm="12" xs="12" className="mt-2">
                <Input
                  type="select"
                  name="school"
                  className="form-control inner-container input-border-grey"
                  id="school"
                  onChange={this.handleWaiver}
                >
                  {this.generateSchoolOptions()}
                </Input>
              </Col>
              <Col md="2" sm="12" xs="12" className="mt-2">
                <Input
                  type="button"
                  className="btn-primary float-right"
                  value="Confirm!"
                  onClick={this.handleWaiverSubmit}
                ></Input>
              </Col>
            </Row>
          </FormGroup>
        </Form>

        <hr />
        <br />

        {/* Add Attendee */}
        <h2 className="text-white">Add Attendee:</h2>
        {/* 
            Instead of calling handleAddAttendee directly,
            we open the "confirm add" modal first.
        */}
        <Form onSubmit={this.handleOpenAddAttendeeModal}>
          <Label className="text-white">Name:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="text"
            name="name"
            id="name"
            required
          />
          <Label className="text-white">Email:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="email"
            name="email"
            id="email"
            required
          />
          <Label className="text-white">Grade:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="select"
            name="grade"
            id="grade"
          >
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="other">Other</option>
          </Input>
          <Label className="text-white">Supervisor:</Label>
          <Input
            className="form-control inner-container input-border-grey"
            type="select"
            name="access"
            id="access"
          >
            {this.generateTeacherOptions()}
          </Input>
          <Input
            type="submit"
            className="btn btn-primary mt-2"
            value="Add Attendee!"
          />
        </Form>

        <hr />
        <br />

        {/* All Attendees */}
        <h2 className="text-white">All Attendees</h2>
        <br />

        <Row className="mb-4">
          <Col md="3" sm="5" xs="10">
            <Input
              className="form-control inner-container input-border-grey"
              type="text"
              placeholder="Search by name"
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
          </Col>
          <Col md="3" sm="5" xs="12">
            <Input
              className="form-control inner-container input-border-grey"
              type="text"
              placeholder="Search by school"
              value={this.state.searchSchool}
              onChange={this.handleSchoolSearch}
            />
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md="9" sm="7" xs="12" className="d-flex align-items-center">
            <Label className="mr-2 mb-0 text-white">Filters:</Label>
            <Dropdown
              isOpen={this.state.gradeDropdownOpen}
              toggle={this.toggleGradeDropdown}
              className="mr-2"
            >
              <DropdownToggle caret>Grade</DropdownToggle>
              <DropdownMenu style={{ minWidth: '190px' }}>
                {['7', '8', '9', '10', '11', '12', 'other'].map((grade) => (
                  <div
                    key={grade}
                    className="px-5 py-1 d-flex align-items-center"
                  >
                    <Input
                      type="checkbox"
                      checked={this.state.selectedGrades.includes(grade)}
                      onChange={() => this.handleGradeFilter(grade)}
                      className="mr-2"
                    />
                    <span>Grade {grade}</span>
                  </div>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown
              isOpen={this.state.plenaryDropdownOpen}
              toggle={this.togglePlenaryDropdown}
            >
              <DropdownToggle caret>Plenary</DropdownToggle>
              <DropdownMenu style={{ minWidth: '500px', columns: '2' }}>
                {Object.entries(this.state.plenOptions)
                  .filter(([key, val]) => key.startsWith('p') && val.name)
                  .map(([key, val]) => (
                    <div
                      key={key}
                      className="px-5 py-1 d-flex align-items-top"
                      style={{ breakInside: 'avoid' }}
                    >
                      <Input
                        type="checkbox"
                        checked={this.state.selectedPlenaries.includes(key)}
                        onChange={() => this.handlePlenaryFilter(key)}
                        className="mr-2"
                      />
                      <span style={{ whiteSpace: 'normal' }}>{val.name}</span>
                    </div>
                  ))}
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>

        {(this.state.selectedGrades.length > 0 ||
          this.state.selectedPlenaries.length > 0) && (
          <Row className="mb-3">
            <Col>
              <h5 className="text-white">Active Filters:</h5>
              {this.state.selectedGrades.map((grade) => (
                <Badge key={grade} color="info" className="mr-2 p-2">
                  Grade {grade}
                  <span
                    className="ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleGradeFilter(grade)}
                  >
                    ×
                  </span>
                </Badge>
              ))}
              {this.state.selectedPlenaries.map((plenary) => (
                <Badge key={plenary} color="info" className="mr-2 p-2">
                  {this.state.plenOptions[plenary].name}
                  <span
                    className="ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handlePlenaryFilter(plenary)}
                  >
                    ×
                  </span>
                </Badge>
              ))}
            </Col>
          </Row>
        )}

        <div id="table">
          <Table className="table">
            <thead className="text-white">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Lunch</th>
                <th>Plenary #1</th>
                <th>Plenary #2</th>
                <th>Plenary #3</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedBySchool).length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-white">
                    No attendees found.
                  </td>
                </tr>
              ) : (
                Object.entries(groupedBySchool).map(([school, students]) => (
                  <React.Fragment key={school}>
                    <tr>
                      <th
                        colSpan="8"
                        style={{
                          textAlign: 'center',
                          fontSize: '18px',
                          backgroundColor: '#222',
                          color: 'white',
                        }}
                      >
                        {school} ({students.length} students)
                      </th>
                    </tr>
                    {students.map(([studentId, student]) => (
                      <tr key={studentId}>
                        <td>
                          <Input
                            type="text"
                            name="name"
                            value={student.name || ''}
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          />
                        </td>
                        <td>
                          <a
                            className="passwdresetclick"
                            style={{ cursor: 'pointer', color: '#0dcaf0' }}
                            onClick={() => {
                              this.toggle(
                                student.email,
                                student.teacher,
                                studentId
                              );
                            }}
                          >
                            {student.email}
                          </a>
                        </td>
                        <td>
                          <Input
                            type="checkbox"
                            name="lunch"
                            checked={!!student.lunch}
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          />
                        </td>
                        <td>
                          <Input
                            type="select"
                            name="plen1"
                            value={student.plen1 || 'None'}
                            className="form-control"
                            onChange={(event) => this.handleInputChange(event, studentId)}
                          >
                            <option value="None">None</option>
                            {this.generateOptions('p1')}
                          </Input>

                        </td>
                        <td>
                          <Input
                            type="select"
                            name="plen2"
                            value={student.plen2 || 'None'}
                            className="form-control"
                            onChange={(event) => this.handleInputChange(event, studentId)}
                          >
                            <option value="None">None</option>
                            {this.generateOptions('p2')}
                          </Input>
                        </td>
                        <td>
                          <Input
                            type="select"
                            name="plen3"
                            value={student.plen3 || 'None'}
                            className="form-control"
                            onChange={(event) => this.handleInputChange(event, studentId)}
                          >
                            <option value="None">None</option>
                            {this.generateOptions('p3')}
                          </Input>
                        </td>
                        <td>
                          <Input
                            type="textarea"
                            name="note"
                            value={student.note || ''}
                            onChange={(event) =>
                              this.handleInputChange(event, studentId)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                            }}
                            onClick={() => this.handleUpdate(studentId)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <div>
          <br />
          <hr />
          <h2 className="text-white">School List:</h2>
          {this.state.fullSchoolList.map((school, index) => {
            return (
              <p className="text-white" key={index}>
                {school}
              </p>
            );
          })}
        </div>
      </Container>
    );
  }
}
