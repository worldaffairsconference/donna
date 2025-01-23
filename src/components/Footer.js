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
                  <a href={Links['site']} style={{ marginRight: '10px' }}>
                    <FontAwesome name="link" className="fa-2x white-icon" />
                  </a>{' '}{' '}
                  <a href={Links['email']} style={{ marginRight: '10px' }}>
                    <FontAwesome name="envelope" className="fa-2x white-icon" />
                  </a>{' '}{' '}
                  <a href={Links['instagram']} style={{ marginRight: '10px' }}>
                    <FontAwesome
                      name="instagram"
                      className="fa-2x white-icon"
                    />
                  </a>{' '}{' '}
                  <a href={Links['github']} style={{ marginRight: '10px' }}>
                    <FontAwesome name="github" className="fa-2x white-icon" />
                  </a>{' '}{' '}
                </p>
                <p>
                  The World Affairs Conference online registration system, made
                  by the <a href={Links['github']}>WAC team</a> with{' '}
                  <a href={Links['repo']}>
                    <FontAwesome name="code" className="white-icon" />
                  </a>{' '}{' '}
                  and <FontAwesome name="heart" style={redHeart} />
                </p>
                <p>
                  Have any questions or concerns? Check out the faq on {' '}
                  <a href={Links['site']}>our Website</a> or get
                  in touch with us!
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

