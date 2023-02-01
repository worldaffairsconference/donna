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
      name: 'Scan QR',
      status: '',
    };
  }

  handleResult = () => {
    const { data } = this.state;
    //get teacher id
    try {
      ref.child(`students/${data}`).once('value', (snapshot) => {
        const teacher = snapshot.val().teacherID;
        // Get teachers/${user.uid}/students
        ref
          .child(`teachers/${teacher}/students/${data}`)
          .once('value', (snapshot) => {
            this.setState({ name: snapshot.val().name });

            // record attendance to selected plenary
            ref.child(`attendance/${data}`).set({
              name: snapshot.val().name,
            });
          });
      });
      this.setState({ status: 'slide-up checkmarkready' });
      setTimeout(() => {
        this.setState({ status: '' });
      }, 1600);
    } catch (e) {
      console.log(e);
    }
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
        {/*        <h5>Select Plenary</h5>
        <div className="mt-3 mb-3">
          <select
            className="form-control"
            onChange={(e) => this.setState({ plen: e.target.value })}
          >
            <option value="no">None Selected</option>
            {this.generateOptions()}
          </select>
        </div>
				*/}
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
