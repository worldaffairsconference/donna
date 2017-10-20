import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
import {Row, Col, Button, ButtonGroup} from 'reactstrap'

var footerStyle = {
	backgroundColor:"#F5F5F5"
}


export default class Footer extends Component {
	render() {
		return (
			<div className="footer">
			<footer style={footerStyle}>
				<br/>
	            <Row>
	             	<Col>
	             		<center>
	             		<div className="container text-muted">
	                	<p>
	                		<h4>World Affairs Conference</h4>
	                		<ButtonGroup>
						        <a href="http://world.ac"><Button><FontAwesome name="link"/></Button></a>{' '}
						        <a href="http://instagram.com/worldaffairscon"><Button>
						        	<FontAwesome name="instagram"/>
						        </Button></a>{' '}
						        <a href="http://facebook.com/worldaffairsconference"><Button>
						        	<FontAwesome name="facebook"/>
						        </Button></a>{' '}
						        <a href="http://twitter.com/worldaffairscon"><Button>
						        	<FontAwesome name="twitter"/>
						        </Button></a>{' '}
						        <a href="http://github.com/worldaffairsconference"><Button>
						        	<FontAwesome name="github"/>
						        </Button></a>{' '}
						    </ButtonGroup>
	                	</p>
	                	<p>
	                		Made with <FontAwesome name="code"/> and <FontAwesome name="heart"/> by the <a href="http://github.com/worldaffairsconference">WAC developement team</a>
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