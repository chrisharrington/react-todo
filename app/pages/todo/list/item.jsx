/* jshint node: true */
"use strict";

var constants = require("constants").todo,
    dispatcher = require("dispatcher");

module.exports = React.createClass({
    toggle: function() {
        this.props.todo.isComplete = !this.props.todo.isComplete;
        dispatcher.dispatch({ type: constants.update, content: this.props.todo });
    },
    
    render: function() {
        return <li className="list-group-item pointer" onClick={this.toggle}>{this.props.todo.name}</li>; 
    } 
});