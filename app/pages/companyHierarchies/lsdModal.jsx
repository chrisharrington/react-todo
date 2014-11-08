/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	
	ErrorHandler = require("utilities/errorHandler"),
	
	LSD = require("models/lsd"),
	LSDActions = require("actions/lsd"),
	LSDStore = require("stores/lsd"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
    getInitialState: function() {
        return {
            lsd: new LSD(),
			errorMessage: "",
			loading: false,
			
			errors: {}
        };  
    },
	
	componentDidMount: function() {
		var me = this;
		LSDStore.register(constants.components.LSD_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		LSDStore.unregister(constants.components.LSD_MODAL);
	},
	
	save: function() {
		var lsd = this.state.lsd;
		lsd.set("areaId", this.props.area.get("id"));
		var errors = ErrorHandler.handle(lsd);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(LSDActions.create(lsd));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#lsd-modal").modal("hide");
	},
	
    render: function() {
        return <Modal id="lsd-modal" title="New LSD" reset={this.reset} save={this.save} error={this.state.errorMessage} loading={this.state.loading}>
			<ModalText label="Name" model={this.state.lsd} property="name" error={this.state.errors.name} />
			<ModalText label="Boundary" model={this.state.lsd} property="boundary" error={this.state.errors.boundary} />
		</Modal>;
    }
});