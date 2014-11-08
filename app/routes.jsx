var React = require("react"),
    Routes = require("react-router").Routes,
    Route = require("react-router").Route,
    
    Test = require("pages/test");

module.exports = React.createClass({
    render: function() {
        return <Routes location="hash">
            <Route name="test" handler={Test} />
        </Routes>;
    }
});