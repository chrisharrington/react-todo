/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	
	ErrorHandler = require("utilities/errorHandler"),
	
	OperatingArea = require("models/operatingArea"),
	OperatingAreaActions = require("actions/operatingArea"),
	OperatingAreaStore = require("stores/operatingArea"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
    getInitialState: function() {
		var operatingArea = new OperatingArea({ companyId: this.props.company ? this.props.company.get("id") : undefined });
        return {
            operatingArea: operatingArea,
			errorMessage: "",
			loading: false,
			
			errors: {}
        };  
    },
	
	componentDidMount: function() {
		var me = this;
		OperatingAreaStore.register(constants.components.OPERATING_AREA_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		OperatingAreaStore.unregister(constants.components.OPERATING_AREA_MODAL);
	},
	
	save: function() {
		var errors = ErrorHandler.handle(this.state.operatingArea);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(OperatingAreaActions.create(this.state.operatingArea));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#operating-area-modal").modal("hide");
	},
	
    render: function() {
        return <Modal id="operating-area-modal" title="New Area of Operation" reset={this.reset} save={this.save} error={this.state.errorMessage} loading={this.state.loading}>
			<ModalText label="Name" model={this.state.operatingArea} property="name" error={this.state.errors.name} />
			<ModalText label="Boundary" model={this.state.operatingArea} property="boundary" error={this.state.errors.boundary} />
		</Modal>;
    }
});