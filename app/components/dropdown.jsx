/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({
	getInitialState: function() {
		return {};
	},
	
	selectModel: function(model) {
		if (model !== undefined) {
			this.setState({ model: model });
			this.forceUpdate();
		}
	},
	
	click: function(model) {
		this.selectModel(model);
		if (this.props.onChange)
			this.props.onChange(model);
	},
	
	componentWillMount: function() {
		this.selectModel(this.state.model ? this.state.model : (this.props.list.length === 0 ? undefined : this.props.list[0]));
	},
	
	render: function () {
		var display = "", me = this;
		if (this.props.list.length > 0)
			if (this.props.selected !== undefined)
				this.state.model = _.find(this.props.list, function(x) { return x.get("id") === me.props.selected; });
			else if (this.state.model === undefined)
				this.state.model = this.props.list[0];
		if (this.state.model !== undefined)
			display = this.state.model.get("name");
		
		var items = [];
		for (var i = 0; i < this.props.list.length; i++)
			items.push(<li role="presentation" onClick={this.click.bind(this, this.props.list[i])}><a role="menuitem" tabindex="-1">{this.props.list[i].get("name")}</a></li>);
		
        return <div className={"dropdown" + (this.props.error ? " error" : "")}>
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
				{display}
                <i className="fa fa-caret-down"></i>
            </button>
            <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
				{items}
            </ul>
        </div>
    }
});