import React, { Component } from 'react';
import queryString from 'query-string';
import { auth } from '../helpers/auth';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function setErrorMsg(error) {
  return {
    registerError: error.message,
  };
}

export default class Register extends Component {
  state = { registerError: null, qs: false, modal: false };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  handleNameChange = (event) => {
    const fullName = event.target.value.trim();
    const isValid = fullName.split(" ").length >= 2;

    this.setState({
      registerError: isValid ? null : (
        <>
          Please enter your full name (first and last name). <br />
          If you are entering your full name and this message shows, <br />
          please email <strong>uccwac@gmail.com</strong> with a screenshot.
        </>
      ),
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.access.value) {
      this.setState({
        registerError:
          'No access code provided. Please contact us for more information.',
      });
      return;
    }
    auth(
      this.email.value,
      this.pw.value,
      this.name.value,
      this.grade.value,
      this.access.value
    ).catch((e) => this.setState(setErrorMsg(e)));
  };

  componentDidMount() {
    const params = queryString.parse(this.props.location.search);
    if (params.access) {
      this.access.value = params.access;
      this.setState({ qs: true });
    }
  }

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} className="inner-container">
            What is an Access Code?
          </ModalHeader>
          <ModalBody className="text-white inner-container">
            The access code is our way of ensuring all in-person attendees are associated with an organization. <br />
            If you are a teacher and would like to bring your school, please fill out this{' '}
            <a href="https://reg.worldaffairscon.org/tregister" target="_blank" rel="noopener noreferrer">
              form
            </a>
            . <br />
            If you are associated with Upper Canada College, Branksome Hall, or the World Affairs Conference and would like a special invite, 
            please check your email and/or contact the team at uccwac@gmail.com.
          </ModalBody>
          <ModalFooter className="inner-container">
            <Button className="text-white" color="danger" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <br />
        <h1 className="text-white">Student Register</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="text-white">Full Name</label>
            <input
              type="text"
              className="form-control inner-container input-border-grey"
              placeholder="Full Name"
              ref={(name) => (this.name = name)}
              onChange={this.handleNameChange}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Access Code</label>
            <span onClick={this.toggle} className="ml-1 text-info" style={{ cursor: 'pointer' }}>
              <i className="fa fa-info-circle"></i>
            </span>
            <input
              type="text"
              className="form-control inner-container input-border-grey"
              placeholder="Access Code"
              ref={(access) => (this.access = access)}
              disabled={this.state.qs}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Grade</label>
            <select
              className="form-control inner-container input-border-grey"
              ref={(grade) => (this.grade = grade)}
            >
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="text-white">Email</label>
            <input
              className="form-control inner-container input-border-grey"
              placeholder="Email"
              ref={(email) => (this.email = email)}
            />
          </div>
          <div className="form-group">
            <label className="text-white">Password</label>
            <input
              type="password"
              className="form-control inner-container input-border-grey"
              placeholder="Password"
              ref={(pw) => (this.pw = pw)}
            />
          </div>
          <br />
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/login" className="text-primary">
                  Already registered? Log in
                </Link>
              </div>
            </div>
          </div>
          {this.state.registerError && (
            <div className="alert alert-danger" role="alert">
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          )}
        </form>
        <br />
        <br />
        <br />
      </div>
    );
  }
}
