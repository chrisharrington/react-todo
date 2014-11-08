/* jshint node: true */
"use strict";

require("extensions");
require("stores");

var Routes = require("routes");

$(function () {
    React.renderComponent(new Routes(), document.body);
});