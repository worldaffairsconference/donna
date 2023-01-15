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

export default class QRReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      plen: null,
      name: 'Scan QR',
      status: '',
      plenaries: {
        p1: { name: '', students: {}, max: 0 },
        p2: { name: '', students: {}, max: 0 },
        p3: { name: '', students: {}, max: 0 },
        p4: { name: '', students: {}, max: 0 },
        p5: { name: '', students: {}, max: 0 },
        p6: { name: '', students: {}, max: 0 },
        p7: { name: '', students: {}, max: 0 },
        p8: { name: '', students: {}, max: 0 },
        p9: { name: '', students: {}, max: 0 },
      },
    };
  }

  handleResult = () => {
    const { plen, data } = this.state;
    console.log(plen, data);
    if (plen == null || plen == 'no') {
      this.setState({ data: null });
      return;
    }

    //get teacher id
    ref.child(`students/${data}`).once('value', (snapshot) => {
      const teacher = snapshot.val().teacherID;
      // Get teachers/${user.uid}/students
      ref
        .child(`teachers/${teacher}/students/${data}`)
        .once('value', (snapshot) => {
          this.setState({ name: snapshot.val().name });

          // record attendance to selected plenary
          ref.child(`plenaries/p${plen}/attendance/${data}`).set({
            uid: data,
            name: snapshot.val().name,
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
          <Col md="8" sm="12" xs="12">
            <h1 className="fonted-h">QR Code Scanner</h1>
          </Col>
          <Col md="4" sm="12" xs="12">
            <Link
              className="btn btn-secondary float-right mb-2"
              to="/dashboard"
            >
              Return to Dashboard
            </Link>
          </Col>
        </Row>
        <h5>Select Plenary</h5>
        <div className="mt-3 mb-3">
          <select
            className="form-control"
            onChange={(e) => this.setState({ plen: e.target.value })}
          >
            <option value="no">None Selected</option>
            <option value="1">{this.state.plenaries.p1.name}</option>
            <option value="2">{this.state.plenaries.p2.name}</option>
            <option value="3">{this.state.plenaries.p3.name}</option>
            <option value="4">{this.state.plenaries.p4.name}</option>
            <option value="5">{this.state.plenaries.p5.name}</option>
            <option value="6">{this.state.plenaries.p6.name}</option>
            <option value="7">{this.state.plenaries.p7.name}</option>
            <option value="8">{this.state.plenaries.p8.name}</option>
            <option value="9">{this.state.plenaries.p9.name}</option>
          </select>
        </div>
        <>
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
        </>
        <div className="mt-3 display-iblock">
          <h1>{this.state.name}</h1>
        </div>
      </Container>
    );
  }
}
