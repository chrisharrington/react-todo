var Dropdown = require("components/dropdown"),
	React = require("react");

describe("components - dropdown", function() {
	describe("componentWillMount", function() {
		it("should call 'selectValue'", function() {
			ReactTestUtils.renderIntoDocument(_buildDropdown());
		});
	});
	
	function _buildDropdown(params) {
		params = params || {};
		return new Dropdown({
			model: params.model || {
				get: function() { return true; },
				set: function() { return true; }
			},
			property: params.property || "the property",
			list: params.list || []
		});
	}
});