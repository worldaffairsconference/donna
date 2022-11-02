import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Year, Links } from '../config/config.js';

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <br />
        <div className="jumbotron">
          <h1 className="display-5 fonted-h">WAC Online Registration</h1>
          <p className="lead">
            Welcome to the WAC {Year} online registration system, where faculty
            advisers can manage their attending delegation. To get started,{' '}
            <Link to="/register">sign up</Link>.
          </p>
          <p className="lead">
            Are you a teacher? Register <a href={'/tregister'}>here</a>.
          </p>
          <p className="lead">
            Have any questions? <a href={Links['contact']}>Get in touch.</a>
          </p>
          <hr className="my-4" />
          <ul className="ulStyle">
            <li className="liStyle">
              <Link className="btn btn-primary btn-lg" to="/login">
                Log in
              </Link>
            </li>
            <li className="liStyle">
              <Link className="btn btn-primary btn-lg" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
