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
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { ref } from '../../helpers/firebase';
import { QrReader } from 'react-qr-reader';
import { Checkmark } from 'react-checkmark';

export default class LunchReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      name: 'Scan QR',
      status: '',
    };
  }
  handleResult = () => {
    const { data } = this.state;
    //get teacher id
    ref.child(`students/${data}`).once('value', (snapshot) => {
      if (!snapshot.exists()) {
        ref.child(`lunch/${data}`).set({
          faculty: true,
          teacher: data,
        });
        this.setState({ name: 'Faculty Advisor' });
        return;
      }

      const teacher = snapshot.val().teacherID;
      // Get teachers/${user.uid}/students
      ref
        .child(`teachers/${teacher}/students/${data}`)
        .once('value', (snapshot) => {
          this.setState({ name: snapshot.val().name });
          // record attendance to selected plenary
          ref.child(`lunch/${data}`).set({
            uccid: snapshot.val().uccid ? snapshot.val().uccid : false,
            name: snapshot.val().name,
            teacher: teacher,
          });
        });
    });
    this.setState({ status: 'slide-up checkmarkready' });
    setTimeout(() => {
      this.setState({ status: '' });
    }, 1600);
  };

  componentDidMount() {
    ref.child('plenaries/').once('value', (snapshot) => {
      this.setState({ plenaries: snapshot.val() });
    });
  }

  render() {
    return (
      <Container>
        <div id="checkmark-container">
          {this.state.status == 'slide-up checkmarkready' && (
            <Checkmark color="green" />
          )}
        </div>
        <div className={'full-screen-container ' + this.state.status}></div>
        <br />
        <Row>
          <Col md="12" sm="12" xs="12">
            <h1 className="fonted-h">WAC Lunch Kiosk</h1>
          </Col>
        </Row>
        <div clasName="qr-container">
          <QrReader
            className="qr-reader"
            constraints={{
              facingMode: 'environment',
            }}
            onResult={(result, error) => {
              if (!!result) {
                if (result?.text != this.state.data) {
                  this.setState({ data: result?.text });
                  this.handleResult();
                }
              }

              if (!!error) {
                console.info(error);
              }
            }}
            style={{ width: '100%' }}
          />
        </div>
        <div className="mt-3 display-iblock">
          <h1>{this.state.name}</h1>
        </div>
      </Container>
    );
  }
}
