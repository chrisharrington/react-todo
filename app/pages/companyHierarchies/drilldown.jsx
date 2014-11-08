/* jshint node: true */
"use strict";

var React = require("react"),
	Model = require("backbone").Model,
    
    constants = require("constants"),
	dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			selected: new Model(),
			loading: false,
			name: "",
			error: false
		};	
	},
	
	componentDidMount: function() {
		var me = this;
		this.props.params.store.register(this.props.params.constant, function() {
			me.setState({ loading: false });
		});
	},
    
    componentWillUnmount: function() {
        this.props.params.store.unregister(this.props.params.constant);
    },
    
	change: function(event) {
		this.setState({ name: event.target.value });	
	},

	create: function() {
		var error = this.state.name === "";
		this.setState({ error: error });
		if (!error) {
			this.setState({ loading: true, name: "" });
            var modelData = { name: this.state.name };
            modelData[this.props.params.parentProperty] = this.props.parent.get("id");
			dispatcher.dispatch(this.props.params.actions.create(new this.props.params.model(modelData)));
		}
	},
	
    select: function(item) {
        this.setState({ selected: item });
        this.props.select(item);
    },
    
	render: function () {
		var me = this;
        return <div className="drilldown">
			<h3>{this.props.params.title}</h3>
			<div className={"create" + (this.props.parent === undefined ? "" : " show")}>
				<button disabled={this.state.loading} className="btn btn-primary" data-toggle="modal" data-target={"#" + this.props.params.newModalId}>{this.props.params.placeholder}</button>
			</div>
			<div className="list">
				{this.props.list.map(function(item) {
					return <div className={me.state.selected !== undefined && me.state.selected.get("id") === item.get("id") ? "selected" : ""} onClick={me.select.bind(null, item)}>
						<span>{item.get("name")}</span>	
					</div>;
				})}
			</div>
		</div>;
    }
});
