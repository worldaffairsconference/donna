import React, {Component} from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { logout, deleteUserData, deleteAccount } from '../helpers/auth'

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
// style={{border: 'none', background: 'transparent'}}
	render() {
		return (
			<UncontrolledDropdown tag="a" className="fonted" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          Account
        </DropdownToggle>
        <DropdownMenu>
          {this.props.auth ?
						<div>

							<a onClick={() => {
	                			logout()
							}}
							className="dropdown-item">
								Logout
							</a>

							<a onClick={() => {
								deleteUserData()
	                			deleteAccount()
							}}
							className="dropdown-item">
								Delete Account
							</a>
						</div>
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
