import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Redirect, Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './protected/Dashboard';
import StudentDashboard from './protected/StudentDashboard';
import Footer from './Footer';
import NotFound from './NotFound';
import AdminDashboard from './protected/AdminDashboard';
import TRegister from './TRegister';
import QRReg from './protected/QRReg';
import LunchReg from './protected/LunchReg';
import { firebaseAuth, ref } from '../helpers/firebase';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import Logo from './img/wac_logo_full.png';
import { Year, Links } from '../config/config.js';
import { logout } from '../helpers/auth';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
        )
      }
    />
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      authed: false,
      isStudent: false,
      isAdmin: false,
      loading: true,
      isOpen: false,
      isVolunteer: false,
    };
  }
  componentDidMount() {
    this.removeListener = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const snapshot = await ref.child(`teachers/${user.uid}`).once('value');
        if (snapshot.exists()) {
          this.setState({
            authed: true,
            loading: false,
            isStudent: false,
          });
        } else {
          this.setState({
            authed: true,
            loading: false,
            isStudent: true,
          });
        }
        const snapshot2 = await ref.child(`admin/${user.uid}`).once('value');
        if (snapshot2.exists()) {
          this.setState({
            authed: true,
            loading: false,
            isAdmin: true,
          });
        }

        const snapshot3 = await ref
          .child(`volunteer/${user.uid}`)
          .once('value');
        if (snapshot3.exists()) {
          this.setState({
            authed: true,
            loading: false,
            isVolunteer: true,
          });
        }
      } else {
        this.setState({
          authed: false,
          loading: false,
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return this.state.loading === true ? (
      <p>Loading</p>
    ) : (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div>
          <Navbar color="faded" light toggleable>
            <Link component={NavbarBrand} to="/">
              <img
                src={Logo}
                alt="World Affairs Conference Logo"
                className="nav-image"
              />
            </Link>
            <NavbarToggler right onClick={this.toggle} />

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href={Links['site']}>WAC {Year}</NavLink>
                </NavItem>
                <NavItem>
                  <Link component={NavLink} to="/dashboard">
                    Dashboard
                  </Link>
                </NavItem>
                {this.state.authed ? (
                  <NavItem>
                    <Link
                      onClick={() => {
                        logout();
                      }}
                      component={NavLink}
                    >
                      Log Out
                    </Link>
                  </NavItem>
                ) : (
                  <NavItem>
                    <Link component={NavLink} to="/login">
                      Log In
                    </Link>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          </Navbar>

          <div className="container">
            <div className="row">
              <Switch>
                <Route path="/" exact component={Home} />
                <PublicRoute
                  authed={this.state.authed}
                  path="/login"
                  component={Login}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/register"
                  component={Register}
                />
                <PublicRoute
                  authed={this.state.authed}
                  path="/tregister"
                  component={TRegister}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/dashboard"
                  component={
                    this.state.isStudent ? StudentDashboard : Dashboard
                  }
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/admin"
                  component={this.state.isAdmin ? AdminDashboard : NotFound}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/volunteer"
                  component={this.state.isVolunteer ? QRReg : NotFound}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/lunch"
                  component={this.state.isVolunteer ? LunchReg : NotFound}
                />
                <PrivateRoute
                  authed={this.state.authed}
                  path="/sdashboard"
                  component={StudentDashboard}
                />
                <Route path="" component={NotFound} />
              </Switch>
            </div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}
