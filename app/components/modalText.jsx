/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
	set: function(event) {
		this.props.model.set(this.props.property, event.target.value);
		this.forceUpdate();
	},
	
	render: function () {
		return <div className={"row" + (this.props.error ? " has-error" : "")}>
			<div className="col-md-4">
				<label>{this.props.label}</label>
			</div>
			<div className="col-md-8">
				<input type="text" className="form-control" value={this.props.model.get(this.props.property) || ""} onChange={this.set} />
			</div>
		</div>;
    }
});