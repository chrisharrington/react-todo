/* jshint node: true */
"use strict";

var React = require("react"),
    User = require("models/user"),
    UserModal = require("components/user/userModal"),
	DeleteUserModal = require("components/user/deleteUserModal"),
    UserList = require("components/user/userList"),
	UserFilter = require("components/user/userFilter"),
	
	RoleStore = require("stores/role"),
	CompanyStore = require("stores/company"),
	OperatingAreaStore = require("stores/operatingArea"),
	
	constants = require("constants");

var _roles, _companies, _operatingAreas;

module.exports = React.createClass({
    getInitialState: function() {
        return {
            user: new User(),
			filter: {}
        };
    },

	componentDidMount: function() {
		RoleStore.registerAndNotify(constants.components.MANAGEMENT, function(roles) { _roles = roles; });
		CompanyStore.registerAndNotify(constants.components.MANAGEMENT, function(companies) { _companies = companies; });
		OperatingAreaStore.registerAndNotify(constants.components.MANAGEMENT, function(operatingAreas) { _operatingAreas = operatingAreas; });
	},
	
	componentWillUnmount: function() {
		_.each([RoleStore, CompanyStore, OperatingAreaStore], function(store) {
			store.unregister(constants.components.MANAGEMENT);
		});
	},
	
	newUser: function() {
		this.setState({
			user: new User({
				role: _roles[0].get("name"),
				company: _companies[0].get("name"),
				operatingArea: _operatingAreas[0].get("name")
			}),
			isEdit: false
		});
	},
	
    editUser: function(user) {
		var copied = new User();
		for (var name in user.attributes)
			copied.set(name, user.get(name));
		this.setState({ user: copied, isEdit: true });
	},
	
	deleteUser: function(user) {
		this.setState({ user: user });	
	},
	
	updateFilter: function(filter) {
		this.setState({ filter: filter });
	},
    
    render: function() {
        return <div className="container management-container">
            <h2>Management</h2>
			<div className="actions">
                <button type="button" className="btn btn-primary" onClick={this.newUser} data-toggle="modal" data-target="#user-modal">New User</button>    
            </div>
			
			<DeleteUserModal user={this.state.user} />
			<UserModal onSave={this.addUser} user={this.state.user} isEdit={this.state.isEdit} />
			<UserFilter onChange={this.updateFilter} />
            <UserList onEdit={this.editUser} onDelete={this.deleteUser} filter={this.state.filter} />
        </div>;
    }
});