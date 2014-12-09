"use strict";

var React = require("react"),
    
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").todo;

module.exports = React.createClass({
    getInitialState: function() {
        return {
            visible: false,
            value: ""
        };
    },
    
    componentDidMount: function () {
        this.$el = $(this.getDOMNode());
        this.$el.on("hidden.bs.modal", this.reset);
        
        emitter.on(constants.changed, function() {
            this.$el.modal("hide");
        }.bind(this));
    },
    
    componentWillUnmount: function() {
        emitter.off(constants.changed);
    },

    show: function () {
        this.$el.modal("show");
    },

    reset: function() {
        this.setState({ value: "" });
    },
    
    save: function() {
        dispatcher.dispatch({ type: constants.create, content: { name: this.state.value, isComplete: false }});
    },
    
    onChange: function(e) {
        this.setState({ value: e.target.value });
    },
    
    render: function() {
		return <div className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h3 className="modal-title">New Task</h3>
                    </div>
                    <div className="modal-body">
                        <input placeholder="Task name..." type="text" value={this.state.value} onChange={this.onChange} />        
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