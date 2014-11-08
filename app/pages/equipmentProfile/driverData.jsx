/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	DriverDataModal = require("pages/equipmentProfile/driverDataModal"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({
	render: function() {
		var profile = this.props.profile;
        return <div className={"driver-data tab button-tab container-fluid" + (this.props.visible === false || this.props.profile.get("name") === undefined ? " hide" : "")}>
			<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#driver-data-modal">Edit</button>
			<div>
				<div className="row">
					<div className="details-label col-md-3">Driver Type</div>
					<div className="details-value col-md-3">{profile.get("driverType")}</div>
					<div className="details-label col-md-3">Rated RPM</div>
					<div className="details-value col-md-3">{profile.get("ratedRPM")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Fuel Type</div>
					<div className="details-value col-md-3">{profile.get("fuelType")}</div>
					<div className="details-label col-md-3">Arrangement Number</div>
					<div className="details-value col-md-3">{profile.get("arrangementNumber")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Manufacturer</div>
					<div className="details-value col-md-3">{profile.get("manufacturer")}</div>
					<div className="details-label col-md-3">Max HP at Sea Level</div>
					<div className="details-value col-md-3">{profile.get("horsepower")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Turbo Charged?</div>
					<div className="details-value col-md-3">{profile.get("isTurboCharged") ? "Yes" : "No"}</div>
					<div className="details-label col-md-3">Manual?</div>
					<div className="details-value col-md-3">{profile.get("isManual") ? "Yes" : "No"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Turbo Count</div>
					<div className="details-value col-md-3">{profile.get("turboCount")}</div>
				</div>
			</div>
					
			<DriverDataModal profile={profile} />
		</div>;
    }
});