import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Year, Links } from '../config/config.js';

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <br />
        <div className="jumbotron inner-container">
          <h1 className="display-5 fonted-h" class="text-[3rem] leading-none sm:text-6xl lg:text-[5.5rem] text-white font-bold mb-5 lg:mb-6 tracking-[-0.03em]">WAC Online Registration</h1>
          <p className="lead">
          Welcome to the WAC {Year} online registration system, where you 
          can select plenaries and activities for conference day. 
          In your dashboard, you will also be able to access your personalized schedule. 
          This year, all student registrations must go through a faculty supervisor. 
          To get started, ask your teacher to sign up <Link to="/tregister">here</Link>.
          and share their customized registration link with you. <br /><br />
          Have any questions? <a href="mailto:uccwac@gmail.com">Get in touch</a> 
          .
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
