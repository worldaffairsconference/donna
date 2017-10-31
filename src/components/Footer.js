import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
import {Row, Col} from 'reactstrap'

var redHeart = {
	color:"red"
}


export default class Footer extends Component {
	render() {
		return (
			<div className="footer">
				<footer>
					<hr />
				  <Row>
				    <Col>
				      <center>
				        <div className="container text-muted">

				          <h4>World Affairs Conference</h4>
				          <p>
				            <a href="http://world.ac">
											<FontAwesome name="link" className="fa-2x"/>
										</a>{' '}
				            <a href="http://instagram.com/worldaffairscon">
				              <FontAwesome name="instagram" className="fa-2x"/>
				            </a>{' '}
				            <a href="http://facebook.com/worldaffairsconference">
				              <FontAwesome name="facebook" className="fa-2x"/>
				            </a>{' '}
				            <a href="http://twitter.com/worldaffairscon">
				              <FontAwesome name="twitter" className="fa-2x"/>
				            </a>{' '}
				            <a href="http://github.com/worldaffairsconference">
				              <FontAwesome name="github" className="fa-2x"/>
				            </a>{' '}
				          </p>
				          <p>
				            Made by the <a href="http://github.com/worldaffairsconference">WAC team</a> with <FontAwesome name="code"/> and <FontAwesome name="heart" style={redHeart}/>
				          </p>
				        </div>
				      </center>
				    </Col>
				  </Row>
				</footer>
			</div>
    )
	}
}
