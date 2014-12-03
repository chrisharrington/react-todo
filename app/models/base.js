var validation = require("utilities/validation");

module.exports = function(methods) {
    methods = methods || {};
	var model = Backbone.Model.extend({
		validate: methods.validate || function() {
			return [];
		},

		all: function() {
			var all = {};
			for (var name in this.attributes)
				all[name] = false;
			return all;
		}
	});
	
	return model;
};