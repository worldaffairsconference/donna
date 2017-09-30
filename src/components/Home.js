import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

const ulStyle = {
	'list-style-type': 'none'
}

export default class Home extends Component {


  render () {
    return (
      <div className="container">
      	<br/>
        <div className="jumbotron">
        	<h1 className="display-5">Welcome to WAC!</h1>
        	<p className="lead">This is the registration site. Please log in to register students. If you're not registered, <a href="/register">sign up</a>.</p>
        	<hr className="my-4" />
	        <p className="lead">
	        	<ul style={ulStyle}>
				    	<li><a className="btn btn-primary btn-lg" href="/login" role="button">Log in</a></li><br/>
				    	<li><a className="btn btn-primary btn-lg" href="/register" role="button">Register</a></li>
				    </ul>
				  </p>
        </div>
        <center>
	        <div className="btn-group mr-2" role="group" aria-label="First group">
				    <a className="btn btn-primary" href="https://www.facebook.com/worldaffairsconference/"><i className="fa fa-facebook" aria-hidden="true"></i> Facebook</a>
				    <a className="btn btn-primary" href="https://twitter.com/worldaffairscon"><i className="fa fa-twitter" aria-hidden="true"></i> Twitter</a>
				    <a className="btn btn-primary" href="https://www.instagram.com/worldaffairscon/"><i className="fa fa-instagram" aria-hidden="true"></i> Instagram</a>
				  </div>
			  </center>
      </div>
    )
  }
}
