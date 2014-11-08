/* jshint node: true */
"use strict";

var React = require("react"),
    Management = require("pages/management"),
    CompanyHierarchies = require("pages/companyHierarchies/companyHierarchies"),
	EquipmentProfile = require("pages/equipmentProfile/equipmentProfile");

var Controller = Backbone.Marionette.Controller.extend({
    initialize: function (options) {
        this.container = options.container;
    },

    management: function () {
        React.renderComponent(new Management(), this.container);
    },
    
    companyHierarchies: function() {
        React.renderComponent(new CompanyHierarchies(), this.container);
    },
	
	equipmentProfile: function(name, tab) {
		if (!_.contains(["details", "cylinder-configuration", "driver-data", "site-data", "devices"], tab))
			window.location.hash = "/equipment-profile/" + name + "/details";
		
		React.renderComponent(new EquipmentProfile({
			name: name.replace(/_/g, " "),
			tab: tab
		}), this.container);
	}
});

module.exports = Controller;