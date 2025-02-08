import React, { Component } from 'react';
import { login } from '../helpers/auth';
import { Link } from 'react-router-dom'; 

function setErrorMsg(error) {
  return {
    loginMessage: error,
  };
}

export default class Login extends Component {
  state = { loginMessage: null };

  handleSubmit = (e) => {
    e.preventDefault();
    login(this.email.value, this.pw.value).catch(() => {
      this.setState(setErrorMsg('Invalid username/password.'));
    });
  };

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <br />
        <h1 className="text-white">Login</h1>
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="text-white">Email</label>
            <input
              className="form-control inner-container input-border-grey"
              ref={(email) => (this.email = email)}
              placeholder="Email"
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
          < br />
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6">
                <button className="btn btn-primary">Login</button>
              </div>
              <div className="col-sm-6 text-right">
                <Link to="/forgot-password" className="text-primary">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          {this.state.loginMessage && (
            <div className="alert alert-danger" role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              ></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage}
            </div>
          )}
        </form>

        <p className="text-white">
          Don't have an account? Register <a href="/register">here!</a>.
        </p>

      </div>
    );
  }
}

