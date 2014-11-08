/* jshint node: true */
"use strict";

require("extensions");
require("stores");

$(function () {
	
});

function _bootstrap() {
	_.each([
		
	], function(action) {
		dispatcher.dispatch(Actions[action].all());
	});
}
