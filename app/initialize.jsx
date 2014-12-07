/* jshint node: true */
"use strict";

require("stores");

var Router = require("react-router"),
    routes = require("routes"),
    dispatcher = require("dispatcher"),
    constants = require("constants");

$(function () {
    Router.run(routes, Router.HashLocation, function(Handler) {
        React.render(<Handler />, document.body); 
    });
});