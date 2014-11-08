/* jshint node: true */
"use strict";

var React = require("react"),
	ModalText = require("components/modalText"),
	ModalDropdown = require("components/modalDropdown"),
	ModalRadio = require("components/modalRadio"),

	Model = require("backbone").Model,
	
	EquipmentProfileDetailsActions = require("actions/equipmentProfileDetails"),

	CompressorTypeStore = require("stores/compressorType"),
	EquipmentProfileDetailsStore = require("stores/equipmentProfileDetails"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({
    getInitialState: function() {
        return {
			compressorTypes: [],
			
			loading: false,
			errorMessage: "",
			
			manufacturerError: false,
			modelError: false,
			serialNumberError: false,
			recycleValveOpenError: false,
			lubeCycleTimeAtMaxRPMError: false,
			maxRPMError: false,
			strokeError: false,
			rodDiameterError: false,
			maxTotalRoadLoadError: false,
			frameModelError: false,
			frameSerialNumberError: false
        };
		
		function _buildModels(list) {
			return list.map(function(item) {
				return new Model({ name: item });
			});
		}
    },
	
	componentDidMount: function() {
		var me = this;
		CompressorTypeStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE_MODAL, function(x) { me.setState({ compressorTypes: x }); });
		EquipmentProfileDetailsStore.register(constants.components.EQUIPMENT_PROFILE_MODAL, function(x) { me.reset(); });
	},
	
	componentWillUnmount: function() {
		CompressorTypeStore.unregister(constants.components.EQUIPMENT_PROFILE_MODAL);
		EquipmentProfileDetailsStore.unregister(constants.components.EQUIPMENT_PROFILE_MODAL);
	},
	
	changeRadio: function(key, value) {
		this.props.profile.set(key, value);
		this.forceUpdate();
	},
		
	reset: function() {
		this.setState({
			errorMessage: "",
			loading: false,
			manufacturerError: false,
			modelError: false,
			serialNumberError: false,
			recycleValveOpenError: false,
			lubeCycleTimeAtMaxRPMError: false,
			maxRPMError: false,
			strokeError: false,
			rodDiameterError: false,
			maxTotalRoadLoadError: false,
			frameModelError: false,
			frameSerialNumberError: false
		});
		
		$("#equipment-profile-details-modal").modal("hide");
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
        return <div className="modal fade" id="equipment-profile-details-modal" tabindex="-1" role="dialog" aria-hidden="true">
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
						<ModalDropdown model={this.props.profile} property="compressorTypeId" list={this.state.compressorTypes} label="Compressor Type" />
						<ModalText model={this.props.profile} property="manufacturer" label="Manufacturer" error={this.state.manufacturerError} />
						<ModalText model={this.props.profile} property="model" label="Model" error={this.state.modelError} />
						<ModalText model={this.props.profile} property="serial" label="Serial Number" error={this.state.serialNumberError} />
						<ModalText model={this.props.profile} property="recycleValveOpenPercentage" label="Recycle Valve Open (%)" error={this.state.recycleValveOpenError} />
						<ModalText model={this.props.profile} property="cycleLubeCycleTimeAtMaxRpmSeconds" label="Lube Cycle Time (s)" error={this.state.lubeCycleTimeAtMaxRPMError} />
						<ModalText model={this.props.profile} property="maxRpm" label="Max RPM" error={this.state.maxRPMError} />
						<ModalText model={this.props.profile} property="strokeInches" label="Stroke (inches)" error={this.state.strokeError} />
						<ModalText model={this.props.profile} property="rodDiameterInches" label="Rod Diameter (inches)" error={this.state.rodDiameterError} />
						<ModalText model={this.props.profile} property="maxTotalRodLoadPoundsPerSqInches" label="Max Total Rod Load (psi)" error={this.state.maxTotalRoadLoadError} />
						<ModalRadio model={this.props.profile} property="isManual" label="Manual?" />
						<ModalText model={this.props.profile} property="frameModel" label="Frame Model" error={this.state.frameModelError} />
						<ModalText model={this.props.profile} property="frameSerialNumber" label="Frame Serial Number" error={this.state.frameSerialNumberError} />
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