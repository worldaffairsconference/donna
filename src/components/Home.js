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
            Welcome to the WAC {Year} online registration system, where you can
            select your plenaries and activities throughout the day. You will
            also be able to access your personalized schedule. To get started,{' '}
            <Link to="/register">sign up</Link>.
          </p>
          <p className="lead">
            For students attending online, please register using this{' '}
            <a href="https://hopin.com/events/world-affairs-conference-2023-hybrid-thinking">
              link
            </a>
            .
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
