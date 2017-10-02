import React, { Component } from "react";
import Speakers from '../img/speaker-medley.png';
import { FormGroup, Label, Input } from "reactstrap";

export default class AddStudent extends Component {
	 constructor(props) {
    super(props);

  }

  // handleChange(event) {
  //   this.setState({value: event.target.value});
  // }

  // handleSubmit(event) {
  //   alert('A name was submitted: ' + this.state.value);
  //   event.preventDefault();
  // }

	render () {
		return (
			<div className="row">
				<div className="col">
					<br/>
					<div className="card">
						<div className="card-block">
							<form>
								<div className="form-group">
									<FormGroup>
					          <Label for="studentName">Name</Label>
					          <Input type="text" name="name" id="studentName" placeholder="Student Name" />
					        </FormGroup>
									<FormGroup>
							      <Label for="exampleSelect">Grade</Label>
							      <Input type="select" name="select" id="exampleSelect">
							        <option>8</option>
							        <option>9</option>
							        <option>10</option>
							        <option>11</option>
							        <option>12</option>
							      </Input>
							    </FormGroup>
									<FormGroup>
					          <Label for="accessability">Accessability Issues</Label>
					          <Input type="text" name="name" id="accessability" placeholder="If so, please describe." />
					        </FormGroup>
									<FormGroup check>
										<Label>Choose plenaries (pick 4 of the 6) </Label>
					        </FormGroup>
									<FormGroup check>
										 <Label check>
											 <Input type="checkbox" />{' '}
											 	Panel 1
										 </Label>
									 </FormGroup>
									 <FormGroup check>
 										 <Label check>
 											 <Input type="checkbox" />{' '}
 											 	Panel 2
 										 </Label>
 									 </FormGroup>
									 <FormGroup check>
 										 <Label check>
 											 <Input type="checkbox" />{' '}
 											 	Panel 3
 										 </Label>
 									 </FormGroup>
									 <FormGroup check>
 										 <Label check>
 											 <Input type="checkbox" />{' '}
 											 	Panel 4
 										 </Label>
 									 </FormGroup>
									 <FormGroup check>
 										 <Label check>
 											 <Input type="checkbox" />{' '}
 											 	Panel 5
 										 </Label>
 									 </FormGroup>
									 <FormGroup check>
 										 <Label check>
 											 <Input type="checkbox" />{' '}
 											 	Panel 6
 										 </Label>
 									 </FormGroup>
									<button type="submit" className="btn btn-primary">Add Student</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="col">
				<br/>
					<div className="card">
					  <img className="card-img-top" src={Speakers} alt="Past Speakers" width="100%"/>
					  <div className="card-block">
					    <h4 className="card-title">Plenaries</h4>
					    <p className="card-text">More info on plenaries on the offical World Affairs Conference website.</p>
					    <a href="https://world.ac" className="btn btn-primary" target="_blank">world.ac</a>
					  </div>
					</div>
				</div>
			</div>
		)
	}
}
