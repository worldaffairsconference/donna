import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Row, Col, Container } from 'reactstrap';
import { Links } from '../config/config.js';

var redHeart = {
  color: 'red',
};

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <footer>
          <hr />
          <Container>
            <center>
              <div className="container text-muted">
                <h4>World Affairs Conference</h4>
                <p>
                  <a href={Links['site']}>
                    <FontAwesome name="link" className="fa-2x black-icon" />
                  </a>{' '}
                  <a href={Links['email']}>
                    <FontAwesome
                      name="envelope"
                      className="fa-2x black-icon"
                    />
                  </a>{' '}
                  <a href={Links['facebook']}>
                    <FontAwesome
                      name="facebook"
                      className="fa-2x black-icon"
                    />
                  </a>{' '}
                  <a href={Links['instagram']}>
                    <FontAwesome
                      name="instagram"
                      className="fa-2x black-icon"
                    />
                  </a>{' '}
                  <a href={Links['twitter']}>
                    <FontAwesome
                      name="twitter"
                      className="fa-2x black-icon"
                    />
                  </a>{' '}
                  <a href={Links['github']}>
                    <FontAwesome name="github" className="fa-2x black-icon" />
                  </a>{' '}
                </p>
                <p>
                  The World Affairs Conference online registration system,
                  made by the <a href={Links['github']}>WAC team</a> with{' '}
                  <a href={Links['repo']}>
                    <FontAwesome name="code" className="black-icon" />
                  </a>{' '}
                  and <FontAwesome name="heart" style={redHeart} />
                </p>
                <p>
                  Have any questions or concerns? Check out{' '}
                  <a href="https://world.ac/faq/">our FAQ</a> or get in touch
                  with us!
                </p>
              </div>
            </center>
          </Container>
          <br />
        </footer>
      </div>
    );
  }
}
