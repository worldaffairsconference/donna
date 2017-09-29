import React, {Component} from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logout } from '../helpers/auth'

export default class DropDown extends Component {
	constructor(props){
		super(props);

		this.toggle = this.toggle.bind(this)
		this.state = {
			dropdownOpen: false
		};
	}
	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		})
	}

	render() {
		return (
			<UncontrolledDropdown tag="a" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Account
        </DropdownToggle>
        <DropdownMenu>
          {this.props.auth ?
        		<a style={{border: 'none', background: 'transparent'}}
        			onClick={() => {
                logout()
							}}
							className="dropdown-item">
							Logout
						</a>
						: <span>
							 <DropdownItem href="/login">Login</DropdownItem>
							 <DropdownItem href="/register">Register</DropdownItem>
						</span>
          }
        </DropdownMenu>
      </UncontrolledDropdown>
		)
	}
}