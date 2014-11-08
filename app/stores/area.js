/* jshint node: true */
"use strict";

var Area = require("models/area"),
	BaseStore = require("stores/base"),
	
	constants = require("constants");

module.exports = new BaseStore(Area, constants.area, "fixtures/areas.json");