/* jshint node: true */
"use strict";

var Backbone = require("backbone");

module.exports = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
		"": "management",
        "management": "management",
        "company-hierarchies": "companyHierarchies",
		"equipment-profile/:name/:tab": "equipmentProfile",
    },
    
    onRoute: function(name, route) {
        $("header li.active").removeClass("active");
        $("header li[data-active-key='" + route + "']").addClass("active");
    }
});