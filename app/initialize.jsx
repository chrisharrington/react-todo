/* jshint node: true */
"use strict";

require("stores");

var React = require("react"),
    Todo = require("pages/todo");

$(function () {
    React.render(new Todo(), $("#app")[0]);
});