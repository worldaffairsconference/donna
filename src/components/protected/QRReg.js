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
      name: '',
      status: false,
    };
  }

  handleResult = () => {
    const { plen, data } = this.state;
    console.log(plen, data);
    if (plen == null || plen == "no") {
      this.setState({ data: null });
      return;
    }

    //get teacher id
    ref.child(`students/${data}`).once('value', (snapshot) => {
      const teacher = snapshot.val().teacherID;
      var teacher_name;
      // Get teachers/${user.uid}/students
      ref
        .child(`teachers/${teacher}/students/${data}`)
        .once('value', (snapshot) => {
          this.setState({ name: snapshot.val().name, status: true });

          // record attendance to selected plenary
          ref.child(`plenaries/p${plen}/attendance/${data}`).set({
            uid: data,
            name: snapshot.val().name,
          });
        });
    });
    setTimeout(() => {
      this.setState({ status: false });
    }, 1400);
  };

  render() {
    return (
      <Container>
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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>
        <>
          <QrReader
            className="qr-reader"
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
          {this.state.status && (
            <Checkmark
              size="45px"
              color={this.state.status ? 'green' : 'red'}
            />
          )}

          <h1>{this.state.name}</h1>
        </div>
      </Container>
    );
  }
}
