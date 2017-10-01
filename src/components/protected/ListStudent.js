import React, {Component} from 'react'

export default class ListStudents extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div>
				<strong>{this.props.name}</strong>
				<ul>
					<li>{this.props.accessability ? "Possible accessability issue" : "No accessability issues"}</li>
					<li style={{"list-style-type": "none"}}>
						<ul>
							<li>{this.props.plenary[0]}</li>
							<li>{this.props.plenary[1]}</li>
							<li>{this.props.plenary[2]}</li>
							<li>{this.props.plenary[3]}</li>
						</ul>
					</li>
				</ul>
			</div>
		)
	}
}