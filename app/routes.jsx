var React = require("react"),
    Route = require("react-router").Route,
    
    Test = require("pages/test");

module.exports = (
    <Route name="test" handler={Test} />
);