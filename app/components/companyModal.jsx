/* jshint node: true */
"use strict";

var React = require("react"),
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	ErrorHandler = require("utilities/errorHandler"),
	
	Company = require("models/company"),
	CompanyActions = require("actions/company"),
	CompanyStore = require("stores/company"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
    getInitialState: function() {
        return {
            loading: false,
            errorMessage: "",
			company: new Company(),
			
			errors: {
				name: false,
				address: false,
				dailyProductionVolume: false,
				hrEmailAddress: false,
				apEmailAddress: false,
				employeeCount: false
			}
        };  
    },
	
	componentWillMount: function() {
		var me = this;
		CompanyStore.register(constants.components.COMPANY_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		CompanyStore.unregister(constants.components.COMPANY_MODAL);	
	},
	
	save: function() {
		var company = this.state.company;
		var errors = ErrorHandler.handle(company);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(CompanyActions.create(company));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#company-modal").modal("hide");
	},
    
    render: function() {
		var company = this.props.company;
        return <Modal id="company-modal" title="New Company" reset={this.reset} save={this.save} error={this.state.errorMessage} loading={this.state.loading}>
			<ModalText label="Name" model={this.state.company} property="name" error={this.state.errors.name} />
			<ModalText label="Address" model={this.state.company} property="address" error={this.state.errors.address} />
			<ModalText label="Daily Production Volume" model={this.state.company} property="dailyProductionVolume" error={this.state.errors.dailyProductionVolume} />
			<ModalText label="HR Email Address" model={this.state.company} property="hrEmailAddress" error={this.state.errors.hrEmailAddress} />
			<ModalText label="AP Email Address" model={this.state.company} property="apEmailAddress" error={this.state.errors.apEmailAddress} />
		</Modal>;
    }
});