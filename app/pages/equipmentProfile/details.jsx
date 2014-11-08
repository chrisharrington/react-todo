/* jshint node: true */
"use strict";

var React = require("react"),
	EquipmentProfileDetailsModal = require("pages/equipmentProfile/equipmentProfileDetailsModal");

module.exports = React.createClass({
    render: function() {
		var profile = this.props.profile;
        return <div className={"details tab button-tab container-fluid" + (this.props.visible === false || this.props.profile.get("name") === undefined ? " hide" : "")}>
			<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#equipment-profile-details-modal">Edit</button>
			
			<div>
				<div className="row">
					<div className="details-label col-md-3">Company</div>
					<div className="details-value col-md-3">{profile.get("company")}</div>
					<div className="details-label col-md-3">Lube Cycle Time at Max RPM</div>
					<div className="details-value col-md-3">{profile.get("cycleLubeCycleTimeAtMaxRpmSeconds") + " seconds"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Operating Area</div>
					<div className="details-value col-md-3">{profile.get("operatingArea")}</div>
					<div className="details-label col-md-3">Max RPM</div>
					<div className="details-value col-md-3">{profile.get("maxRpm")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Area</div>
					<div className="details-value col-md-3">{profile.get("area")}</div>
					<div className="details-label col-md-3">Stroke</div>
					<div className="details-value col-md-3">{profile.get("strokeInches") + " inches"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">LSD</div>
					<div className="details-value col-md-3">{profile.get("lsd")}</div>
					<div className="details-label col-md-3">Rod Diameter</div>
					<div className="details-value col-md-3">{profile.get("strokeInches") + " inches"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Compressor Type</div>
					<div className="details-value col-md-3">{profile.get("compressorType")}</div>
					<div className="details-label col-md-3">Max Total Rod Load</div>
					<div className="details-value col-md-3">{profile.get("maxTotalRodLoadPoundsPerSqInches") + " pounds per square inch"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Manufacturer</div>
					<div className="details-value col-md-3">{profile.get("manufacturer")}</div>
					<div className="details-label col-md-3">Manual?</div>
					<div className="details-value col-md-3">{profile.get("isManual") ? "Yes" : "No"}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Model</div>
					<div className="details-value col-md-3">{profile.get("model")}</div>
					<div className="details-label col-md-3">Frame Model</div>
					<div className="details-value col-md-3">{profile.get("frameModel")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Serial Number</div>
					<div className="details-value col-md-3">{profile.get("serial")}</div>
					<div className="details-label col-md-3">Frame Serial Number</div>
					<div className="details-value col-md-3">{profile.get("frameSerialNumber")}</div>
				</div>
				<div className="row">
					<div className="details-label col-md-3">Recycle Valve Open</div>
					<div className="details-value col-md-3">{profile.get("recycleValveOpenPercentage") + "%"}</div>
				</div>
			</div>
				
			<EquipmentProfileDetailsModal profile={this.props.profile} isEdit="true" />
		</div>;
    }
});