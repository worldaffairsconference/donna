import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import ListStudent from './ListStudent'

export default class Dashboard extends Component {
  render () {
    return (
      <div>
		<h2>Dashboard</h2>
		<Link to="/add">Add Students</Link>
		<hr/>
		<h3>Students</h3>
		<ListStudent name="Example Name" accessability="" plenary={["Tech", "Politics", "Sustainability", "Gender Equality"]}/>
      </div>
    )
  }
}
