import React, { Component } from 'react';
import { tauth } from '../helpers/auth';
import { Link } from 'react-router-dom';

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
        <h1 class="text-white">Teacher Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label class="text-white">Name</label>
            <input
              type="text"
              className="form-control inner-container input-border-grey"
              placeholder="Name"
              ref={(name) => (this.name = name)}
            />
          </div>
          <div className="form-group">
            <label class="text-white">School</label>
            <input
              type="text"
              className="form-control inner-container input-border-grey"
              placeholder="School"
              ref={(school) => (this.school = school)}
            />
          </div>
          <div className="form-group">
            <label class="text-white">Cell Phone Number</label>
            <input
              type="text"
              className="form-control inner-container input-border-grey"
              placeholder="Cell Phone Number"
              ref={(cnumber) => (this.cnumber = cnumber)}
            />
          </div>
          <div className="form-group">
            <label class="text-white">Email</label>
            <input
              className="form-control inner-container input-border-grey"
              ref={(email) => (this.email = email)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label class="text-white">Password</label>
            <input
              type="password"
              className="form-control inner-container input-border-grey"
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

          <br />
          
          <div className="row">
            <div className="col-sm-6">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
            <div className="col-sm-6 text-right">
              <p class="text-white">
                <Link to="/login" className="text-primary">
                  Already registered? Log in
                </Link>
              </p>
            </div>
          </div>
        </form>
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}


