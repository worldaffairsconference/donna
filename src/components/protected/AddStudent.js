import React, { Component } from "react";
import Speakers from '../img/speaker-medley.png';

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
									<label for="studentEmail">Name</label>
							    <input type="text" className="form-control" id="studentName" placeholder="Enter Name"/>
							    <br/>
							    <label for="accessability">Any accessibility issues?</label>
							    <input type="text" className="form-control" id="accessability" placeholder="If so, please describe."/>
							    <br/>
							    <label>
							    Choose plenaries (pick 4 of the 6)
							    </label><br/>
							    <label className="custom-control custom-checkbox">
									  <input type="checkbox" className="custom-control-input" name="plenary1"/>
									  <span className="custom-control-indicator"></span>
									  <span className="custom-control-description">Plenary 1</span>
									</label><br/>
									<label className="custom-control custom-checkbox">
									  <input type="checkbox" className="custom-control-input" name="plenary2"/>
									  <span className="custom-control-indicator"></span>
									  <span className="custom-control-description">Plenary 2</span>
									</label><br/>
									<label className="custom-control custom-checkbox">
									  <input type="checkbox" className="custom-control-input" name="plenary3"/>
									  <span className="custom-control-indicator"></span>
									  <span className="custom-control-description">Plenary 3</span>
									</label><br/>
									<label className="custom-control custom-checkbox">
									  <input type="checkbox" className="custom-control-input" name="plenary4"/>
									  <span className="custom-control-indicator"></span>
									  <span className="custom-control-description">Plenary 4</span>
									</label><br/>
									<label className="custom-control custom-checkbox">
									  <input type="checkbox" className="custom-control-input" name="plenary5"/>
									  <span className="custom-control-indicator"></span>
									  <span className="custom-control-description">Plenary 5</span>
									</label><br/>
									<label className="custom-control custom-checkbox">
									  <input type="checkbox" className="custom-control-input" name="plenary6"/>
									  <span className="custom-control-indicator"></span>
									  <span className="custom-control-description">Plenary 6</span>
									</label><br/>
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