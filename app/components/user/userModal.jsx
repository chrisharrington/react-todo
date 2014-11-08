/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),
	User = require("models/user"),
    UserActions = require("actions/user"),
	
	UserStore = require("stores/user"),
	RoleStore = require("stores/role"),
	CompanyStore = require("stores/company"),
	OperatingAreaStore = require("stores/operatingArea"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({
    getInitialState: function() {
        return {
            roles: [],
			companies: [],
			operatingAreas: [],
            errorMessage: "",
			loading: false,
			roleError: false,
			companyError: false,
			operatingAreaError: false,
			firstNameError: false,
			lastNameError: false,
			phoneError: false,
			emailError: false,
			passwordError: false,
			confirmedPasswordError: false
        };
    },
	
	componentDidMount: function() {
        var me = this;
        UserStore.register(constants.components.USER_MODAL, function() { $("#user-modal").modal("hide"); me.reset(); });
		RoleStore.registerAndNotify(constants.components.USER_MODAL, function(roles) { me.setState({ roles: roles }); });
		CompanyStore.registerAndNotify(constants.components.USER_MODAL, function(companies) { me.setState({ companies: companies }); });
		OperatingAreaStore.registerAndNotify(constants.components.USER_MODAL, function(operatingAreas) { me.setState({ operatingAreas: operatingAreas }); });
		$("#user-modal").on("hidden", function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		_.each([UserStore, RoleStore, CompanyStore, OperatingAreaStore], function(store) {
			store.unregister(constants.components.USER_MODAL);
		});
	},
    
	reset: function() {
		this.setState({
			roleError: false,
			companyError: false,
			operatingAreaError: false,
			firstNameError: false,
			lastNameError: false,
			phoneError: false,
			emailError: false,
			passwordError: false,
			confirmedPasswordError: false,
			errorMessage: "",
			loading: false
		});
	},
	
	save: function() {
		var user = this.props.user;
		var errors = user.validate(!this.props.isEdit);
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(this.props.isEdit ? UserActions.update(user) : UserActions.create(user));
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
	
	setTextData: function(property, event) {
		this.props.user.set(property, event.target.value);
		this.forceUpdate();
	},
	
	roleChanged: function(role) {
		this.props.user.set("role", role.get("name"));
	},
	
	render: function () {
        return <div className="modal fade" id="user-modal" tabindex="-1" role="dialog"aria-hidden="true">
          <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title" id="myModalLabel">New User</h4>
                    </div>
                    <div className="modal-body container">
						<div className="row">
							<div className="col-md-4">
								<label>Role</label>
							</div>
							<div className="col-md-8">
								<Dropdown error={this.state.roleError} list={this.state.roles} onChange={this.roleChanged} />
							</div>
						</div>
						<div className="row">
							<div className="col-md-4">
								<label>Company</label>
							</div>
							<div className="col-md-8">
								<Dropdown error={this.state.companyError} list={this.state.companies} model={this.props.user} property="company" />
							</div>
						</div>
						<div className="row">
							<div className="col-md-4">
								<label>Operating Area</label>
							</div>
							<div className="col-md-8">
								<Dropdown error={this.state.operatingAreaError} list={this.state.operatingAreas} model={this.props.user} property="operatingArea" />
							</div>
						</div>
						<div className={"row" + (this.state.firstNameError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>First Name</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.user.get("firstName") || ""} onChange={this.setTextData.bind(this, "firstName")} />
							</div>
						</div>
						<div className={"row" + (this.state.lastNameError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Last Name</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.user.get("lastName") || ""} onChange={this.setTextData.bind(this, "lastName")} />
							</div>
						</div>
						<div className={"row" + (this.state.emailError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Email Address</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.user.get("email") || ""} onChange={this.setTextData.bind(this, "email")} />
							</div>
						</div>
						<div className={"row" + (this.state.phoneError ? " has-error" : "")}>
							<div className="col-md-4">
								<label>Phone Number</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" value={this.props.user.get("phone") || ""} onChange={this.setTextData.bind(this, "phone")} />
							</div>
						</div>
						<div className={"row" + (this.state.passwordError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Password</label>
							</div>
							<div className="col-md-8">
								<input type="password" className="form-control" value={this.props.user.get("password") || ""} onChange={this.setTextData.bind(this, "password")} />
							</div>
						</div>
						<div className={"row" + (this.state.confirmedPasswordError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}>
							<div className="col-md-4">
								<label>Confirmed Password</label>
							</div>
							<div className="col-md-8">
								<input type="password" className="form-control" value={this.props.user.get("confirmedPassword") || ""} onChange={this.setTextData.bind(this, "confirmedPassword")} />
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