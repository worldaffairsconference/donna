import React, { Component } from 'react';
import { login, resetPassword } from '../helpers/auth';

function setErrorMsg(error) {
  return {
    loginMessage: error,
  };
}

export default class Login extends Component {
  state = { loginMessage: null };
  handleSubmit = (e) => {
    e.preventDefault();
    login(this.email.value, this.pw.value).catch((error) => {
      this.setState(setErrorMsg('Invalid username/password.'));
    });
  };
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() =>
        this.setState(
          setErrorMsg(`Password reset email sent to ${this.email.value}.`)
        )
      )
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)));
  };
  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <br />
        <h1 class="text-white"> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label class="text-white">Email</label>
            <input
              className="form-control"
              ref={(email) => (this.email = email)}
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <label class="text-white">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              ref={(pw) => (this.pw = pw)}
            />
          </div>
          {this.state.loginMessage && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage}{' '}
              <a href="#" onClick={this.resetPassword} className="alert-link" class="text-white">
                Forgot Password?
              </a>
            </div>
          )}
          {/* <Button onClick="submit" color="primary">Login</Button>{' '} */}
          <button className="btn btn-primary">Login</button>
        </form>
        <br />
        <p class="text-white">
          If you're not registered, register <a href="/register">here</a>.
        </p>
      </div>
    );
  }
}
