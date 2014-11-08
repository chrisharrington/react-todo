/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function () {
		return <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h4 className="modal-title">{this.props.title}</h4>
                    </div>
                    <div className="modal-body container">
						{this.props.children}
                    </div>
                    <div className="modal-footer">
						<div className="row">
							<div className="col col-md-8">
								<span className={"error-message" + (this.props.error === "" ? "" : " show")}>{this.props.error}</span>
							</div>
							<div className="col col-md-4">
								<button type="button" className="btn btn-default" disabled={this.props.loading} onClick={this.props.reset} data-dismiss="modal">Close</button>
								<button type="button" className="btn btn-primary" disabled={this.props.loading} onClick={this.props.save}>Save</button>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>;
    }
});