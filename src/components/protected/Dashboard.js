import React, { Component } from 'react'
import { Button, Badge, Table, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { StudentRow } from  './StudentRow'
import firebase from 'firebase'
import AddStudent from './AddStudent'
import { Plenaries, Year, EarlyBirdDueDate, DueDate, Links } from "../../config/config.json"
import { deleteUserData, deleteAccount } from '../../helpers/auth'


export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    var userId = firebase.auth().currentUser.uid;
    var myStudentDataKey = [];
    var myStudentDataArr = [];

    firebase.database().ref('users/' + userId + '/students/').on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        myStudentDataKey.push(childKey);
        var childData = childSnapshot.val();
        myStudentDataArr.push(childData);
      });
    });

    this.toggleModal = this.toggleModal.bind(this)
		this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this)

    this.state = {
      payment: null,
      myStudentDataKey: myStudentDataKey,
      myStudentDataArr: myStudentDataArr,
      modal: false
    }

    // console.log(this.state.myStudentDataKey);
    // console.log(this.state.myStudentDataArr);

    firebase.database().ref('users/' + userId + '/info/').once('value', (snapshot) => this.setState({
      payment: snapshot.val().payment,
    }));
  }
  toggleModal() {
		this.setState({
			modal: !this.state.modal
		})
	}

	proceedDeleteAccount() {
		deleteUserData();
		deleteAccount();
	}

  render () {
    return (
      <Container>
        <br/>
        <Row>
          <Col md="10" sm="12" xs="12">
            <h1 className="fonted-h">Teacher Dashboard</h1>
          </Col>
          <Col md="2" sm="12" xs="12">
            <Button color="danger" className="fonted" onClick={this.toggleModal}>Delete Account</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggleModal} className="modal-dialog">
              <ModalHeader toggle={this.toggleModal}>Delete Account</ModalHeader>
              <ModalBody>
                Your information and registered students will be deleted from our database. Do you want to proceed?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.proceedDeleteAccount}>Delete</Button>{' '}
                <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
    		<br/>
        {this.state.payment
          ? <div>
              <h2>Payment Status: <br /><Badge color="success">Received</Badge></h2>
            </div>
          : <div>
              <h2>Payment Status: <br /><Badge color="danger">Not Received</Badge></h2>
            </div>
        }
        <hr />
        <h3>Payment Instructions:</h3>
        <p>The ticket prices for the World Affairs Conference {Year} is $45 per student before {EarlyBirdDueDate}, and $50 per student after {EarlyBirdDueDate}. <b>Registration is due by {DueDate}.</b>
        </p>
        <p>
        Financial aid is available upon request - please <a href={Links['email']}>email us at wac@ucc.on.ca</a> for more information.
        </p>
        <p>Please send a cheque to Mr. Gregory McDonald, Upper Canada College, 200 Lonsdale Rd, Toronto, ON M4V 1W6 by the respective registration due dates along with your online registration.
        </p>
        <p>
        <a href={Links['contact']}>Contact us</a> if you have any questions.
        </p>
        <hr />
        <br />
    		<h2>My Students</h2>
        <p>If you need to register more than 50 students, please <a href={Links['contact']}>contact us</a> directly.</p>
        <AddStudent />
        <br />
        <div id="table">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>{Plenaries[0]}</th>
              <th>{Plenaries[1]}</th>
              <th>{Plenaries[2]}</th>
              <th>{Plenaries[3]}</th>
              <th>{Plenaries[4]}</th>
              <th>{Plenaries[5]}</th>
              <th>Accessibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <StudentRow studentData={this.state.myStudentDataArr} studentKey={this.state.myStudentDataKey} />
        </Table>
        </div>
        <br/><br/><br/><br/><br/>
      </Container>

    )
  }
}
