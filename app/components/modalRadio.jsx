/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
	change: function(value) {
		this.props.model.set(this.props.property, value);
		this.forceUpdate();
	},
	
	render: function () {
		return <div className={"row" + (this.props.error ? " has-error" : "")}>
			<div className="col-md-4">
				<label>{this.props.label}</label>
			</div>
			<div className="col-md-8">
				<div className="radio">
					<span className={"first " + (this.props.model.get(this.props.property) === true ? "selected" : "")} onClick={this.change.bind(null, true)}>Yes</span>
					<span className={"last " + (this.props.model.get(this.props.property) === true ? "" : "selected")} onClick={this.change.bind(null, false)}>No</span>
				</div>
			</div>
		</div>;
    }
});