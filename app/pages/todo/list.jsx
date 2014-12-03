/* jshint node: true */
"use strict";

var _ = require("underscore");

module.exports = React.createClass({
    renderItems: function() {
        return _.map(this.props.todos, function(todo) {
            return <li className="list-group-item">{todo.get("name")}</li>; 
        });
    },
    
    render: function() {
        return <ul className="list-group">
            {this.renderItems()}
        </ul>;
    } 
});