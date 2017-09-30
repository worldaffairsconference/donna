import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Dashboard extends Component {
  render () {
    return (
      <div>
        Dashboard. World Affairs Conference Registration. <Link to="/add">Add Students</Link>
      </div>
    )
  }
}
