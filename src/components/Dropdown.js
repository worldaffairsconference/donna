import React, {Component} from 'react';
import { Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { logout, deleteUserData, deleteAccount } from '../helpers/auth'

export default class DropDown extends Component {
	constructor(props){
		super(props);

		this.toggleModal = this.toggleModal.bind(this)
		this.proceedDeleteAccount = this.proceedDeleteAccount.bind(this)

		this.state = {
		  modal: false
		};
	}
	toggleModal() {
		this.setState({
			modal: !this.state.modal
		})
	}

	proceedDeleteAccount() {
		deleteUserData();
		deleteAccount();
	}
// style={{border: 'none', background: 'transparent'}}
	render() {
		return (
			<UncontrolledDropdown tag="a" className="fonted dropdown-menu-right" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret className="fonted">
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

							<a onClick = {this.toggleModal} className="dropdown-item">Delete Account
				        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
				          <ModalHeader toggle={this.toggleModal}>Delete Account</ModalHeader>
				          <ModalBody>
				            Your information and registered students will be deleted from our database. Are your sure to proceed?
				          </ModalBody>
				          <ModalFooter>
				            <Button color="danger" onClick={this.proceedDeleteAccount}>Delete</Button>{' '}
				            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
				          </ModalFooter>
				        </Modal>
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
