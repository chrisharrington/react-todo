/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),
	User = require("models/user"),
    UserActions = require("actions/user"),
	
	UserStore = require("stores/user"),
    
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			errorMessage: "",
			loading: false
		};
	},
	
	componentDidMount: function() {
		var me = this;
		
		UserStore.register(constants.components.DELETE_USER_MODAL, function() {
			me.setState({ loading: false });
			$("#delete-user-modal").modal("hide");
		});
	},
	
	componentWillUnmount: function() {
		UserStore.unregister(constants.components.DELETE_USER_MODAL);	
	},
	
	confirm: function() {
		// todo: check if user to be deleted is signed in user
		
		this.setState({ loading: true });
		dispatcher.dispatch(UserActions.remove(this.props.user));	
	},
	
	render: function () {
		var name = this.props.user.get("firstName") + " " + this.props.user.get("lastName");
        return <div className="modal fade" id="delete-user-modal" tabindex="-1" role="dialog"aria-hidden="true">
          <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title" id="myModalLabel">Delete User</h4>
                    </div>
                    <div className="modal-body container">
						<span>Are you sure you want to delete <b>{name}</b>? This action is irreversible.</span>
                    </div>
                    <div className="modal-footer">
						<div className="row">
							<div className="col col-md-6">
								<span className={"error-message" + (this.state.errorMessage === "" ? "" : " show")}>{this.state.errorMessage}</span>
							</div>
							<div className="col col-md-6">
								<button type="button" className="btn btn-default" disabled={this.state.loading} data-dismiss="modal">Close</button>
								<button type="button" className="btn btn-primary" disabled={this.state.loading} onClick={this.confirm}>Delete</button>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>;
    }
});