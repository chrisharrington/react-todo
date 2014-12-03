var React = require("react"),
    Route = require("react-router").Route,
    
    Todo = require("pages/todo");

module.exports = (
    <Route name="todo" handler={Todo} />
);