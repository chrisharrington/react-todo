/* jshint node: true */
"use strict";

var React = require("react"),
    UserActions = require("actions/user"),
	
	UserStore = require("stores/user"),
    
    dispatcher = require("dispatcher/dispatcher"),
    constants = require("constants");

var allUsers;

module.exports = React.createClass({
    getInitialState: function() {
        return {
            users: []
        }  
    },
    
    componentDidMount: function() {
        var me = this;
        
		UserStore.registerAndNotify(constants.components.USER_LIST, function(users) {
			me.setState({ users: allUsers = users });
		});
    },
	
	componentWillUnmount: function() {
		UserStore.unregister(constants.components.USER_LIST);	
	},
    
	render: function () {
        var me = this;
		var users = _.filter(allUsers, function(x) {
			var userValid = (me.props.filter.user === undefined || new RegExp(_escapeRegExp(me.props.filter.user), "ig").test(x.get("firstName") + " " + x.get("lastName")));
			var companyValid = (me.props.filter.company === undefined || me.props.filter.company === "All companies" || me.props.filter.company === x.get("company"));
			return userValid && companyValid;
		}).map(function(user) {
            return <tr>
                <td>{user.attributes.firstName + " " + user.attributes.lastName}</td>
                <td>{user.attributes.email}</td>
                <td>{user.attributes.phone}</td>
                <td>{user.attributes.role}</td>
                <td>{user.attributes.company}</td>
                <td>{user.attributes.operatingArea}</td>
                <td className="actions">
                    <i className="fa fa-pencil" data-toggle="modal" data-target="#user-modal" onClick={me.props.onEdit.bind(null, user)}></i>
                    <i className="fa fa-trash" data-toggle="modal" data-target="#delete-user-modal" onClick={me.props.onDelete.bind(null, user)}></i>
                </td>
            </tr>
        });
        
        return <div className="user-list">
            <table className="table table-striped table-bordered">
                <thead>
                    <th>Name</th>
                    <th>Email Addresss</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Operating Area</th>
                    <th></th>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
        </div>
    }
});

function _escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}