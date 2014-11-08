/* jshint node: true */
"use strict";

var React = require("react"),
	
	Details = require("pages/equipmentProfile/details"),
	CylinderConfiguration = require("pages/equipmentProfile/cylinderConfiguration"),
	DriverData = require("pages/equipmentProfile/driverData"),
	
	EquipmentProfileDetails = require("models/equipmentProfileDetails"),
	EquipmentProfileDetailsActions = require("actions/equipmentProfileDetails"),
	EquipmentProfileDetailsStore = require("stores/equipmentProfileDetails"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
	getInitialState: function() {
		var parts = window.location.hash.split("/");
		return {
			error: undefined,
			profile: new EquipmentProfileDetails(),
			tab: parts[parts.length-1]
		};
	},
	
	componentDidMount: function() {
		dispatcher.dispatch(EquipmentProfileDetailsActions.all({
			name: this.props.name
		}));
		
		var me = this;
		EquipmentProfileDetailsStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE, function(profiles) {
			if (profiles.length === 0)
				me.setState({ error: "No equipment profile with name \"" + me.props.name + "\" was found." });
			else
				me.setState({ error: undefined, profile: profiles[0] });
		});
	},
	
	componentWillUnmount: function() {
		EquipmentProfileDetailsStore.unregister(constants.components.EQUIPMENT_PROFILE);	
	},
	
	selectTab: function(tab) {
		var parts = window.location.hash.split("/");
		parts[parts.length-1] = tab;
		window.location.hash = parts.join("/");
		this.setState({ tab: tab });
	},
	
    render: function() {
        return <div className="container equipment-profile-container">
            <h2>{this.props.name}</h2>
			<span className={"error" + (this.state.error === undefined ? "" : " show")}>{this.state.error}</span>
			<ul className="nav nav-tabs" role="tablist">
				<li role="presentation" className={this.state.tab === "details" ? "active" : ""}><a onClick={this.selectTab.bind(null, "details")}>Details</a></li>
				<li role="presentation" className={this.state.tab === "cylinder-configuration" ? "active" : ""}><a onClick={this.selectTab.bind(null, "cylinder-configuration")}>Cylinder Configuration</a></li>
			  	<li role="presentation" className={this.state.tab === "driver-data" ? "active" : ""}><a onClick={this.selectTab.bind(null, "driver-data")}>Driver Data</a></li>
				<li role="presentation" className={this.state.tab === "site-data" ? "active" : ""}><a onClick={this.selectTab.bind(null, "site-data")}>Site Data</a></li>
				<li role="presentation" className={this.state.tab === "devices" ? "active" : ""}><a onClick={this.selectTab.bind(null, "devices")}>Devices</a></li>
			</ul>
			<div className="tab">
				<Details profile={this.state.profile} visible={this.state.tab === "details"} />
				<CylinderConfiguration profile={this.state.profile} visible={this.state.tab === "cylinder-configuration"} />
				<DriverData profile={this.state.profile} visible={this.state.tab === "driver-data"} />
			</div>
        </div>;
    }
});