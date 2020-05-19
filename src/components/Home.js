import React, { Component } from 'react'
import { Year, Links } from '../config/config.json'

export default class Home extends Component {

	render() {
		return (
			<div className="container">
				<br />
				<div className="jumbotron">
					<h1 className="display-5 fonted-h">WAC Online Registration</h1>
					<p className="lead">Welcome to the WAC {Year} online registration system, where faculty advisers can manage their attending delegation. To get started, <a href="/register">sign up</a>.</p>
					<p className="lead">
						Have any questions? <a href={Links['contact']}>Get in touch.</a>
					</p>
					<hr className="my-4" />
					<ul className="ulStyle">
						<li className="liStyle"><a className="btn btn-primary btn-lg" href="/login" role="button">Log in</a></li>
						<li className="liStyle"><a className="btn btn-primary btn-lg" href="/register" role="button">Register</a></li>
					</ul>
				</div>
			</div>
		)
	}
}
