import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
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
      ucc_students: [],
    };
  }

  mapping = {
    'Philip Roberts': 1,
    'Erann Zlotnik': 2,
    'Patrice Callegaro': 3,
    'Bina Evans': 4,
    'Zulay Rodriguez': 5,
    'Ben Tan': 6,
    'Maryam Pashali': 7,
    'Paul Miskew': 8,
    'Andrew McCubbin': 9,
    'Brendon Allen': 10,
    'Calvin Yu': 11,
    'Colleen Ferguson': 12,
    'Catherine McRoy-Mendell': 13,
    'Sophia Berezowsky': 14,
    'Gregory McDonald': 15,
    'Felipe Nilo': 16,
    'Tony Gomes': 17,
    'Huw Tranter': 18,
    'Joseph Bush': 19,
    'Terence Dick': 20,
    'John Sweetman': 21,
    'Chris Cigolea': 22,
    'Keiran Higgins/Joe Smith': 23,
    'Oumarou Niagate': 24,
    'Josh Rapps': 25,
    'Ian Cole': 26,
    'Suzanne Monir': 27,
    'Mari Roughneen': 28,
    'Christin Mohammed-King': 29,
    'Anthony De Giorgio': 30,
    'Jordan Small': 31,
    'Andrew Turner': 32,
    'Mario Sturino': 33,
    'Spice Maybee': 34,
    'David Holt': 35,
    'Edward Moon': 36,
    'Chandra Boon': 37,
    'Melanie Snow': 38,
  };

  componentDidMount() {
    ref
      .child('teachers/THOZYirJHLYj9UXKnypCs9vbeTw1/students')
      .once('value', (snapshot) => {
        const students = snapshot.val();
        this.setState({ ucc_students: students });
      });
  }

  handleResult = () => {
    const { data } = this.state;
    //get teacher id
    try {
      this.setState({
        name: this.mapping[this.state.ucc_students[data].ucc_advisor],
      });
      this.setState({ status: 'slide-up-2 checkmarkready' });
      setTimeout(() => {
        this.setState({ status: '' });
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Container>
        <div className={'full-screen-container-2 ' + this.state.status}></div>
        <br />
        <Row>
          <Col md="8" sm="12" xs="12">
            <h1 className="fonted-h">Volunteer Tools</h1>
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
