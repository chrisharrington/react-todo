/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
	render: function () {
		var me = this;
        return <div className="equipment-profiles">
			<h3>Equipment Profiles</h3>
			<div className={"create" + (this.props.lsd === undefined ? "" : " show")}>
				<button className="btn btn-primary">New equipment profile...</button>
			</div>
			<div className="list">
				{this.props.list.map(function(item) {
					return <div className="nav" onClick={me.props.select.bind(null, item)}>
						<span>{item.get("name")}</span>	
						<i className="fa fa-angle-right"></i>
					</div>;
				})}
			</div>
		</div>;
    }
});
