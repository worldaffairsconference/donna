import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Dashboard from './protected/Dashboard'
import Footer from './Footer'
import { firebaseAuth } from '../config/constants'
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import Logo from './img/wac_logo_full.png'
import { Year } from "../config/config.json"
import { logout } from '../helpers/auth'


function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}

export default class App extends Component {
  constructor(props){
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      authed: false,
      loading: true,
      isOpen: false
    }
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          loading: false,
        })
      } else {
        this.setState({
          authed: false,
          loading: false
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  toggle(){
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return this.state.loading === true ? <p>Loading</p> : (
      <BrowserRouter>
        <div>
          <Navbar color="faded" light toggleable>
            <NavbarBrand href="/"><img src={Logo} alt="World Affairs Conference Logo" className="nav-image"/></NavbarBrand>
            <NavbarToggler right onClick={this.toggle} />

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="/">WAC {Year}</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                </NavItem>
                {this.state.authed
                  ?<NavItem>
                    <NavLink onClick={() => {logout()}} >Log Out</NavLink>
                   </NavItem>
                  :<NavItem>
                    <NavLink href="/login">Log In</NavLink>
                   </NavItem>
                }
              </Nav>
            </Collapse>
          </Navbar>

          <div className="container">
            <div className="row">
              <Switch>
                <Route path='/' exact component={Home} />
                <PublicRoute authed={this.state.authed} path='/login' component={Login} />
                <PublicRoute authed={this.state.authed} path='/register' component={Register} />
                <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
                <Route render={() => <h3>Not Found</h3>} />
              </Switch>
            </div>
          </div>
          <Footer/>
        </div>

      </BrowserRouter>
    );
  }
}
