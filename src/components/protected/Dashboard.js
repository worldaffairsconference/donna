import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Dashboard extends Component {
  render () {
    return (
      <div>
		<h2>Dashboard</h2>
		<Link to="/add">Add Students</Link>
		<hr/>
		<h3>Students</h3>
      </div>
    )
  }
}
