/* jshint node: true */
"use strict";

var React = require("react"),
    CompanyModal = require("components/companyModal"),
	Dropdown = require("components/dropdown"),
    Drilldown = require("pages/companyHierarchies/drilldown"),
	EquipmentProfiles = require("pages/companyHierarchies/equipmentProfiles"),
	OperatingAreaModal = require("pages/companyHierarchies/operatingAreaModal"),
    AreaModal = require("pages/companyHierarchies/areaModal"),
	LSDModal = require("pages/companyHierarchies/lsdModal"),
	
	Company = require("models/company"),
	OperatingArea = require("models/operatingArea"),
	Area = require("models/area"),
	LSD = require("models/lsd"),
	EquipmentProfile = require("models/equipmentProfile"),
	
	CompanyStore = require("stores/company"),
	OperatingAreaStore = require("stores/operatingArea"),
	AreaStore = require("stores/area"),
	LSDStore = require("stores/lsd"),
	EquipmentProfileStore = require("stores/equipmentProfile"),
	
	constants = require("constants");

var _companies, _operatingAreas, _areas, _lsds, _equipmentProfiles;

var _drilldowns = {
    operatingAreas: {
        actions: require("actions/operatingArea"),
        store: OperatingAreaStore,
        model: OperatingArea,
        constant: constants.components.OPERATING_AREAS,
        parentProperty: "companyId",
        title: "Areas of Operation",
        placeholder: "New area of operation...",
		newModalId: "operating-area-modal"
    },
    areas: {
        actions: require("actions/area"),
        store: AreaStore,
        model: Area,
		constant: constants.components.AREAS,
        parentProperty: "operatingAreaId",
        title: "Areas",
        placeholder: "New area...",
		newModalId: "area-modal"
    },
    lsds: {
        actions: require("actions/lsd"),
        store: LSDStore,
        model: LSD,
        constant: constants.components.LSDS,
        parentProperty: "areaId",
        title: "LSDs",
        placeholder: "New LSD...",
		newModalId: "lsd-modal"
    }
}

module.exports = React.createClass({
	getInitialState: function() {
		return {
			isEdit: false,
			
			companies: [],
			operatingAreas: [],
			areas: [],
			lsds: [],
			equipmentProfiles: []
		}	
	},
	
	componentDidMount: function() {
		var me = this;
		
		CompanyStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(companies) {
			var state = { companies: _companies = companies };
			if (companies.length > 0)
				state.company = companies[0];
			me.setState(state);
			OperatingAreaStore.notify();
		});
		
		OperatingAreaStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(operatingAreas) {
			_operatingAreas = operatingAreas;
			if (me.state.company !== undefined)
				me.setState({ operatingAreas: _.filter(_operatingAreas, function(x) { return x.get("companyId") === me.state.company.get("id") }) });
			AreaStore.notify();
		});
		
		AreaStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(areas) {
			_areas = areas;
			if (me.state.operatingArea !== undefined) {
				var operatingAreaId = me.state.operatingArea === undefined ? undefined : me.state.operatingArea.get("id");
				me.setState({ areas: _.filter(_areas, function(x) { return operatingAreaId !== undefined && x.get("operatingAreaId") === operatingAreaId }) });
			}
			LSDStore.notify();
		});
		
		LSDStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(lsds) {
			_lsds = lsds;
			if (me.state.area !== undefined) {
				var areaId = me.state.area === undefined ? undefined : me.state.area.get("id");
				me.setState({ equipmentProfile: new EquipmentProfile(), lsds: _.filter(_lsds, function(x) { return areaId !== undefined && x.get("areaId") === areaId }) });
			}
			EquipmentProfileStore.notify();
		});
		
		EquipmentProfileStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(equipmentProfiles) {
			_equipmentProfiles = equipmentProfiles;
			if (me.state.lsd !== undefined) {
				var lsdId = me.state.equipmentProfile === undefined ? undefined : me.state.equipmentProfile.get("id");
				me.setState({ equipmentProfile: new EquipmentProfile(), equipmentProfiles: _.filter(_equipmentProfiles, function(x) { return lsdId !== undefined && x.get("lsdId") === lsdId }) });
			}
		});
	},
	
	componentWillUnmount: function() {
		_.each([CompanyStore, OperatingAreaStore, AreaStore, LSDStore, EquipmentProfileStore], function(store) {
			store.unregister(constants.components.COMPANY_HIERARCHIES);
		});
	},
	
    newCompany: function() {
        this.setState({ company: new Company(), isEdit: false });
    },
	
	selectCompany: function(company) {
		this.updateView(company);
	},
	
	selectOperatingArea: function(operatingArea) {
		this.updateView(this.state.company, operatingArea);
	},
	
	selectArea: function(area) {
		this.updateView(this.state.company, this.state.operatingArea, area);
	},
	
	selectLSD: function(lsd) {
		this.updateView(this.state.company, this.state.operatingArea, this.state.area, lsd);
	},
		
	selectEquipmentProfile: function(equipmentProfile) {
		window.location.hash = "/equipment-profile/" + equipmentProfile.get("name").replace(/ /g, "_") + "/details";
	},
	
	updateView: function(company, operatingArea, area, lsd, equipmentProfile) {
		var me = this, state = {};
		this.setState({
			company: company,
			operatingArea: operatingArea,
			area: area,
			lsd: lsd,
			equipmentProfile: equipmentProfile,
			operatingAreas: _.filter(_operatingAreas, function(x) { return company !== undefined && x.get("companyId") === company.get("id"); }),
			areas: _.filter(_areas, function(x) { return operatingArea !== undefined && x.get("operatingAreaId") === operatingArea.get("id"); }),
			lsds: _.filter(_lsds, function(x) { return area !== undefined && x.get("areaId") === area.get("id"); }),
			equipmentProfiles: _.filter(_equipmentProfiles, function(x) { return lsd !== undefined && x.get("lsdId") === lsd.get("id"); })
		});
	},
	
	render: function() {
		var me = this;
		return <div className="container company-hierarchies-container">
			<div className="local-header">
				<h2>Company Hierarchies</h2>
				<div className="actions">
					<button type="button" className="btn btn-primary" onClick={this.newCompany} data-toggle="modal" data-target="#company-modal">New Company</button>
				</div>
			</div>
					
			<Dropdown list={this.state.companies} onChange={this.selectCompany} />
					
			<div className="drilldowns">
				<Drilldown list={this.state.operatingAreas} select={this.selectOperatingArea} parent={this.state.company} params={_drilldowns.operatingAreas} />
                <Drilldown list={this.state.areas} select={this.selectArea} parent={this.state.operatingArea} params={_drilldowns.areas} />
                <Drilldown list={this.state.lsds} select={this.selectLSD} parent={this.state.area} params={_drilldowns.lsds} />
                <EquipmentProfiles list={this.state.equipmentProfiles} select={this.selectEquipmentProfile} lsd={this.state.lsd} />
			</div>
			
            <CompanyModal company={this.state.company} isEdit={this.state.isEdit} />
			<OperatingAreaModal company={this.state.company} />
			<AreaModal operatingArea={this.state.operatingArea} />
			<LSDModal area={this.state.area} />
        </div>;
    }
});