/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	
	ErrorHandler = require("utilities/errorHandler"),
	
	Area = require("models/area"),
	AreaActions = require("actions/area"),
	AreaStore = require("stores/area"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
    getInitialState: function() {
        return {
            area: new Area(),
			errorMessage: "",
			loading: false,
			
			errors: {}
        };  
    },
	
	componentDidMount: function() {
		var me = this;
		AreaStore.register(constants.components.AREA_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		AreaStore.unregister(constants.components.AREA_MODAL);
	},
	
	save: function() {
		var area = this.state.area;
		area.set("operatingAreaId", this.props.operatingArea.get("id"));
		var errors = ErrorHandler.handle(area);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(AreaActions.create(area));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#area-modal").modal("hide");
	},
	
    render: function() {
        return <Modal id="area-modal" title="New Area" reset={this.reset} save={this.save} error={this.state.errorMessage} loading={this.state.loading}>
			<ModalText label="Name" model={this.state.area} property="name" error={this.state.errors.name} />
			<ModalText label="Boundary" model={this.state.area} property="boundary" error={this.state.errors.boundary} />
		</Modal>;
    }
});