import React, { Component } from 'react';
import { tauth } from '../helpers/auth';

function setErrorMsg(error) {
  return {
    tregisterError: error.message,
  };
}

export default class TRegister extends Component {
  state = { tregisterError: null };
  handleSubmit = (e) => {
    e.preventDefault();
    tauth(
      this.email.value,
      this.school.value,
      this.cnumber.value,
      this.pw.value,
      this.name.value,
    ).catch((e) => this.setState(setErrorMsg(e)));
  };
  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <br />
        <h1>Teacher Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              ref={(name) => (this.name = name)}
            />
          </div>
          <div className="form-group">
            <label>School</label>
            <input
              type="text"
              className="form-control"
              placeholder="School"
              ref={(school) => (this.school = school)}
            />
          </div>
          <div className="form-group">
            <label>Cell Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Cell Phone Number"
              ref={(cnumber) => (this.cnumber = cnumber)}
            />
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

          {this.state.tregisterError && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.tregisterError}
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <br />
        <p>
          If you're already registered, <a href="/login">log in</a>.
        </p>
      </div>
    );
  }
}
