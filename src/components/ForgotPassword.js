import React, { Component } from 'react';
import { resetPassword } from '../helpers/auth';
import { Link, Redirect } from 'react-router-dom';

export default class ForgotPassword extends Component {
  state = { resetSuccess: false, resetMessage: null, messageType: null };

  handleReset = (e) => {
    e.preventDefault();
    resetPassword(this.email.value)
      .then(() => {
        this.setState({ resetSuccess: true }); // Redirect to success page
      })
      .catch(() => {
        this.setState({
          resetMessage: `Email address not found.`,
          messageType: 'error',
        });
        setTimeout(() => this.setState({ resetMessage: null, messageType: null }), 2000);
      });
  };

  render() {
    if (this.state.resetSuccess) {
      return <Redirect to="/success" />; // Redirect user to the success page
    }

    return (
      <div className="col-sm-6 col-sm-offset-3">
        <br />
        <h1 className="text-white">Reset Password</h1>
        < br />
        <p className="text-white"><strong>Enter your email below to receive password reset instructions in your inbox.</strong></p>
        <form onSubmit={this.handleReset}>
          <div className="form-group">
            <label className="text-white">Email</label>
            <input
              className="form-control inner-container input-border-grey"
              ref={(email) => (this.email = email)}
              placeholder="Enter your email"
            />
          </div>

          <br />

          {this.state.resetMessage && (
            <div
              className={`alert ${this.state.messageType === 'success' ? 'alert-success' : 'alert-danger'}`}
              role="alert"
            >
              {this.state.resetMessage}
            </div>
          )}
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary">Reset Password</button>
            <Link to="/login" className="text-primary">
              Back to Login
            </Link>
          </div>
        </form>
        <br />
      </div>
    );
  }
}
