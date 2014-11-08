/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),

	Model = require("backbone").Model,
	Cylinder = require("models/cylinder"),
	
	CylinderActions = require("actions/cylinder"),
	
	CylinderStore = require("stores/cylinder"),
	CylinderConfigurationStore = require("stores/cylinderConfiguration"),
	FixedVolumeStore = require("stores/fixedVolume"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({
    getInitialState: function() {
        return {
			cylinderConfigurations: [],
			fixedVolumes: [],
			
			loading: false,
			errorMessage: "",
			
			throwNumberError: false,
			cylinderStageError: false,
			modelError: false,
			serialNumberError: false,
			maxWorkingPressureError: false,
			boreError: false,
			vvpError: false,
			vvpModelError: false,
			vvpSettingError: false,
			vvpTravelError: false,
			cylinderConfigurationError: false,
			fixedVolumeError: false
        };
		
		function _buildModels(list) {
			return list.map(function(item) {
				return new Model({ name: item });
			});
		}
    },
	
	componentDidMount: function() {
		var me = this;
		CylinderConfigurationStore.registerAndNotify(constants.components.CYLINDER_MODAL, function(x) { me.setState({ cylinderConfigurations: x }); });
		FixedVolumeStore.registerAndNotify(constants.components.CYLINDER_MODAL, function(x) { me.setState({ fixedVolumes: x }); });
		CylinderStore.register(constants.components.CYLINDER_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		CylinderConfigurationStore.unregister(constants.components.CYLINDER_MODAL);
		FixedVolumeStore.unregister(constants.components.CYLINDER_MODAL);
		CylinderStore.unregister(constants.components.CYLINDER_MODAL);
	},
    
	setTextData: function(property, event) {
		this.props.cylinder.set(property, event.target.value);
		this.forceUpdate();
	},
	
	changeVVP: function(value) {
		this.props.cylinder.set("vvp", value);
		this.forceUpdate();
	},
	
	changeCylinderConfiguration: function(value) {
		this.props.cylinder.set("cylinderConfigurationId", value.get("id"));
		this.props.cylinder.set("cylinderConfiguration", value.get("name"));
		this.forceUpdate();
	},
	
	changeFixedVolume: function(value) {
		this.props.cylinder.set("fixedVolumeId", value.get("id"));
		this.props.cylinder.set("fixedVolume", value.get("name"));
		this.forceUpdate();
	},
	
	reset: function() {
		var cylinderConfiguration = this.state.cylinderConfigurations[0];
		var fixedVolume = this.state.fixedVolumes[0];

		this.props.cylinder.set({
			vvp: false,
			cylinderConfigurationId: cylinderConfiguration.get("id"),
			cylinderConfiguration: cylinderConfiguration.get("name"),
			fixedVolumeId: fixedVolume.get("id"),
			fixedVolume: fixedVolume.get("name")
		});
		
		this.setState({
			loading: false,
			throwNumberError: false,
			cylinderStageError: false,
			modelError: false,
			serialNumberError: false,
			maxWorkingPressureError: false,
			boreError: false,
			vvpError: false,
			vvpModelError: false,
			vvpSettingError: false,
			vvpTravelError: false,
			cylinderConfigurationError: false,
			fixedVolumeError: false
		});
		
		$("#cylinder-modal").modal("hide");
	},
	
	save: function() {
		var cylinder = this.props.cylinder;
		var errors = cylinder.validate();
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(this.props.isEdit ? CylinderActions.update(cylinder) : CylinderActions.create(cylinder));
        }
		
		function _setErrors(errors, context) {
            var newState = {}, keyed = errors.dict("key"), count = 0, message;
			for (var name in context.state)
				if (name.endsWith("Error")) {
					var error = keyed[name.replace("Error", "")];
					newState[name] = error !== undefined;
					if (error !== undefined) {
						if (count === 0)
							message = error.message;
						count++;
					}
				}
			newState.errorMessage = count === 0 ? "" : count === 1 ? message : "Please fix the fields outlined in red.";
            context.setState(newState);
		}
        
        function _getErrorKeys(errors) {
            var keys = {};
            for (var i = 0; i < errors.length; i++)
                keys[errors[i].key] = errors[i].message;
            return keys;
        }
	},
	
	render: function () {
		var cylinder = this.props.cylinder;
        return <div className="modal fade" id="cylinder-modal" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title" id="myModalLabel">{(this.props.isEdit ? "Edit" : "New") + " Cylinder"}</h4>
                    </div>
                    <div className="modal-body container-fluid">
						<div className={"row" + (this.state.throwNumberError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Throw Number</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("throwNumber") || ""} onChange={this.setTextData.bind(this, "throwNumber")} />
							</div>
						</div>
						<div className={"row" + (this.state.cylinderStageError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Cylinder Stage</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("cylinderStage") || ""} onChange={this.setTextData.bind(this, "cylinderStage")} />
							</div>
						</div>
						<div className={"row" + (this.state.modelError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Model</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("model") || ""} onChange={this.setTextData.bind(this, "model")} />
							</div>
						</div>
						<div className={"row" + (this.state.serialNumberError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Serial Number</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("serialNumber") || ""} onChange={this.setTextData.bind(this, "serialNumber")} />
							</div>
						</div>
						<div className={"row" + (this.state.maxWorkingPressureError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Max Working Pressure</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("maxWorkingPressurePSI") || ""} onChange={this.setTextData.bind(this, "maxWorkingPressurePSI")} />
							</div>
						</div>
						<div className={"row" + (this.state.boreError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Bore</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("bore") || ""} onChange={this.setTextData.bind(this, "bore")} />
							</div>
						</div>
						<div className={"row" + (this.state.vvpError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>VVP</label>
							</div>
							<div className="col-md-8">
								<div className="radio">
									<span className={"first " + (this.props.cylinder.get("vvp") === true ? "selected" : "")} onClick={this.changeVVP.bind(null, true)}>Yes</span>
									<span className={"last " + (this.props.cylinder.get("vvp") === true ? "" : "selected")} onClick={this.changeVVP.bind(null, false)}>No</span>
								</div>
							</div>
						</div>
						<div className={"row" + (this.state.vvpModelError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>VVP Model</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("vvpModel") || ""} onChange={this.setTextData.bind(this, "vvpModel")} />
							</div>
						</div>
						<div className={"row" + (this.state.vvpSettingError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>VVP Setting</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("vvpSetting") || ""} onChange={this.setTextData.bind(this, "vvpSetting")} />
							</div>
						</div>
						<div className={"row" + (this.state.vvpTravelError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>VVP Travel</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.cylinder.get("vvpTravel") || ""} onChange={this.setTextData.bind(this, "vvpTravel")} />
							</div>
						</div>
						<div className={"row" + (this.state.cylinderConfigurationError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Cylinder Configuration</label>
							</div>
							<div className="col-md-8">
								<Dropdown error={this.state.cylinderConfigurationError} list={this.state.cylinderConfigurations} onChange={this.changeCylinderConfiguration} selected={this.props.cylinder.get("cylinderConfigurationId")} />
							</div>
						</div>
						<div className={"row" + (this.state.fixedVolumeError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Fixed Volume</label>
							</div>
							<div className="col-md-8">
								<Dropdown error={this.state.fixedVolumeError} list={this.state.fixedVolumes} onChange={this.changeFixedVolume} selected={this.props.cylinder.get("fixedVolumeId")} />
							</div>
						</div>
                    </div>
                    <div className="modal-footer">
						<div className="row">
							<div className="col col-md-6">
								<span className={"error-message" + (this.state.errorMessage === "" ? "" : " show")}>{this.state.errorMessage}</span>
							</div>
							<div className="col col-md-6">
								<button type="button" className="btn btn-default" disabled={this.state.loading} onClick={this.reset} data-dismiss="modal">Close</button>
								<button type="button" className="btn btn-primary" disabled={this.state.loading} onClick={this.save}>Save</button>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>;
    }
});