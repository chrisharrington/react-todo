(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("actions/area", function(exports, require, module) {
var BaseAction = require("actions/base"),
	constants = require("constants");

module.exports = new BaseAction(constants.area);
});

require.register("actions/base", function(exports, require, module) {
module.exports = function(constants) {
	this.all = function(content) {
		return {
			type: constants.ALL,
			content: content
		};
	};
	
	this.create = function(content) {
		return {
			type: constants.CREATE,
			content: content
		};
	};
	
	this.update = function(content) {
		return {
			type: constants.UPDATE,
			content: content
		};
	};
	
	this.remove = function(content) {
		return {
			type: constants.REMOVE,
			content: content
		};
	};
};
});

require.register("actions/index", function(exports, require, module) {
var _ = require("underscore");

_.each([
    
], function(location) {
    require("stores/" + location);
});
});

require.register("components/companyModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	ErrorHandler = require("utilities/errorHandler"),
	
	Company = require("models/company"),
	CompanyActions = require("actions/company"),
	CompanyStore = require("stores/company"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            loading: false,
            errorMessage: "",
			company: new Company(),
			
			errors: {
				name: false,
				address: false,
				dailyProductionVolume: false,
				hrEmailAddress: false,
				apEmailAddress: false,
				employeeCount: false
			}
        };  
    },
	
	componentWillMount: function() {
		var me = this;
		CompanyStore.register(constants.components.COMPANY_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		CompanyStore.unregister(constants.components.COMPANY_MODAL);	
	},
	
	save: function() {
		var company = this.state.company;
		var errors = ErrorHandler.handle(company);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(CompanyActions.create(company));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#company-modal").modal("hide");
	},
    
    render: function() {
		var company = this.props.company;
        return React.createElement(Modal, {id: "company-modal", title: "New Company", reset: this.reset, save: this.save, error: this.state.errorMessage, loading: this.state.loading}, 
			React.createElement(ModalText, {label: "Name", model: this.state.company, property: "name", error: this.state.errors.name}), 
			React.createElement(ModalText, {label: "Address", model: this.state.company, property: "address", error: this.state.errors.address}), 
			React.createElement(ModalText, {label: "Daily Production Volume", model: this.state.company, property: "dailyProductionVolume", error: this.state.errors.dailyProductionVolume}), 
			React.createElement(ModalText, {label: "HR Email Address", model: this.state.company, property: "hrEmailAddress", error: this.state.errors.hrEmailAddress}), 
			React.createElement(ModalText, {label: "AP Email Address", model: this.state.company, property: "apEmailAddress", error: this.state.errors.apEmailAddress})
		);
    }
});
});

require.register("components/dropdown", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
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
			items.push(React.createElement("li", {role: "presentation", onClick: this.click.bind(this, this.props.list[i])}, React.createElement("a", {role: "menuitem", tabindex: "-1"}, this.props.list[i].get("name"))));
		
        return React.createElement("div", {className: "dropdown" + (this.props.error ? " error" : "")}, 
            React.createElement("button", {className: "btn btn-default dropdown-toggle", type: "button", id: "dropdownMenu1", 'data-toggle': "dropdown"}, 
				display, 
                React.createElement("i", {className: "fa fa-caret-down"})
            ), 
            React.createElement("ul", {className: "dropdown-menu", role: "menu", 'aria-labelledby': "dropdownMenu1"}, 
				items
            )
        )
    }
});
});

require.register("components/header", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			user: {}
		};
	},
	
	componentWillMount: function() {
		this.setState({
			user: {
				name: "Chris"
			}
		})
	},
	
    render: function () {
        return React.createElement("div", {className: "navbar navbar-inverse navbar-fixed-top", role: "navigation"}, 
      		React.createElement("div", {className: "container"}, 
        		React.createElement("div", {className: "navbar-header"}, 
          			React.createElement("a", {className: "navbar-brand logo"}, "Relincd")
        		), 
        		React.createElement("div", {className: "collapse navbar-collapse"}, 
					React.createElement("ul", {className: "nav navbar-nav"}, 
						React.createElement("li", {'data-active-key': "management"}, React.createElement("a", {href: "#/management"}, "Management")), 
						React.createElement("li", {'data-active-key': "company-hierarchies"}, React.createElement("a", {href: "#/company-hierarchies"}, "Company Hierarchies"))
					), 
					React.createElement("div", {className: "account-info"}, 
						React.createElement("span", null, "Welcome, ",  this.state.user.name, "!"), 
						React.createElement("br", null), 
						React.createElement("a", null, "Sign Out")
					)
        		)
      		)
		);
    }
});
});

require.register("components/modal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
	render: function () {
		return React.createElement("div", {className: "modal fade", id: this.props.id, tabindex: "-1", role: "dialog", 'aria-hidden': "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h4", {className: "modal-title"}, this.props.title)
                    ), 
                    React.createElement("div", {className: "modal-body container"}, 
						this.props.children
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-8"}, 
								React.createElement("span", {className: "error-message" + (this.props.error === "" ? "" : " show")}, this.props.error)
							), 
							React.createElement("div", {className: "col col-md-4"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", disabled: this.props.loading, onClick: this.props.reset, 'data-dismiss': "modal"}, "Close"), 
								React.createElement("button", {type: "button", className: "btn btn-primary", disabled: this.props.loading, onClick: this.props.save}, "Save")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("components/modalDropdown", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	Dropdown = require("components/dropdown");

module.exports = React.createClass({displayName: 'exports',
	change: function() {
		this.props.model.set(this.props.property, event.target.value);
		this.forceUpdate();
	},
	
	render: function () {
		return React.createElement("div", {className: "row" + (this.props.error ? " has-error" : "")}, 
			React.createElement("div", {className: "col-md-4"}, 
				React.createElement("label", null, this.props.label)
			), 
			React.createElement("div", {className: "col-md-8"}, 
				React.createElement(Dropdown, {list: this.props.list, onChange: this.change, selected: this.props.model.get(this.props.property)})
			)
		);
    }
});
});

require.register("components/modalRadio", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
	change: function(value) {
		this.props.model.set(this.props.property, value);
		this.forceUpdate();
	},
	
	render: function () {
		return React.createElement("div", {className: "row" + (this.props.error ? " has-error" : "")}, 
			React.createElement("div", {className: "col-md-4"}, 
				React.createElement("label", null, this.props.label)
			), 
			React.createElement("div", {className: "col-md-8"}, 
				React.createElement("div", {className: "radio"}, 
					React.createElement("span", {className: "first " + (this.props.model.get(this.props.property) === true ? "selected" : ""), onClick: this.change.bind(null, true)}, "Yes"), 
					React.createElement("span", {className: "last " + (this.props.model.get(this.props.property) === true ? "" : "selected"), onClick: this.change.bind(null, false)}, "No")
				)
			)
		);
    }
});
});

require.register("components/modalText", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
	set: function(event) {
		this.props.model.set(this.props.property, event.target.value);
		this.forceUpdate();
	},
	
	render: function () {
		return React.createElement("div", {className: "row" + (this.props.error ? " has-error" : "")}, 
			React.createElement("div", {className: "col-md-4"}, 
				React.createElement("label", null, this.props.label)
			), 
			React.createElement("div", {className: "col-md-8"}, 
				React.createElement("input", {type: "text", className: "form-control", value: this.props.model.get(this.props.property) || "", onChange: this.set})
			)
		);
    }
});
});

require.register("components/user/deleteUserModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),
	User = require("models/user"),
    UserActions = require("actions/user"),
	
	UserStore = require("stores/user"),
    
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			errorMessage: "",
			loading: false
		};
	},
	
	componentDidMount: function() {
		var me = this;
		
		UserStore.register(constants.components.DELETE_USER_MODAL, function() {
			me.setState({ loading: false });
			$("#delete-user-modal").modal("hide");
		});
	},
	
	componentWillUnmount: function() {
		UserStore.unregister(constants.components.DELETE_USER_MODAL);	
	},
	
	confirm: function() {
		// todo: check if user to be deleted is signed in user
		
		this.setState({ loading: true });
		dispatcher.dispatch(UserActions.remove(this.props.user));	
	},
	
	render: function () {
		var name = this.props.user.get("firstName") + " " + this.props.user.get("lastName");
        return React.createElement("div", {className: "modal fade", id: "delete-user-modal", tabindex: "-1", role: "dialog", 'aria-hidden': "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Delete User")
                    ), 
                    React.createElement("div", {className: "modal-body container"}, 
						React.createElement("span", null, "Are you sure you want to delete ", React.createElement("b", null, name), "? This action is irreversible.")
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("span", {className: "error-message" + (this.state.errorMessage === "" ? "" : " show")}, this.state.errorMessage)
							), 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", disabled: this.state.loading, 'data-dismiss': "modal"}, "Close"), 
								React.createElement("button", {type: "button", className: "btn btn-primary", disabled: this.state.loading, onClick: this.confirm}, "Delete")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("components/user/userFilter", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	Dropdown = require("components/dropdown"),
	Backbone = require("backbone"),
	Company = require("models/company"),
	
	CompanyStore = require("stores/company"),
	
	constants = require("constants");

var _timeout, _filter= {};

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			companies: []
		};
	},
	
	componentDidMount: function() {
		var me = this;
		CompanyStore.registerAndNotify(constants.components.USER_FILTER, function(companies) {
			me.setState({ companies: [new Company({ id: -1, name: "All companies" })].concat(companies) });
		});
	},
	
	componentWillUnmount: function() {
		CompanyStore.unregister(constants.components.USER_FILTER);	
	},
	
	company: function(company) {
		_filter.company = company.get("name");
		this.update();
	},
	
	user: function(event) {
		_filter.user = event.target.value;
		this.update();
	},
	
	update: function() {
		this.props.onChange(_filter);
	},
	
	render: function() {
		return React.createElement("div", {className: "user-filter"}, 
			React.createElement("input", {className: "form-control", type: "text", placeholder: "Filter by user name...", value: _filter.user, onChange: this.user}), 
			React.createElement(Dropdown, {list: this.state.companies, onChange: this.company})
		);
	}
});
});

require.register("components/user/userList", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    UserActions = require("actions/user"),
	
	UserStore = require("stores/user"),
    
    dispatcher = require("dispatcher/dispatcher"),
    constants = require("constants");

var allUsers;

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            users: []
        }  
    },
    
    componentDidMount: function() {
        var me = this;
        
		UserStore.registerAndNotify(constants.components.USER_LIST, function(users) {
			me.setState({ users: allUsers = users });
		});
    },
	
	componentWillUnmount: function() {
		UserStore.unregister(constants.components.USER_LIST);	
	},
    
	render: function () {
        var me = this;
		var users = _.filter(allUsers, function(x) {
			var userValid = (me.props.filter.user === undefined || new RegExp(_escapeRegExp(me.props.filter.user), "ig").test(x.get("firstName") + " " + x.get("lastName")));
			var companyValid = (me.props.filter.company === undefined || me.props.filter.company === "All companies" || me.props.filter.company === x.get("company"));
			return userValid && companyValid;
		}).map(function(user) {
            return React.createElement("tr", null, 
                React.createElement("td", null, user.attributes.firstName + " " + user.attributes.lastName), 
                React.createElement("td", null, user.attributes.email), 
                React.createElement("td", null, user.attributes.phone), 
                React.createElement("td", null, user.attributes.role), 
                React.createElement("td", null, user.attributes.company), 
                React.createElement("td", null, user.attributes.operatingArea), 
                React.createElement("td", {className: "actions"}, 
                    React.createElement("i", {className: "fa fa-pencil", 'data-toggle': "modal", 'data-target': "#user-modal", onClick: me.props.onEdit.bind(null, user)}), 
                    React.createElement("i", {className: "fa fa-trash", 'data-toggle': "modal", 'data-target': "#delete-user-modal", onClick: me.props.onDelete.bind(null, user)})
                )
            )
        });
        
        return React.createElement("div", {className: "user-list"}, 
            React.createElement("table", {className: "table table-striped table-bordered"}, 
                React.createElement("thead", null, 
                    React.createElement("th", null, "Name"), 
                    React.createElement("th", null, "Email Addresss"), 
                    React.createElement("th", null, "Phone Number"), 
                    React.createElement("th", null, "Role"), 
                    React.createElement("th", null, "Company"), 
                    React.createElement("th", null, "Operating Area"), 
                    React.createElement("th", null)
                ), 
                React.createElement("tbody", null, 
                    users
                )
            )
        )
    }
});

function _escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
});

;require.register("components/user/userModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),
	User = require("models/user"),
    UserActions = require("actions/user"),
	
	UserStore = require("stores/user"),
	RoleStore = require("stores/role"),
	CompanyStore = require("stores/company"),
	OperatingAreaStore = require("stores/operatingArea"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            roles: [],
			companies: [],
			operatingAreas: [],
            errorMessage: "",
			loading: false,
			roleError: false,
			companyError: false,
			operatingAreaError: false,
			firstNameError: false,
			lastNameError: false,
			phoneError: false,
			emailError: false,
			passwordError: false,
			confirmedPasswordError: false
        };
    },
	
	componentDidMount: function() {
        var me = this;
        UserStore.register(constants.components.USER_MODAL, function() { $("#user-modal").modal("hide"); me.reset(); });
		RoleStore.registerAndNotify(constants.components.USER_MODAL, function(roles) { me.setState({ roles: roles }); });
		CompanyStore.registerAndNotify(constants.components.USER_MODAL, function(companies) { me.setState({ companies: companies }); });
		OperatingAreaStore.registerAndNotify(constants.components.USER_MODAL, function(operatingAreas) { me.setState({ operatingAreas: operatingAreas }); });
		$("#user-modal").on("hidden", function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		_.each([UserStore, RoleStore, CompanyStore, OperatingAreaStore], function(store) {
			store.unregister(constants.components.USER_MODAL);
		});
	},
    
	reset: function() {
		this.setState({
			roleError: false,
			companyError: false,
			operatingAreaError: false,
			firstNameError: false,
			lastNameError: false,
			phoneError: false,
			emailError: false,
			passwordError: false,
			confirmedPasswordError: false,
			errorMessage: "",
			loading: false
		});
	},
	
	save: function() {
		var user = this.props.user;
		var errors = user.validate(!this.props.isEdit);
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(this.props.isEdit ? UserActions.update(user) : UserActions.create(user));
        }
		
		function _setErrors(errors, context) {
            var newState = {}, keyed = errors.dict("key"), count = 0, message;
			for (var name in context.state)
				if (name.endsWith("Error")) {
					var error = keyed[name.replace("Error", "")];
					newState[name] = error !== undefined;
					if (error !== undefined) {
						if (count === 0)
							message = error.message;
						count++;
					}
				}
			newState.errorMessage = count === 0 ? "" : count === 1 ? message : "Please fix the fields outlined in red.";
            context.setState(newState);
		}
        
        function _getErrorKeys(errors) {
            var keys = {};
            for (var i = 0; i < errors.length; i++)
                keys[errors[i].key] = errors[i].message;
            return keys;
        }
	},
	
	setTextData: function(property, event) {
		this.props.user.set(property, event.target.value);
		this.forceUpdate();
	},
	
	roleChanged: function(role) {
		this.props.user.set("role", role.get("name"));
	},
	
	render: function () {
        return React.createElement("div", {className: "modal fade", id: "user-modal", tabindex: "-1", role: "dialog", 'aria-hidden': "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "New User")
                    ), 
                    React.createElement("div", {className: "modal-body container"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Role")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {error: this.state.roleError, list: this.state.roles, onChange: this.roleChanged})
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Company")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {error: this.state.companyError, list: this.state.companies, model: this.props.user, property: "company"})
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Operating Area")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {error: this.state.operatingAreaError, list: this.state.operatingAreas, model: this.props.user, property: "operatingArea"})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.firstNameError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "First Name")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.user.get("firstName") || "", onChange: this.setTextData.bind(this, "firstName")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.lastNameError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Last Name")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.user.get("lastName") || "", onChange: this.setTextData.bind(this, "lastName")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.emailError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Email Address")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.user.get("email") || "", onChange: this.setTextData.bind(this, "email")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.phoneError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Phone Number")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.user.get("phone") || "", onChange: this.setTextData.bind(this, "phone")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.passwordError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Password")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "password", className: "form-control", value: this.props.user.get("password") || "", onChange: this.setTextData.bind(this, "password")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.confirmedPasswordError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Confirmed Password")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "password", className: "form-control", value: this.props.user.get("confirmedPassword") || "", onChange: this.setTextData.bind(this, "confirmedPassword")})
							)
						)
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("span", {className: "error-message" + (this.state.errorMessage === "" ? "" : " show")}, this.state.errorMessage)
							), 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", disabled: this.state.loading, onClick: this.reset, 'data-dismiss': "modal"}, "Close"), 
								React.createElement("button", {type: "button", className: "btn btn-primary", disabled: this.state.loading, onClick: this.save}, "Save")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("config", function(exports, require, module) {
module.exports = {
	fixtures: true
};
});

require.register("constants", function(exports, require, module) {
module.exports = {
	components: {
		
	}
};
});

require.register("controller", function(exports, require, module) {
/* jshint node: true */
"use strict";

var React = require("react"),
    Management = require("pages/management"),
    CompanyHierarchies = require("pages/companyHierarchies/companyHierarchies"),
	EquipmentProfile = require("pages/equipmentProfile/equipmentProfile");

var Controller = Backbone.Marionette.Controller.extend({
    initialize: function (options) {
        this.container = options.container;
    },

    management: function () {
        React.renderComponent(new Management(), this.container);
    },
    
    companyHierarchies: function() {
        React.renderComponent(new CompanyHierarchies(), this.container);
    },
	
	equipmentProfile: function(name, tab) {
		if (!_.contains(["details", "cylinder-configuration", "driver-data", "site-data", "devices"], tab))
			window.location.hash = "/equipment-profile/" + name + "/details";
		
		React.renderComponent(new EquipmentProfile({
			name: name.replace(/_/g, " "),
			tab: tab
		}), this.container);
	}
});

module.exports = Controller;
});

require.register("dispatcher/dispatcher", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Dispatcher = require("flux").Dispatcher;

module.exports = new Dispatcher();
});

require.register("dispatcher/emitter", function(exports, require, module) {
module.exports = new EventEmitter();
});

require.register("extensions/array", function(exports, require, module) {
Array.prototype.dict = function(prop) {
    var obj = {};
    for (var i = 0; i < this.length; i++)
        obj[this[i][prop]] = this[i];
    return obj;
};
});

require.register("extensions/index", function(exports, require, module) {
["string", "array"].forEach(function(location) {
    require("extensions/" + location);  
});
});

require.register("extensions/string", function(exports, require, module) {
String.prototype.endsWith = function(value) {
	if (value.length > this.length)
		return false;
	return value.length <= this.length && this.substr(this.length - value.length, value.length) === value;
};
});

require.register("initialize", function(exports, require, module) {
/* jshint node: true */
"use strict";

require("extensions");
require("stores");

$(function () {
	
});

function _bootstrap() {
	_.each([
		
	], function(action) {
		dispatcher.dispatch(Actions[action].all());
	});
}

});

;require.register("models/area", function(exports, require, module) {
var validation = require("utilities/validation"),
	BaseModel = require("models/base");

module.exports = new BaseModel({
	validate: function() {
		var errors = [];
		if (!validation.required(this.get("name")))
			errors.push({ key: "name", message: "The name is required." });
        return errors;
	}
});
});

require.register("models/base", function(exports, require, module) {
var validation = require("utilities/validation");

module.exports = function(methods) {
	var model = Backbone.Model.extend({
		validate: methods.validate || function() {
			return [];
		},

		all: function() {
			var all = {};
			for (var name in this.attributes)
				all[name] = false;
			return all;
		}
	});
	
	return model;
};
});

require.register("models/index", function(exports, require, module) {
var _ = require("underscore");

_.each([
    
], function(location) {
    require("stores/" + location);
});
});

require.register("pages/companyHierarchies/areaModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	
	ErrorHandler = require("utilities/errorHandler"),
	
	Area = require("models/area"),
	AreaActions = require("actions/area"),
	AreaStore = require("stores/area"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            area: new Area(),
			errorMessage: "",
			loading: false,
			
			errors: {}
        };  
    },
	
	componentDidMount: function() {
		var me = this;
		AreaStore.register(constants.components.AREA_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		AreaStore.unregister(constants.components.AREA_MODAL);
	},
	
	save: function() {
		var area = this.state.area;
		area.set("operatingAreaId", this.props.operatingArea.get("id"));
		var errors = ErrorHandler.handle(area);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(AreaActions.create(area));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#area-modal").modal("hide");
	},
	
    render: function() {
        return React.createElement(Modal, {id: "area-modal", title: "New Area", reset: this.reset, save: this.save, error: this.state.errorMessage, loading: this.state.loading}, 
			React.createElement(ModalText, {label: "Name", model: this.state.area, property: "name", error: this.state.errors.name}), 
			React.createElement(ModalText, {label: "Boundary", model: this.state.area, property: "boundary", error: this.state.errors.boundary})
		);
    }
});
});

require.register("pages/companyHierarchies/companyHierarchies", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    CompanyModal = require("components/companyModal"),
	Dropdown = require("components/dropdown"),
    Drilldown = require("pages/companyHierarchies/drilldown"),
	EquipmentProfiles = require("pages/companyHierarchies/equipmentProfiles"),
	OperatingAreaModal = require("pages/companyHierarchies/operatingAreaModal"),
    AreaModal = require("pages/companyHierarchies/areaModal"),
	LSDModal = require("pages/companyHierarchies/lsdModal"),
	
	Company = require("models/company"),
	OperatingArea = require("models/operatingArea"),
	Area = require("models/area"),
	LSD = require("models/lsd"),
	EquipmentProfile = require("models/equipmentProfile"),
	
	CompanyStore = require("stores/company"),
	OperatingAreaStore = require("stores/operatingArea"),
	AreaStore = require("stores/area"),
	LSDStore = require("stores/lsd"),
	EquipmentProfileStore = require("stores/equipmentProfile"),
	
	constants = require("constants");

var _companies, _operatingAreas, _areas, _lsds, _equipmentProfiles;

var _drilldowns = {
    operatingAreas: {
        actions: require("actions/operatingArea"),
        store: OperatingAreaStore,
        model: OperatingArea,
        constant: constants.components.OPERATING_AREAS,
        parentProperty: "companyId",
        title: "Areas of Operation",
        placeholder: "New area of operation...",
		newModalId: "operating-area-modal"
    },
    areas: {
        actions: require("actions/area"),
        store: AreaStore,
        model: Area,
		constant: constants.components.AREAS,
        parentProperty: "operatingAreaId",
        title: "Areas",
        placeholder: "New area...",
		newModalId: "area-modal"
    },
    lsds: {
        actions: require("actions/lsd"),
        store: LSDStore,
        model: LSD,
        constant: constants.components.LSDS,
        parentProperty: "areaId",
        title: "LSDs",
        placeholder: "New LSD...",
		newModalId: "lsd-modal"
    }
}

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			isEdit: false,
			
			companies: [],
			operatingAreas: [],
			areas: [],
			lsds: [],
			equipmentProfiles: []
		}	
	},
	
	componentDidMount: function() {
		var me = this;
		
		CompanyStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(companies) {
			var state = { companies: _companies = companies };
			if (companies.length > 0)
				state.company = companies[0];
			me.setState(state);
			OperatingAreaStore.notify();
		});
		
		OperatingAreaStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(operatingAreas) {
			_operatingAreas = operatingAreas;
			if (me.state.company !== undefined)
				me.setState({ operatingAreas: _.filter(_operatingAreas, function(x) { return x.get("companyId") === me.state.company.get("id") }) });
			AreaStore.notify();
		});
		
		AreaStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(areas) {
			_areas = areas;
			if (me.state.operatingArea !== undefined) {
				var operatingAreaId = me.state.operatingArea === undefined ? undefined : me.state.operatingArea.get("id");
				me.setState({ areas: _.filter(_areas, function(x) { return operatingAreaId !== undefined && x.get("operatingAreaId") === operatingAreaId }) });
			}
			LSDStore.notify();
		});
		
		LSDStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(lsds) {
			_lsds = lsds;
			if (me.state.area !== undefined) {
				var areaId = me.state.area === undefined ? undefined : me.state.area.get("id");
				me.setState({ equipmentProfile: new EquipmentProfile(), lsds: _.filter(_lsds, function(x) { return areaId !== undefined && x.get("areaId") === areaId }) });
			}
			EquipmentProfileStore.notify();
		});
		
		EquipmentProfileStore.registerAndNotify(constants.components.COMPANY_HIERARCHIES, function(equipmentProfiles) {
			_equipmentProfiles = equipmentProfiles;
			if (me.state.lsd !== undefined) {
				var lsdId = me.state.equipmentProfile === undefined ? undefined : me.state.equipmentProfile.get("id");
				me.setState({ equipmentProfile: new EquipmentProfile(), equipmentProfiles: _.filter(_equipmentProfiles, function(x) { return lsdId !== undefined && x.get("lsdId") === lsdId }) });
			}
		});
	},
	
	componentWillUnmount: function() {
		_.each([CompanyStore, OperatingAreaStore, AreaStore, LSDStore, EquipmentProfileStore], function(store) {
			store.unregister(constants.components.COMPANY_HIERARCHIES);
		});
	},
	
    newCompany: function() {
        this.setState({ company: new Company(), isEdit: false });
    },
	
	selectCompany: function(company) {
		this.updateView(company);
	},
	
	selectOperatingArea: function(operatingArea) {
		this.updateView(this.state.company, operatingArea);
	},
	
	selectArea: function(area) {
		this.updateView(this.state.company, this.state.operatingArea, area);
	},
	
	selectLSD: function(lsd) {
		this.updateView(this.state.company, this.state.operatingArea, this.state.area, lsd);
	},
		
	selectEquipmentProfile: function(equipmentProfile) {
		window.location.hash = "/equipment-profile/" + equipmentProfile.get("name").replace(/ /g, "_") + "/details";
	},
	
	updateView: function(company, operatingArea, area, lsd, equipmentProfile) {
		var me = this, state = {};
		this.setState({
			company: company,
			operatingArea: operatingArea,
			area: area,
			lsd: lsd,
			equipmentProfile: equipmentProfile,
			operatingAreas: _.filter(_operatingAreas, function(x) { return company !== undefined && x.get("companyId") === company.get("id"); }),
			areas: _.filter(_areas, function(x) { return operatingArea !== undefined && x.get("operatingAreaId") === operatingArea.get("id"); }),
			lsds: _.filter(_lsds, function(x) { return area !== undefined && x.get("areaId") === area.get("id"); }),
			equipmentProfiles: _.filter(_equipmentProfiles, function(x) { return lsd !== undefined && x.get("lsdId") === lsd.get("id"); })
		});
	},
	
	render: function() {
		var me = this;
		return React.createElement("div", {className: "container company-hierarchies-container"}, 
			React.createElement("div", {className: "local-header"}, 
				React.createElement("h2", null, "Company Hierarchies"), 
				React.createElement("div", {className: "actions"}, 
					React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.newCompany, 'data-toggle': "modal", 'data-target': "#company-modal"}, "New Company")
				)
			), 
					
			React.createElement(Dropdown, {list: this.state.companies, onChange: this.selectCompany}), 
					
			React.createElement("div", {className: "drilldowns"}, 
				React.createElement(Drilldown, {list: this.state.operatingAreas, select: this.selectOperatingArea, parent: this.state.company, params: _drilldowns.operatingAreas}), 
                React.createElement(Drilldown, {list: this.state.areas, select: this.selectArea, parent: this.state.operatingArea, params: _drilldowns.areas}), 
                React.createElement(Drilldown, {list: this.state.lsds, select: this.selectLSD, parent: this.state.area, params: _drilldowns.lsds}), 
                React.createElement(EquipmentProfiles, {list: this.state.equipmentProfiles, select: this.selectEquipmentProfile, lsd: this.state.lsd})
			), 
			
            React.createElement(CompanyModal, {company: this.state.company, isEdit: this.state.isEdit}), 
			React.createElement(OperatingAreaModal, {company: this.state.company}), 
			React.createElement(AreaModal, {operatingArea: this.state.operatingArea}), 
			React.createElement(LSDModal, {area: this.state.area})
        );
    }
});
});

require.register("pages/companyHierarchies/drilldown", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	Model = require("backbone").Model,
    
    constants = require("constants"),
	dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({displayName: 'exports',
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
        return React.createElement("div", {className: "drilldown"}, 
			React.createElement("h3", null, this.props.params.title), 
			React.createElement("div", {className: "create" + (this.props.parent === undefined ? "" : " show")}, 
				React.createElement("button", {disabled: this.state.loading, className: "btn btn-primary", 'data-toggle': "modal", 'data-target': "#" + this.props.params.newModalId}, this.props.params.placeholder)
			), 
			React.createElement("div", {className: "list"}, 
				this.props.list.map(function(item) {
					return React.createElement("div", {className: me.state.selected !== undefined && me.state.selected.get("id") === item.get("id") ? "selected" : "", onClick: me.select.bind(null, item)}, 
						React.createElement("span", null, item.get("name"))	
					);
				})
			)
		);
    }
});

});

require.register("pages/companyHierarchies/equipmentProfiles", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
	render: function () {
		var me = this;
        return React.createElement("div", {className: "equipment-profiles"}, 
			React.createElement("h3", null, "Equipment Profiles"), 
			React.createElement("div", {className: "create" + (this.props.lsd === undefined ? "" : " show")}, 
				React.createElement("button", {className: "btn btn-primary"}, "New equipment profile...")
			), 
			React.createElement("div", {className: "list"}, 
				this.props.list.map(function(item) {
					return React.createElement("div", {className: "nav", onClick: me.props.select.bind(null, item)}, 
						React.createElement("span", null, item.get("name")), 	
						React.createElement("i", {className: "fa fa-angle-right"})
					);
				})
			)
		);
    }
});

});

require.register("pages/companyHierarchies/lsdModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	
	ErrorHandler = require("utilities/errorHandler"),
	
	LSD = require("models/lsd"),
	LSDActions = require("actions/lsd"),
	LSDStore = require("stores/lsd"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            lsd: new LSD(),
			errorMessage: "",
			loading: false,
			
			errors: {}
        };  
    },
	
	componentDidMount: function() {
		var me = this;
		LSDStore.register(constants.components.LSD_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		LSDStore.unregister(constants.components.LSD_MODAL);
	},
	
	save: function() {
		var lsd = this.state.lsd;
		lsd.set("areaId", this.props.area.get("id"));
		var errors = ErrorHandler.handle(lsd);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(LSDActions.create(lsd));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#lsd-modal").modal("hide");
	},
	
    render: function() {
        return React.createElement(Modal, {id: "lsd-modal", title: "New LSD", reset: this.reset, save: this.save, error: this.state.errorMessage, loading: this.state.loading}, 
			React.createElement(ModalText, {label: "Name", model: this.state.lsd, property: "name", error: this.state.errors.name}), 
			React.createElement(ModalText, {label: "Boundary", model: this.state.lsd, property: "boundary", error: this.state.errors.boundary})
		);
    }
});
});

require.register("pages/companyHierarchies/operatingAreaModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Modal = require("components/modal"),
	ModalText = require("components/modalText"),
	
	ErrorHandler = require("utilities/errorHandler"),
	
	OperatingArea = require("models/operatingArea"),
	OperatingAreaActions = require("actions/operatingArea"),
	OperatingAreaStore = require("stores/operatingArea"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
		var operatingArea = new OperatingArea({ companyId: this.props.company ? this.props.company.get("id") : undefined });
        return {
            operatingArea: operatingArea,
			errorMessage: "",
			loading: false,
			
			errors: {}
        };  
    },
	
	componentDidMount: function() {
		var me = this;
		OperatingAreaStore.register(constants.components.OPERATING_AREA_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		OperatingAreaStore.unregister(constants.components.OPERATING_AREA_MODAL);
	},
	
	save: function() {
		var errors = ErrorHandler.handle(this.state.operatingArea);
		this.setState({ errorMessage: errors.message, errors: errors.flags });
		if (!errors.any) {
			this.setState({ loading: true });
			dispatcher.dispatch(OperatingAreaActions.create(this.state.operatingArea));
		}
	},
	
	reset: function() {
		this.setState(this.getInitialState());
		$("#operating-area-modal").modal("hide");
	},
	
    render: function() {
        return React.createElement(Modal, {id: "operating-area-modal", title: "New Area of Operation", reset: this.reset, save: this.save, error: this.state.errorMessage, loading: this.state.loading}, 
			React.createElement(ModalText, {label: "Name", model: this.state.operatingArea, property: "name", error: this.state.errors.name}), 
			React.createElement(ModalText, {label: "Boundary", model: this.state.operatingArea, property: "boundary", error: this.state.errors.boundary})
		);
    }
});
});

require.register("pages/equipmentProfile/cylinderConfiguration", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	Cylinder = require("models/cylinder"),
	CylinderActions = require("actions/cylinder"),
	CylinderStore = require("stores/cylinder"),
	CylinderConfigurationStore = require("stores/cylinderConfiguration"),
	FixedVolumeStore = require("stores/fixedVolume"),
	
	CylinderModal = require("pages/equipmentProfile/cylinderModal"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		return {
			cylinders: [],
			cylinder: new Cylinder(),
			cylinderConfigurations: [],
			fixedVolumes: []
		};
	},
	
	componentDidMount: function() {
		var me = this;
		CylinderStore.register(constants.components.EQUIPMENT_PROFILE, function(cylinders) { me.setState({ cylinders: cylinders }); });
		CylinderConfigurationStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE, function(x) { me.setState({ cylinderConfigurations: x }); });
		FixedVolumeStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE, function(x) { me.setState({ fixedVolumes: x }); });
		
		dispatcher.dispatch(CylinderActions.all({ equipmentProfileId: this.props.profile.get("id") }));
	},
	
	componentWillUnmount: function() {
		CylinderStore.unregister(constants.components.EQUIPMENT_PROFILE);
		CylinderConfigurationStore.unregister(constants.components.EQUIPMENT_PROFILE);
		FixedVolumeStore.unregister(constants.components.EQUIPMENT_PROFILE);
	},
	
	newCylinder: function() {
		var cylinderConfiguration = this.state.cylinderConfigurations[0];
		var fixedVolume = this.state.fixedVolumes[0];
		this.setState({
			cylinder: new Cylinder({
				throwNumber: "",
				cylinderStage: "",
				model: "",
				serialNumber: "",
				maxWorkingPressurePSI: "",
				bore: "",
				vvpModel: "",
				vvpSetting: "",
				vvpTravel: "",
				cylinderConfigurationId: cylinderConfiguration.get("id"),
				cylinderConfiguration: cylinderConfiguration.get("name"),
				fixedVolumeId: fixedVolume.get("id"),
				fixedVolume: fixedVolume.get("name"),
				vvp: false
			}),
			isEdit: false
		});
	},
	
    render: function() {
		var profile = this.props.profile;
		
		var cylinders = [];
		_.each(this.state.cylinders, function(cylinder) {
			cylinders.push(React.createElement("div", {className: "cylinder"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Throw Number"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("throwNumber")), 
					React.createElement("div", {className: "details-label col-md-3"}, "VVP"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("vvp") ? "Yes" : "No")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Cylinder Stage"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("cylinderStage")), 
					React.createElement("div", {className: "details-label col-md-3"}, "VVP Model"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("vvpModel"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Model"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("model")), 
					React.createElement("div", {className: "details-label col-md-3"}, "VVP Setting"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("vvpSetting"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Serial Number"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("serialNumber")), 
					React.createElement("div", {className: "details-label col-md-3"}, "VVP Travel"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("vvpTravelPercentage") + "%")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Max Working Pressure"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("maxWorkingPressurePSI") + " psi"), 
					React.createElement("div", {className: "details-label col-md-3"}, "Cylinder Configuration"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("cylinderConfiguration"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Bore"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("bore")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Fixed Volume"), 
					React.createElement("div", {className: "details-value col-md-3"}, cylinder.get("fixedVolume"))
				)
			));
		});
		
        return React.createElement("div", {className: "cylinder-configuration tab container-fluid" + (this.props.visible === false || this.props.profile.get("name") === undefined ? " hide" : "")}, 
			React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.newCylinder, 'data-toggle': "modal", 'data-target': "#cylinder-modal"}, "New Cylinder"), 
			cylinders, 

			React.createElement(CylinderModal, {cylinder: this.state.cylinder, isEdit: false})
		);
    }
});
});

require.register("pages/equipmentProfile/cylinderModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),

	Model = require("backbone").Model,
	Cylinder = require("models/cylinder"),
	
	CylinderActions = require("actions/cylinder"),
	
	CylinderStore = require("stores/cylinder"),
	CylinderConfigurationStore = require("stores/cylinderConfiguration"),
	FixedVolumeStore = require("stores/fixedVolume"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
			cylinderConfigurations: [],
			fixedVolumes: [],
			
			loading: false,
			errorMessage: "",
			
			throwNumberError: false,
			cylinderStageError: false,
			modelError: false,
			serialNumberError: false,
			maxWorkingPressureError: false,
			boreError: false,
			vvpError: false,
			vvpModelError: false,
			vvpSettingError: false,
			vvpTravelError: false,
			cylinderConfigurationError: false,
			fixedVolumeError: false
        };
		
		function _buildModels(list) {
			return list.map(function(item) {
				return new Model({ name: item });
			});
		}
    },
	
	componentDidMount: function() {
		var me = this;
		CylinderConfigurationStore.registerAndNotify(constants.components.CYLINDER_MODAL, function(x) { me.setState({ cylinderConfigurations: x }); });
		FixedVolumeStore.registerAndNotify(constants.components.CYLINDER_MODAL, function(x) { me.setState({ fixedVolumes: x }); });
		CylinderStore.register(constants.components.CYLINDER_MODAL, function() { me.reset(); });
	},
	
	componentWillUnmount: function() {
		CylinderConfigurationStore.unregister(constants.components.CYLINDER_MODAL);
		FixedVolumeStore.unregister(constants.components.CYLINDER_MODAL);
		CylinderStore.unregister(constants.components.CYLINDER_MODAL);
	},
    
	setTextData: function(property, event) {
		this.props.cylinder.set(property, event.target.value);
		this.forceUpdate();
	},
	
	changeVVP: function(value) {
		this.props.cylinder.set("vvp", value);
		this.forceUpdate();
	},
	
	changeCylinderConfiguration: function(value) {
		this.props.cylinder.set("cylinderConfigurationId", value.get("id"));
		this.props.cylinder.set("cylinderConfiguration", value.get("name"));
		this.forceUpdate();
	},
	
	changeFixedVolume: function(value) {
		this.props.cylinder.set("fixedVolumeId", value.get("id"));
		this.props.cylinder.set("fixedVolume", value.get("name"));
		this.forceUpdate();
	},
	
	reset: function() {
		var cylinderConfiguration = this.state.cylinderConfigurations[0];
		var fixedVolume = this.state.fixedVolumes[0];

		this.props.cylinder.set({
			vvp: false,
			cylinderConfigurationId: cylinderConfiguration.get("id"),
			cylinderConfiguration: cylinderConfiguration.get("name"),
			fixedVolumeId: fixedVolume.get("id"),
			fixedVolume: fixedVolume.get("name")
		});
		
		this.setState({
			loading: false,
			throwNumberError: false,
			cylinderStageError: false,
			modelError: false,
			serialNumberError: false,
			maxWorkingPressureError: false,
			boreError: false,
			vvpError: false,
			vvpModelError: false,
			vvpSettingError: false,
			vvpTravelError: false,
			cylinderConfigurationError: false,
			fixedVolumeError: false
		});
		
		$("#cylinder-modal").modal("hide");
	},
	
	save: function() {
		var cylinder = this.props.cylinder;
		var errors = cylinder.validate();
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(this.props.isEdit ? CylinderActions.update(cylinder) : CylinderActions.create(cylinder));
        }
		
		function _setErrors(errors, context) {
            var newState = {}, keyed = errors.dict("key"), count = 0, message;
			for (var name in context.state)
				if (name.endsWith("Error")) {
					var error = keyed[name.replace("Error", "")];
					newState[name] = error !== undefined;
					if (error !== undefined) {
						if (count === 0)
							message = error.message;
						count++;
					}
				}
			newState.errorMessage = count === 0 ? "" : count === 1 ? message : "Please fix the fields outlined in red.";
            context.setState(newState);
		}
        
        function _getErrorKeys(errors) {
            var keys = {};
            for (var i = 0; i < errors.length; i++)
                keys[errors[i].key] = errors[i].message;
            return keys;
        }
	},
	
	render: function () {
		var cylinder = this.props.cylinder;
        return React.createElement("div", {className: "modal fade", id: "cylinder-modal", tabindex: "-1", role: "dialog", 'aria-hidden': "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, (this.props.isEdit ? "Edit" : "New") + " Cylinder")
                    ), 
                    React.createElement("div", {className: "modal-body container-fluid"}, 
						React.createElement("div", {className: "row" + (this.state.throwNumberError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Throw Number")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("throwNumber") || "", onChange: this.setTextData.bind(this, "throwNumber")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.cylinderStageError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Cylinder Stage")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("cylinderStage") || "", onChange: this.setTextData.bind(this, "cylinderStage")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.modelError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Model")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("model") || "", onChange: this.setTextData.bind(this, "model")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.serialNumberError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Serial Number")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("serialNumber") || "", onChange: this.setTextData.bind(this, "serialNumber")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.maxWorkingPressureError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Max Working Pressure")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("maxWorkingPressurePSI") || "", onChange: this.setTextData.bind(this, "maxWorkingPressurePSI")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.boreError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Bore")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("bore") || "", onChange: this.setTextData.bind(this, "bore")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.vvpError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "VVP")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("div", {className: "radio"}, 
									React.createElement("span", {className: "first " + (this.props.cylinder.get("vvp") === true ? "selected" : ""), onClick: this.changeVVP.bind(null, true)}, "Yes"), 
									React.createElement("span", {className: "last " + (this.props.cylinder.get("vvp") === true ? "" : "selected"), onClick: this.changeVVP.bind(null, false)}, "No")
								)
							)
						), 
						React.createElement("div", {className: "row" + (this.state.vvpModelError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "VVP Model")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("vvpModel") || "", onChange: this.setTextData.bind(this, "vvpModel")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.vvpSettingError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "VVP Setting")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("vvpSetting") || "", onChange: this.setTextData.bind(this, "vvpSetting")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.vvpTravelError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "VVP Travel")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.cylinder.get("vvpTravel") || "", onChange: this.setTextData.bind(this, "vvpTravel")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.cylinderConfigurationError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Cylinder Configuration")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {error: this.state.cylinderConfigurationError, list: this.state.cylinderConfigurations, onChange: this.changeCylinderConfiguration, selected: this.props.cylinder.get("cylinderConfigurationId")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.fixedVolumeError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Fixed Volume")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {error: this.state.fixedVolumeError, list: this.state.fixedVolumes, onChange: this.changeFixedVolume, selected: this.props.cylinder.get("fixedVolumeId")})
							)
						)
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("span", {className: "error-message" + (this.state.errorMessage === "" ? "" : " show")}, this.state.errorMessage)
							), 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", disabled: this.state.loading, onClick: this.reset, 'data-dismiss': "modal"}, "Close"), 
								React.createElement("button", {type: "button", className: "btn btn-primary", disabled: this.state.loading, onClick: this.save}, "Save")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("pages/equipmentProfile/details", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	EquipmentProfileDetailsModal = require("pages/equipmentProfile/equipmentProfileDetailsModal");

module.exports = React.createClass({displayName: 'exports',
    render: function() {
		var profile = this.props.profile;
        return React.createElement("div", {className: "details tab button-tab container-fluid" + (this.props.visible === false || this.props.profile.get("name") === undefined ? " hide" : "")}, 
			React.createElement("button", {type: "button", className: "btn btn-primary", 'data-toggle': "modal", 'data-target': "#equipment-profile-details-modal"}, "Edit"), 
			
			React.createElement("div", null, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Company"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("company")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Lube Cycle Time at Max RPM"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("cycleLubeCycleTimeAtMaxRpmSeconds") + " seconds")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Operating Area"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("operatingArea")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Max RPM"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("maxRpm"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Area"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("area")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Stroke"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("strokeInches") + " inches")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "LSD"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("lsd")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Rod Diameter"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("strokeInches") + " inches")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Compressor Type"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("compressorType")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Max Total Rod Load"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("maxTotalRodLoadPoundsPerSqInches") + " pounds per square inch")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Manufacturer"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("manufacturer")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Manual?"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("isManual") ? "Yes" : "No")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Model"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("model")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Frame Model"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("frameModel"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Serial Number"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("serial")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Frame Serial Number"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("frameSerialNumber"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Recycle Valve Open"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("recycleValveOpenPercentage") + "%")
				)
			), 
				
			React.createElement(EquipmentProfileDetailsModal, {profile: this.props.profile, isEdit: "true"})
		);
    }
});
});

require.register("pages/equipmentProfile/driverData", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	_ = require("underscore"),
	
	DriverDataModal = require("pages/equipmentProfile/driverDataModal"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
	render: function() {
		var profile = this.props.profile;
        return React.createElement("div", {className: "driver-data tab button-tab container-fluid" + (this.props.visible === false || this.props.profile.get("name") === undefined ? " hide" : "")}, 
			React.createElement("button", {type: "button", className: "btn btn-primary", 'data-toggle': "modal", 'data-target': "#driver-data-modal"}, "Edit"), 
			React.createElement("div", null, 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Driver Type"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("driverType")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Rated RPM"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("ratedRPM"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Fuel Type"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("fuelType")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Arrangement Number"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("arrangementNumber"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Manufacturer"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("manufacturer")), 
					React.createElement("div", {className: "details-label col-md-3"}, "Max HP at Sea Level"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("horsepower"))
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Turbo Charged?"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("isTurboCharged") ? "Yes" : "No"), 
					React.createElement("div", {className: "details-label col-md-3"}, "Manual?"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("isManual") ? "Yes" : "No")
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "details-label col-md-3"}, "Turbo Count"), 
					React.createElement("div", {className: "details-value col-md-3"}, profile.get("turboCount"))
				)
			), 
					
			React.createElement(DriverDataModal, {profile: profile})
		);
    }
});
});

require.register("pages/equipmentProfile/driverDataModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    Dropdown = require("components/dropdown"),

	Model = require("backbone").Model,
	
	EquipmentProfileDetailsActions = require("actions/equipmentProfileDetails"),
	
	DriverTypeStore = require("stores/driverType"),
	FuelTypeStore = require("stores/fuelType"),
	EquipmentProfileDetailsStore = require("stores/equipmentProfileDetails"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
			driverTypes: [],
			fuelTypes: [],
			
			loading: false,
			errorMessage: ""
        };
		
		function _buildModels(list) {
			return list.map(function(item) {
				return new Model({ name: item });
			});
		}
    },
	
	componentDidMount: function() {
		var me = this;
		DriverTypeStore.registerAndNotify(constants.components.DRIVER_DATA_MODAL, function(x) { me.setState({ driverTypes: x }); });
		FuelTypeStore.registerAndNotify(constants.components.DRIVER_DATA_MODAL, function(x) { me.setState({ fuelTypes: x }); });
		EquipmentProfileDetailsStore.register(constants.components.DRIVER_DATA_MODAL, function(x) { me.reset(); });
	},
	
	componentWillUnmount: function() {
		DriverTypeStore.unregister(constants.components.DRIVER_DATA_MODAL);
		FuelTypeStore.unregister(constants.components.DRIVER_DATA_MODAL);
	},
    
	setTextData: function(property, event) {
		this.props.profile.set(property, event.target.value);
		this.forceUpdate();
	},
	
	changeRadio: function(key, value) {
		this.props.profile.set(key, value);
		this.forceUpdate();
	},
	
	changeDropdown: function(key, value) {
		this.props.profile.set(key + "Id", value.get("id"));
		this.props.profile.set(key, value.get("name"));
		this.forceUpdate();
	},
	
	reset: function() {
		this.setState({
			loading: false,
			errorMessage: "",
			manufacturerError: false,
			turboCountError: false,
			ratedRPMError: false,
			arrangementNumberError: false,
			horsepowerError: false
		});
		
		$("#driver-data-modal").modal("hide");
	},
	
	save: function() {
		var profile = this.props.profile;
		var errors = profile.validate();
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(EquipmentProfileDetailsActions.update(profile));
        }
		
		function _setErrors(errors, context) {
            var newState = {}, keyed = errors.dict("key"), count = 0, message;
			for (var name in context.state)
				if (name.endsWith("Error")) {
					var error = keyed[name.replace("Error", "")];
					newState[name] = error !== undefined;
					if (error !== undefined) {
						if (count === 0)
							message = error.message;
						count++;
					}
				}
			newState.errorMessage = count === 0 ? "" : count === 1 ? message : "Please fix the fields outlined in red.";
            context.setState(newState);
		}
        
        function _getErrorKeys(errors) {
            var keys = {};
            for (var i = 0; i < errors.length; i++)
                keys[errors[i].key] = errors[i].message;
            return keys;
        }
	},
	
	render: function () {
        return React.createElement("div", {className: "modal fade", id: "driver-data-modal", tabindex: "-1", role: "dialog", 'aria-hidden': "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Edit Driver Data")
                    ), 
                    React.createElement("div", {className: "modal-body container-fluid"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Driver Type")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {list: this.state.driverTypes, onChange: this.changeDropdown.bind(null, "driverType"), selected: this.props.profile.get("driverTypeId")})
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Fuel Type")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement(Dropdown, {list: this.state.fuelTypes, onChange: this.changeDropdown.bind(null, "fuelType"), selected: this.props.profile.get("fuelTypeId")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.manufacturerError ? " has-error" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Manufacturer")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.profile.get("manufacturer") || "", onChange: this.setTextData.bind(this, "manufacturer")})
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Turbo Charged?")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("div", {className: "radio"}, 
									React.createElement("span", {className: "first " + (this.props.profile.get("isTurboCharged") === true ? "selected" : ""), onClick: this.changeRadio.bind(null, "isTurboCharged", true)}, "Yes"), 
									React.createElement("span", {className: "last " + (this.props.profile.get("isTurboCharged") === true ? "" : "selected"), onClick: this.changeRadio.bind(null, "isTurboCharged", false)}, "No")
								)
							)
						), 
						React.createElement("div", {className: "row" + (this.state.turboCountError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Turbo Count")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.profile.get("turboCount") || "", onChange: this.setTextData.bind(this, "turboCount")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.ratedRPMError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Rated RPM")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.profile.get("ratedRPM") || "", onChange: this.setTextData.bind(this, "ratedRPM")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.arrangementNumberError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Arrangement Number")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.profile.get("arrangementNumber") || "", onChange: this.setTextData.bind(this, "arrangementNumber")})
							)
						), 
						React.createElement("div", {className: "row" + (this.state.horsepowerError ? " has-error" : "") + (this.props.isEdit ? " hide" : "")}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Max HP at Sea Level")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("input", {type: "text", className: "form-control", value: this.props.profile.get("horsepower") || "", onChange: this.setTextData.bind(this, "horsepower")})
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4"}, 
								React.createElement("label", null, "Manual?")
							), 
							React.createElement("div", {className: "col-md-8"}, 
								React.createElement("div", {className: "radio"}, 
									React.createElement("span", {className: "first " + (this.props.profile.get("isManual") === true ? "selected" : ""), onClick: this.changeRadio.bind(null, "isManual", true)}, "Yes"), 
									React.createElement("span", {className: "last " + (this.props.profile.get("isManual") === true ? "" : "selected"), onClick: this.changeRadio.bind(null, "isManual", false)}, "No")
								)
							)
						)
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("span", {className: "error-message" + (this.state.errorMessage === "" ? "" : " show")}, this.state.errorMessage)
							), 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", disabled: this.state.loading, onClick: this.reset, 'data-dismiss': "modal"}, "Close"), 
								React.createElement("button", {type: "button", className: "btn btn-primary", disabled: this.state.loading, onClick: this.save}, "Save")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("pages/equipmentProfile/equipmentProfile", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	
	Details = require("pages/equipmentProfile/details"),
	CylinderConfiguration = require("pages/equipmentProfile/cylinderConfiguration"),
	DriverData = require("pages/equipmentProfile/driverData"),
	
	EquipmentProfileDetails = require("models/equipmentProfileDetails"),
	EquipmentProfileDetailsActions = require("actions/equipmentProfileDetails"),
	EquipmentProfileDetailsStore = require("stores/equipmentProfileDetails"),
	
	dispatcher = require("dispatcher/dispatcher"),
	constants = require("constants");

module.exports = React.createClass({displayName: 'exports',
	getInitialState: function() {
		var parts = window.location.hash.split("/");
		return {
			error: undefined,
			profile: new EquipmentProfileDetails(),
			tab: parts[parts.length-1]
		};
	},
	
	componentDidMount: function() {
		dispatcher.dispatch(EquipmentProfileDetailsActions.all({
			name: this.props.name
		}));
		
		var me = this;
		EquipmentProfileDetailsStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE, function(profiles) {
			if (profiles.length === 0)
				me.setState({ error: "No equipment profile with name \"" + me.props.name + "\" was found." });
			else
				me.setState({ error: undefined, profile: profiles[0] });
		});
	},
	
	componentWillUnmount: function() {
		EquipmentProfileDetailsStore.unregister(constants.components.EQUIPMENT_PROFILE);	
	},
	
	selectTab: function(tab) {
		var parts = window.location.hash.split("/");
		parts[parts.length-1] = tab;
		window.location.hash = parts.join("/");
		this.setState({ tab: tab });
	},
	
    render: function() {
        return React.createElement("div", {className: "container equipment-profile-container"}, 
            React.createElement("h2", null, this.props.name), 
			React.createElement("span", {className: "error" + (this.state.error === undefined ? "" : " show")}, this.state.error), 
			React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
				React.createElement("li", {role: "presentation", className: this.state.tab === "details" ? "active" : ""}, React.createElement("a", {onClick: this.selectTab.bind(null, "details")}, "Details")), 
				React.createElement("li", {role: "presentation", className: this.state.tab === "cylinder-configuration" ? "active" : ""}, React.createElement("a", {onClick: this.selectTab.bind(null, "cylinder-configuration")}, "Cylinder Configuration")), 
			  	React.createElement("li", {role: "presentation", className: this.state.tab === "driver-data" ? "active" : ""}, React.createElement("a", {onClick: this.selectTab.bind(null, "driver-data")}, "Driver Data")), 
				React.createElement("li", {role: "presentation", className: this.state.tab === "site-data" ? "active" : ""}, React.createElement("a", {onClick: this.selectTab.bind(null, "site-data")}, "Site Data")), 
				React.createElement("li", {role: "presentation", className: this.state.tab === "devices" ? "active" : ""}, React.createElement("a", {onClick: this.selectTab.bind(null, "devices")}, "Devices"))
			), 
			React.createElement("div", {className: "tab"}, 
				React.createElement(Details, {profile: this.state.profile, visible: this.state.tab === "details"}), 
				React.createElement(CylinderConfiguration, {profile: this.state.profile, visible: this.state.tab === "cylinder-configuration"}), 
				React.createElement(DriverData, {profile: this.state.profile, visible: this.state.tab === "driver-data"})
			)
        );
    }
});
});

require.register("pages/equipmentProfile/equipmentProfileDetailsModal", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
	ModalText = require("components/modalText"),
	ModalDropdown = require("components/modalDropdown"),
	ModalRadio = require("components/modalRadio"),

	Model = require("backbone").Model,
	
	EquipmentProfileDetailsActions = require("actions/equipmentProfileDetails"),

	CompressorTypeStore = require("stores/compressorType"),
	EquipmentProfileDetailsStore = require("stores/equipmentProfileDetails"),
	
	constants = require("constants"),
    dispatcher = require("dispatcher/dispatcher");

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
			compressorTypes: [],
			
			loading: false,
			errorMessage: "",
			
			manufacturerError: false,
			modelError: false,
			serialNumberError: false,
			recycleValveOpenError: false,
			lubeCycleTimeAtMaxRPMError: false,
			maxRPMError: false,
			strokeError: false,
			rodDiameterError: false,
			maxTotalRoadLoadError: false,
			frameModelError: false,
			frameSerialNumberError: false
        };
		
		function _buildModels(list) {
			return list.map(function(item) {
				return new Model({ name: item });
			});
		}
    },
	
	componentDidMount: function() {
		var me = this;
		CompressorTypeStore.registerAndNotify(constants.components.EQUIPMENT_PROFILE_MODAL, function(x) { me.setState({ compressorTypes: x }); });
		EquipmentProfileDetailsStore.register(constants.components.EQUIPMENT_PROFILE_MODAL, function(x) { me.reset(); });
	},
	
	componentWillUnmount: function() {
		CompressorTypeStore.unregister(constants.components.EQUIPMENT_PROFILE_MODAL);
		EquipmentProfileDetailsStore.unregister(constants.components.EQUIPMENT_PROFILE_MODAL);
	},
	
	changeRadio: function(key, value) {
		this.props.profile.set(key, value);
		this.forceUpdate();
	},
		
	reset: function() {
		this.setState({
			errorMessage: "",
			loading: false,
			manufacturerError: false,
			modelError: false,
			serialNumberError: false,
			recycleValveOpenError: false,
			lubeCycleTimeAtMaxRPMError: false,
			maxRPMError: false,
			strokeError: false,
			rodDiameterError: false,
			maxTotalRoadLoadError: false,
			frameModelError: false,
			frameSerialNumberError: false
		});
		
		$("#equipment-profile-details-modal").modal("hide");
	},
	
	save: function() {
		var profile = this.props.profile;
		var errors = profile.validate();
		_setErrors(errors, this);
		if (errors.length === 0) {
            var me = this;
            this.setState({ loading: true });
            dispatcher.dispatch(EquipmentProfileDetailsActions.update(profile));
        }
		
		function _setErrors(errors, context) {
            var newState = {}, keyed = errors.dict("key"), count = 0, message;
			for (var name in context.state)
				if (name.endsWith("Error")) {
					var error = keyed[name.replace("Error", "")];
					newState[name] = error !== undefined;
					if (error !== undefined) {
						if (count === 0)
							message = error.message;
						count++;
					}
				}
			newState.errorMessage = count === 0 ? "" : count === 1 ? message : "Please fix the fields outlined in red.";
            context.setState(newState);
		}
        
        function _getErrorKeys(errors) {
            var keys = {};
            for (var i = 0; i < errors.length; i++)
                keys[errors[i].key] = errors[i].message;
            return keys;
        }
	},
	
	render: function () {
        return React.createElement("div", {className: "modal fade", id: "equipment-profile-details-modal", tabindex: "-1", role: "dialog", 'aria-hidden': "true"}, 
          React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h4", {className: "modal-title", id: "myModalLabel"}, "Edit Driver Data")
                    ), 
                    React.createElement("div", {className: "modal-body container-fluid"}, 
						React.createElement(ModalDropdown, {model: this.props.profile, property: "compressorTypeId", list: this.state.compressorTypes, label: "Compressor Type"}), 
						React.createElement(ModalText, {model: this.props.profile, property: "manufacturer", label: "Manufacturer", error: this.state.manufacturerError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "model", label: "Model", error: this.state.modelError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "serial", label: "Serial Number", error: this.state.serialNumberError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "recycleValveOpenPercentage", label: "Recycle Valve Open (%)", error: this.state.recycleValveOpenError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "cycleLubeCycleTimeAtMaxRpmSeconds", label: "Lube Cycle Time (s)", error: this.state.lubeCycleTimeAtMaxRPMError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "maxRpm", label: "Max RPM", error: this.state.maxRPMError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "strokeInches", label: "Stroke (inches)", error: this.state.strokeError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "rodDiameterInches", label: "Rod Diameter (inches)", error: this.state.rodDiameterError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "maxTotalRodLoadPoundsPerSqInches", label: "Max Total Rod Load (psi)", error: this.state.maxTotalRoadLoadError}), 
						React.createElement(ModalRadio, {model: this.props.profile, property: "isManual", label: "Manual?"}), 
						React.createElement(ModalText, {model: this.props.profile, property: "frameModel", label: "Frame Model", error: this.state.frameModelError}), 
						React.createElement(ModalText, {model: this.props.profile, property: "frameSerialNumber", label: "Frame Serial Number", error: this.state.frameSerialNumberError})
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("span", {className: "error-message" + (this.state.errorMessage === "" ? "" : " show")}, this.state.errorMessage)
							), 
							React.createElement("div", {className: "col col-md-6"}, 
								React.createElement("button", {type: "button", className: "btn btn-default", disabled: this.state.loading, onClick: this.reset, 'data-dismiss': "modal"}, "Close"), 
								React.createElement("button", {type: "button", className: "btn btn-primary", disabled: this.state.loading, onClick: this.save}, "Save")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("pages/management", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    User = require("models/user"),
    UserModal = require("components/user/userModal"),
	DeleteUserModal = require("components/user/deleteUserModal"),
    UserList = require("components/user/userList"),
	UserFilter = require("components/user/userFilter"),
	
	RoleStore = require("stores/role"),
	CompanyStore = require("stores/company"),
	OperatingAreaStore = require("stores/operatingArea"),
	
	constants = require("constants");

var _roles, _companies, _operatingAreas;

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            user: new User(),
			filter: {}
        };
    },

	componentDidMount: function() {
		RoleStore.registerAndNotify(constants.components.MANAGEMENT, function(roles) { _roles = roles; });
		CompanyStore.registerAndNotify(constants.components.MANAGEMENT, function(companies) { _companies = companies; });
		OperatingAreaStore.registerAndNotify(constants.components.MANAGEMENT, function(operatingAreas) { _operatingAreas = operatingAreas; });
	},
	
	componentWillUnmount: function() {
		_.each([RoleStore, CompanyStore, OperatingAreaStore], function(store) {
			store.unregister(constants.components.MANAGEMENT);
		});
	},
	
	newUser: function() {
		this.setState({
			user: new User({
				role: _roles[0].get("name"),
				company: _companies[0].get("name"),
				operatingArea: _operatingAreas[0].get("name")
			}),
			isEdit: false
		});
	},
	
    editUser: function(user) {
		var copied = new User();
		for (var name in user.attributes)
			copied.set(name, user.get(name));
		this.setState({ user: copied, isEdit: true });
	},
	
	deleteUser: function(user) {
		this.setState({ user: user });	
	},
	
	updateFilter: function(filter) {
		this.setState({ filter: filter });
	},
    
    render: function() {
        return React.createElement("div", {className: "container management-container"}, 
            React.createElement("h2", null, "Management"), 
			React.createElement("div", {className: "actions"}, 
                React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.newUser, 'data-toggle': "modal", 'data-target': "#user-modal"}, "New User")
            ), 
			
			React.createElement(DeleteUserModal, {user: this.state.user}), 
			React.createElement(UserModal, {onSave: this.addUser, user: this.state.user, isEdit: this.state.isEdit}), 
			React.createElement(UserFilter, {onChange: this.updateFilter}), 
            React.createElement(UserList, {onEdit: this.editUser, onDelete: this.deleteUser, filter: this.state.filter})
        );
    }
});
});

require.register("router", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Backbone = require("backbone");

module.exports = Backbone.Marionette.AppRouter.extend({
    appRoutes: {
		"": "management",
        "management": "management",
        "company-hierarchies": "companyHierarchies",
		"equipment-profile/:name/:tab": "equipmentProfile",
    },
    
    onRoute: function(name, route) {
        $("header li.active").removeClass("active");
        $("header li[data-active-key='" + route + "']").addClass("active");
    }
});
});

require.register("stores/area", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Area = require("models/area"),
	BaseStore = require("stores/base"),
	
	constants = require("constants");

module.exports = new BaseStore(Area, constants.area, "fixtures/areas.json");
});

require.register("stores/base", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Config = require("config"),
	Backbone = require("backbone"),
	
	emitter = require("dispatcher/emitter"),
	dispatcher = require("dispatcher/dispatcher");

module.exports = function(model, constants, url, options) {
	var me = this;
	var Collection = Backbone.Collection.extend({ model: model, url: url });
	
	var _collection = new Collection,
		_registrants = {},
		_history = [],
		_sort = "name",
		_loaded = false;
	
	if (options && options.sort)
		_sort = options.sort;
	if (!(_sort instanceof Array))
		_sort = [_sort];
	
	_collection.comparator = _buildSortMethod(_sort);
	
	this.all = function(filter) {
		var me = this;
		return new Promise(function(resolve, reject) {
			_collection.fetch({
				data: filter,
				success: function(result, response) {
					var models = result.models;
					resolve(models);
					_loaded = true;
					me.notify();
				}
			});
		});
	};
	
	this.update = function(content) {
		var me = this;
		return new Promise(function(resolve) {
			setTimeout(function() {
				var model = _.find(_collection.models, function(x) { return x.get("id") === content.get("id"); });
				for (var name in model.attributes)
					model.set(name, content.get(name));
				resolve();
				me.notify();
			}, 500);
		});
	};
						   
	this.create = function(content) {
		var me = this;
		return new Promise(function(resolve) {
			setTimeout(function() {
				content.set("id", _.sortBy(_collection.models, function(x) { return x.id; })[_collection.models.length-1].get("id") + 1);
				_collection.add(content);
				resolve();
				me.notify();
			}, 500);
		});
	};
	
	this.remove = function(content) {
		var me = this;
		return new Promise(function(resolve) {
			setTimeout(function() {
				_collection.models = _.without(_collection.models, _.findWhere(_collection.models, { id: content.id }));
				resolve();
				me.notify();
			}, 500);
		});
	};
	
	this.register = function(key, registrants) {
		if (!(registrants instanceof Array))
			registrants = [registrants];
		
		if (_registrants[key] === undefined)
			_registrants[key] = [];
		
		_registrants[key] = _registrants[key].concat(registrants);
	};
	
	this.registerAndNotify = function(key, registrants) {
		this.register(key, registrants);
		this.notify();
	};
	
	this.notify = function() {
		if (!_loaded)
			return;
		
		_collection.sort();
		for (var name in _registrants)
			_.each(_registrants[name], function(registrant) {
				if (registrant !== undefined)
					registrant(_collection.models);
			});
	}
	
	this.unregister = function(key) {
		delete _registrants[key];
	};
	
	dispatcher.register(function(payload) {
		switch (payload.type) {
			case constants.ALL:
				me.all(payload.content);
				break;
			case constants.UPDATE:
				me.update(payload.content);
				break;
			case constants.CREATE:
				me.create(payload.content);
				break;
			case constants.REMOVE:
				me.remove(payload.content);
				break;
		}
	});
	
	function _buildSortMethod(sort) {
		return function(model) {
			var joined = "";
			_.each(sort, function(s) {
				var current = model.get(s);
				if (current.toLowerCase)
					current = current.toLowerCase();
				joined += current;
			});
			return joined;
		};
	}
};
});

require.register("stores/index", function(exports, require, module) {
var _ = require("underscore");

_.each([
    
], function(location) {
    require("stores/" + location);
});
});

require.register("utilities/errorHandler", function(exports, require, module) {
var _ = require("underscore");

module.exports = {
	handle: function(model) {
		var result = {}, flags = model.all(), errors = model.validate(), count = 0, message = "";
		_.each(errors, function(error) {
			flags[error.key] = true;
			message = ++count === 1 ? error.message : "Please fix the outlined fields.";
		});
		
		return { flags: flags, message: message, any: count > 0 };
	}
}
});

;require.register("utilities/validation", function(exports, require, module) {
module.exports = {
	required: function(value) {
		return value !== undefined && value !== "";
	},
	
	phone: function(value) {
		if (value)
			value = value.replace(/[\D]/g, "");
		return value === undefined || value.length === 10;
	},
	
	email: function(value) {
		return new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
	},
	
	positiveNumber: function(value) {
		if (value === undefined || value === "")
			return true;
		
		value = parseInt(value);
		return !isNaN(value) && value >= 1;
	}
}
});

;
//# sourceMappingURL=app.js.map