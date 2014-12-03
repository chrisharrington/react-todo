/* jshint node: true */
"use strict";

var React = require("react"),
    _ = require("underscore"),
    
    List = require("./list"),
    
    stores = require("stores"),
    emitter = require("dispatcher/emitter"),
    constants = require("constants");

module.exports = React.createClass({
    getInitialState: function() {
        return {
            todos: []
        }  
    },
    
    componentDidMount: function() {
        stores.todo.registerAndNotify(constants.components.TODO, function(todos) {
            this.setState({ todos: todos });
        }.bind(this));
    },
    
    componentsWillUnmount: function() {
        stores.todo.unregister(constants.components.TODO);  
    },
    
    renderList: function(complete) {
        return <List todos={_.where(this.state.todos, function(x) { return x.get("isComplete") === complete; })} />;
    },
    
    render: function() {
        return <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h2>Todo List</h2>
                </div>
            </div>
                    
            <div className="row">
                <div className="col-md-6">
                    {this.renderList(false)}        
                </div>
                
            </div>
            
        </div>;
    }
});