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
  Input,
  Label,
  FormGroup,
  Card,
  Form,
  CardFooter,
} from 'reactstrap';
import { ref } from '../../helpers/firebase';
import queryString from 'query-string';

export default class MySchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plenOptions: {
        open: false,
        p1: { name: '', students: {}, max: 0, location: '' },
        p2: { name: '', students: {}, max: 0, location: '' },
        p3: { name: '', students: {}, max: 0, location: '' },
        p4: { name: '', students: {}, max: 0, location: '' },
        p5: { name: '', students: {}, max: 0, location: '' },
        p6: { name: '', students: {}, max: 0, location: '' },
        p7: { name: '', students: {}, max: 0, location: '' },
        p8: { name: '', students: {}, max: 0, location: '' },
        p9: { name: '', students: {}, max: 0, location: '' },
      },
      uid: '',
      rows: [],
    };
  }
  componentDidMount() {
    ref.child('plenaries').once('value', (snapshot) => {
      this.setState({ plenOptions: snapshot.val() });
    });
    const params = queryString.parse(this.props.location.search);
    if (params.uid) {
      this.setState({ uid: params.uid });
    }
    this.generateRows(params.uid);
  }

  generateRows(uid) {
    let data = uid;
    let rows = [];
    //get teacher id
    ref
      .child(`students/${data}`)
      .once('value', (snapshot) => {
        const teacher = snapshot.val().teacherID;
        // Get teachers/${user.uid}/students
        ref
          .child(`teachers/${teacher}/students/${data}`)
          .once('value', (snapshot) => {
            const data = snapshot.val();
            if (data.p1) {
              rows.push(
                <tr>
                  <th scope="row">10:40-11:20</th>
                  <td>{this.state.plenOptions[data.p1].name}</td>
                  <td>{this.state.plenOptions[data.p1].location}</td>
                </tr>
              );
            }
            if (data.p2) {
              rows.push(
                <tr>
                  <th scope="row">11:35-12:15</th>
                  <td>{this.state.plenOptions[data.p2].name}</td>
                  <td>{this.state.plenOptions[data.p2].location}</td>
                </tr>
              );
            }
            if (data.p3) {
              rows.push(
                <tr>
                  <th scope="row">13:35-14:15</th>
                  <td>{this.state.plenOptions[data.p3].name}</td>
                  <td>{this.state.plenOptions[data.p3].location}</td>
                </tr>
              );
            }
          });
      })
      .then(() => {
        this.setState({ rows: rows });
      });
  }

  render() {
    return (
      <Container>
        <Row className="mt-3">
          <Col md="8" sm="12" xs="12">
            <h1 className="fonted-h">Personal Plenary Schedule</h1>
          </Col>
        </Row>
        <div className="center-div">
          <Table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>{this.state.rows}</tbody>
          </Table>
        </div>
      </Container>
    );
  }
}
