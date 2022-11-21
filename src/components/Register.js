import React, { Component } from 'react';
import queryString from 'query-string';
import { auth } from '../helpers/auth';
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
          <ModalHeader toggle={this.toggle}>
            What is an Access Code?
          </ModalHeader>
          <ModalBody>
            The access code is our way of ensuring all in-person attendees are
            associated with an organization. <br />
            If you are interested in attending in-person, please reach out to
            us. If you would like to register as a virtual delegate, please use
            this{' '}
            <a href="https://hopin.com/events/world-affairs-conference-2023-hybrid-thinking">
              link
            </a>
            . <br />
            If you are a teacher and would like to bring your school, please
            fill out this{' '}
            <a href="https://coda.io/form/WAC-Interest-Form_dHaDOjXdHJT">
              form
            </a>
            . <br />
            If you are associated with Upper Canada College, Branksome Hall or
            the World Affairs Conference and would like a special invite, please
            complete this{' '}
            <a href="https://coda.io/form/Access-Code-Request_ddUfef9uoEU">
              form
            </a>
            .
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggle}>
              Close
            </Button>{' '}
          </ModalFooter>
        </Modal>
        <br />
        <h1>Register</h1>
        <p>{}</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              ref={(name) => (this.name = name)}
            />
          </div>
          <div className="form-group">
            <label>Access Code </label>
            <span onClick={this.toggle} className="ml-1">
              <i className="fa fa-info-circle"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Access Code"
              ref={(access) => (this.access = access)}
              disabled={this.state.qs}
            />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <select
              className="form-control"
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
            <label>Email</label>
            <input
              className="form-control"
              ref={(email) => (this.email = email)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              ref={(pw) => (this.pw = pw)}
            />
          </div>

          {this.state.registerError && (
            <div className="alert alert-danger" role="alert">
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <br />
        <p>
          If you're already registered, <a href="/login">log in</a>.<br /> For
          students attending online, please register using this{' '}
          <a href="https://hopin.com/events/world-affairs-conference-2023-hybrid-thinking">
            link{' '}
          </a>
          .
        </p>
        <p>
          <a href="https://worldaffairscon.org/contact">Contact us</a> for more
          information
        </p>
      </div>
    );
  }
}
