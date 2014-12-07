"use strict";

var React = require("react");

module.exports = React.createClass({
    getInitialState: function() {
        return {
            visible: false
        };
    },
    
    componentDidMount: function () {
        this.$el = $(this.getDOMNode());
        this.$el.on("hidden.bs.modal", this.reset);
    },

    show: function () {
        this.$el.modal("show");
    },

    reset: function() {
        
    },
    
    save: function() {
        
    },
    
    render: function() {
		return <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h3 className="modal-title">New Task</h3>
                    </div>
                    <div className="modal-body container">
						blah
                    </div>
                    <div className="modal-footer">
						<div className="row">
							<div className="col col-md-12">
								<button type="button" className="btn btn-primary pull-right" onClick={this.save}>Save</button>
                                <button type="button" className="btn btn-default pull-right spacing-right" onClick={this.reset} data-dismiss="modal">Close</button>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>;
    }
});