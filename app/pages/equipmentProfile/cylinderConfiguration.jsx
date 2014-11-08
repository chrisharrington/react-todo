/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Cylinder = require("models/cylinder"),
	CylinderActions = require("actions/cylinder"),
	CylinderStore = require("stores/cylinder"),
	CylinderConfigurationStore = require("stores/cylinderConfiguration"),
	FixedVolumeStore = require("stores/fixedVolume"),
	
	CylinderModal = require("pages/equipmentProfile/cylinderModal"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			cylinders: [],
			cylinder: new Cylinder(),
			cylinderConfigurations: [],
			fixedVolumes: []
		};
	},
	
	componentDidMount: function() {
		var me = this;
		CylinderStore.register(constants.components.EQUIPMENT_PROFILE, function(cylinders) { me.setState({ cylinders: cylinders }); });
		CylinderConfigurationStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE, function(x) { me.setState({ cylinderConfigurations: x }); });
		FixedVolumeStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE, function(x) { me.setState({ fixedVolumes: x }); });
		
		dispatcher.dispatch(CylinderActions.all({ equipmentProfileId: this.props.profile.get("id") }));
	},
	
	componentWillUnmount: function() {
		CylinderStore.unregister(constants.components.EQUIPMENT_PROFILE);
		CylinderConfigurationStore.unregister(constants.components.EQUIPMENT_PROFILE);
		FixedVolumeStore.unregister(constants.components.EQUIPMENT_PROFILE);
	},
	
	newCylinder: function() {
		var cylinderConfiguration = this.state.cylinderConfigurations[0];
		var fixedVolume = this.state.fixedVolumes[0];
		this.setState({
			cylinder: new Cylinder({
				throwNumber: "",
				cylinderStage: "",
				model: "",
				serialNumber: "",
				maxWorkingPressurePSI: "",
				bore: "",
				vvpModel: "",
				vvpSetting: "",
				vvpTravel: "",
				cylinderConfigurationId: cylinderConfiguration.get("id"),
				cylinderConfiguration: cylinderConfiguration.get("name"),
				fixedVolumeId: fixedVolume.get("id"),
				fixedVolume: fixedVolume.get("name"),
				vvp: false
			}),
			isEdit: false
		});
	},
	
    render: function() {
		var profile = this.props.profile;
		
		var cylinders = [];
		_.each(this.state.cylinders, function(cylinder) {
			cylinders.push(<div className="cylinder">
				<div className="row">
					<div className="details-label col-md-3">Throw Number</div>
					<div className="details-value col-md-3">{cylinder.get("throwNumber")}</div>
					<div className="details-label col-md-3">VVP</div>
					<div className="details-value col-md-3">{cylinder.get("vvp") ? "Yes" : "No"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Cylinder Stage</div>
					<div className="details-value col-md-3">{cylinder.get("cylinderStage")}</div>
					<div className="details-label col-md-3">VVP Model</div>
					<div className="details-value col-md-3">{cylinder.get("vvpModel")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Model</div>
					<div className="details-value col-md-3">{cylinder.get("model")}</div>
					<div className="details-label col-md-3">VVP Setting</div>
					<div className="details-value col-md-3">{cylinder.get("vvpSetting")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Serial Number</div>
					<div className="details-value col-md-3">{cylinder.get("serialNumber")}</div>
					<div className="details-label col-md-3">VVP Travel</div>
					<div className="details-value col-md-3">{cylinder.get("vvpTravelPercentage") + "%"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Max Working Pressure</div>
					<div className="details-value col-md-3">{cylinder.get("maxWorkingPressurePSI") + " psi"}</div>
					<div className="details-label col-md-3">Cylinder Configuration</div>
					<div className="details-value col-md-3">{cylinder.get("cylinderConfiguration")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Bore</div>
					<div className="details-value col-md-3">{cylinder.get("bore")}</div>
					<div className="details-label col-md-3">Fixed Volume</div>
					<div className="details-value col-md-3">{cylinder.get("fixedVolume")}</div>
				</div>
			</div>);
		});
		
        return <div className={"cylinder-configuration tab container-fluid" + (this.props.visible === false || this.props.profile.get("name") === undefined ? " hide" : "")}>
			<button type="button" className="btn btn-primary" onClick={this.newCylinder} data-toggle="modal" data-target="#cylinder-modal">New Cylinder</button>
			{cylinders}

			<CylinderModal cylinder={this.state.cylinder} isEdit={false} />
		</div>;
    }
});