/* jshint node: true */
"use strict";

var React = require("react"),
	Dropdown = require("components/dropdown"),
	Backbone = require("backbone"),
	Company = require("models/company"),
	
	CompanyStore = require("stores/company"),
	
	constants = require("constants");

var _timeout, _filter= {};

module.exports = React.createClass({
	getInitialState: function() {
		return {
			companies: []
		};
	},
	
	componentDidMount: function() {
		var me = this;
		CompanyStore.registerAndNotify(constants.components.USER_FILTER, function(companies) {
			me.setState({ companies: [new Company({ id: -1, name: "All companies" })].concat(companies) });
		});
	},
	
	componentWillUnmount: function() {
		CompanyStore.unregister(constants.components.USER_FILTER);	
	},
	
	company: function(company) {
		_filter.company = company.get("name");
		this.update();
	},
	
	user: function(event) {
		_filter.user = event.target.value;
		this.update();
	},
	
	update: function() {
		this.props.onChange(_filter);
	},
	
	render: function() {
		return <div className="user-filter">
			<input className="form-control" type="text" placeholder="Filter by user name..." value={_filter.user} onChange={this.user} />
			<Dropdown list={this.state.companies} onChange={this.company} />
		</div>;
	}
});