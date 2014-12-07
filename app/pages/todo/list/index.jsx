/* jshint node: true */
"use strict";

var _ = require("underscore"),
    Item = require("./item");

module.exports = React.createClass({
    renderItems: function() {
        return _.map(this.props.todos, function(todo) {
            return <Item todo={todo} />;
        });
    },
    
    render: function() {
        return <ul className="list-group">
            {this.renderItems()}
        </ul>;
    } 
});