/* jshint node: true */
"use strict";

var React = require("react"),
	Dropdown = require("components/dropdown");

module.exports = React.createClass({
	change: function() {
		this.props.model.set(this.props.property, event.target.value);
		this.forceUpdate();
	},
	
	render: function () {
		return <div className={"row" + (this.props.error ? " has-error" : "")}>
			<div className="col-md-4">
				<label>{this.props.label}</label>
			</div>
			<div className="col-md-8">
				<Dropdown list={this.props.list} onChange={this.change} selected={this.props.model.get(this.props.property)} />
			</div>
		</div>;
    }
});