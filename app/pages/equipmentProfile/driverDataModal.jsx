/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),

	Model = require("backbone").Model,
	
	EquipmentProfileDetailsActions = require("actions/equipmentProfileDetails"),
	
	DriverTypeStore = require("stores/driverType"),
	FuelTypeStore = require("stores/fuelType"),
	EquipmentProfileDetailsStore = require("stores/equipmentProfileDetails"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({
    getInitialState: function() {
        return {
			driverTypes: [],
			fuelTypes: [],
			
			loading: false,
			errorMessage: ""
        };
		
		function _buildModels(list) {
			return list.map(function(item) {
				return new Model({ name: item });
			});
		}
    },
	
	componentDidMount: function() {
		var me = this;
		DriverTypeStore.registerAndNotify(constants.components.DRIVER_DATA_MODAL, function(x) { me.setState({ driverTypes: x }); });
		FuelTypeStore.registerAndNotify(constants.components.DRIVER_DATA_MODAL, function(x) { me.setState({ fuelTypes: x }); });
		EquipmentProfileDetailsStore.register(constants.components.DRIVER_DATA_MODAL, function(x) { me.reset(); });
	},
	
	componentWillUnmount: function() {
		DriverTypeStore.unregister(constants.components.DRIVER_DATA_MODAL);
		FuelTypeStore.unregister(constants.components.DRIVER_DATA_MODAL);
	},
    
	setTextData: function(property, event) {
		this.props.profile.set(property, event.target.value);
		this.forceUpdate();
	},
	
	changeRadio: function(key, value) {
		this.props.profile.set(key, value);
		this.forceUpdate();
	},
	
	changeDropdown: function(key, value) {
		this.props.profile.set(key + "Id", value.get("id"));
		this.props.profile.set(key, value.get("name"));
		this.forceUpdate();
	},
	
	reset: function() {
		this.setState({
			loading: false,
			errorMessage: "",
			manufacturerError: false,
			turboCountError: false,
			ratedRPMError: false,
			arrangementNumberError: false,
			horsepowerError: false
		});
		
		$("#driver-data-modal").modal("hide");
	},
	
	save: function() {
		var profile = this.props.profile;
		var errors = profile.validate();
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(EquipmentProfileDetailsActions.update(profile));
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
        return <div className="modal fade" id="driver-data-modal" tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title" id="myModalLabel">Edit Driver Data</h4>
                    </div>
                    <div className="modal-body container-fluid">
						<div className="row">
							<div className="col-md-4">
								<label>Driver Type</label>
							</div>
							<div className="col-md-8">
								<Dropdown list={this.state.driverTypes} onChange={this.changeDropdown.bind(null, "driverType")} selected={this.props.profile.get("driverTypeId")} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-4">
								<label>Fuel Type</label>
							</div>
							<div className="col-md-8">
								<Dropdown list={this.state.fuelTypes} onChange={this.changeDropdown.bind(null, "fuelType")} selected={this.props.profile.get("fuelTypeId")} />
							</div>
						</div>
						<div className={"row" + (this.state.manufacturerError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Manufacturer</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.profile.get("manufacturer") || ""} onChange={this.setTextData.bind(this, "manufacturer")} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-4">
								<label>Turbo Charged?</label>
							</div>
							<div className="col-md-8">
								<div className="radio">
									<span className={"first " + (this.props.profile.get("isTurboCharged") === true ? "selected" : "")} onClick={this.changeRadio.bind(null, "isTurboCharged", true)}>Yes</span>
									<span className={"last " + (this.props.profile.get("isTurboCharged") === true ? "" : "selected")} onClick={this.changeRadio.bind(null, "isTurboCharged", false)}>No</span>
								</div>
							</div>
						</div>
						<div className={"row" + (this.state.turboCountError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Turbo Count</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.profile.get("turboCount") || ""} onChange={this.setTextData.bind(this, "turboCount")} />
							</div>
						</div>
						<div className={"row" + (this.state.ratedRPMError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Rated RPM</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.profile.get("ratedRPM") || ""} onChange={this.setTextData.bind(this, "ratedRPM")} />
							</div>
						</div>
						<div className={"row" + (this.state.arrangementNumberError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Arrangement Number</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.profile.get("arrangementNumber") || ""} onChange={this.setTextData.bind(this, "arrangementNumber")} />
							</div>
						</div>
						<div className={"row" + (this.state.horsepowerError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Max HP at Sea Level</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.profile.get("horsepower") || ""} onChange={this.setTextData.bind(this, "horsepower")} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-4">
								<label>Manual?</label>
							</div>
							<div className="col-md-8">
								<div className="radio">
									<span className={"first " + (this.props.profile.get("isManual") === true ? "selected" : "")} onClick={this.changeRadio.bind(null, "isManual", true)}>Yes</span>
									<span className={"last " + (this.props.profile.get("isManual") === true ? "" : "selected")} onClick={this.changeRadio.bind(null, "isManual", false)}>No</span>
								</div>
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