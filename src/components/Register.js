import React, { Component } from 'react';
import queryString from 'query-string';
import { auth } from '../helpers/auth';

function setErrorMsg(error) {
  return {
    registerError: error.message,
  };
}

export default class Register extends Component {
  state = { registerError: null, qs: false };
  handleSubmit = (e) => {
    e.preventDefault();
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
            <label>Access Code</label>
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
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              ></span>
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
      </div>
    );
  }
}
