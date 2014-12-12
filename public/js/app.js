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

require.register("actions/todo/all", function(exports, require, module) {
"use strict";

var constants = require("constants");

module.exports = {
      
};
});

require.register("config", function(exports, require, module) {
module.exports = {
	fixtures: true
};
});

require.register("constants/components", function(exports, require, module) {
"use strict";

module.exports = {
    todo: "todo-component"
};
});

require.register("constants/index", function(exports, require, module) {
"use strict";

module.exports = {
    components: require("./components"),
    todo: require("./todo")
};
});

require.register("constants/todo", function(exports, require, module) {
module.exports = {
    change: "todos-changed",
    
    all: "all-todos",
    create: "create-todo",
    update: "update-todo",
    remove: "remove-todo"
};
});

require.register("dispatcher", function(exports, require, module) {
/* jshint node: true */
"use strict";

var Dispatcher = require("flux").Dispatcher;

module.exports = new Dispatcher();
});

require.register("emitter", function(exports, require, module) {
var EventEmitter = require("eventEmitter");

module.exports = new EventEmitter();
});

require.register("initialize", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

require("stores");

var React = require("react"),
    Todo = require("pages/todo");

$(function () {
    React.render(new Todo(), $("#app")[0]);
});
});

require.register("pages/todo/index", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react"),
    _ = require("underscore"),
    
    List = require("./list"),
    Modal = require("./modal"),
    
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").todo;

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            todos: []
        }  
    },

    componentWillMount: function() {
        emitter.on(constants.changed, function(todos) {
            this.setState({ todos: todos });
        }.bind(this));
    },
    
    componentDidMount: function() {
        dispatcher.dispatch({ type: constants.all });
    },
    
    componentsWillUnmount: function() {
        emitter.off(constants.all);
    },
    
    create: function() {
        this.refs.create.show();
    },
    
    renderList: function(complete) {
        return React.createElement(List, {todos: _.filter(this.state.todos, function(x) { return x.isComplete === complete; })});
    },
    
    render: function() {
        return React.createElement("div", {className: "container"}, 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-8"}, 
                    React.createElement("h2", null, "Todo List")
                ), 
                React.createElement("div", {className: "col-md-4"}, 
                    React.createElement("button", {type: "button", className: "btn btn-primary pull-right spacing-top", onClick: this.create}, "New Task")
                )
            ), 
                    
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("h3", {className: "spacing-bottom"}, "Incomplete"), 
                    this.renderList(false)
                ), 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("h3", {className: "spacing-bottom"}, "Complete"), 
                    this.renderList(true)
                )
            ), 
            
            React.createElement(Modal, {ref: "create"})
        );
    }
});
});

require.register("pages/todo/list/index", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var _ = require("underscore"),
    Item = require("./item");

module.exports = React.createClass({displayName: 'exports',
    renderItems: function() {
        return _.map(this.props.todos, function(todo) {
            return React.createElement(Item, {todo: todo});
        });
    },
    
    render: function() {
        return React.createElement("ul", {className: "list-group"}, 
            this.renderItems()
        );
    } 
});
});

require.register("pages/todo/list/item", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var constants = require("constants").todo,
    dispatcher = require("dispatcher");

module.exports = React.createClass({displayName: 'exports',
    toggle: function() {
        this.props.todo.isComplete = !this.props.todo.isComplete;
        dispatcher.dispatch({ type: constants.update, content: this.props.todo });
    },
    
    render: function() {
        return React.createElement("li", {className: "list-group-item pointer", onClick: this.toggle}, this.props.todo.name); 
    } 
});
});

require.register("pages/todo/modal", function(exports, require, module) {
/** @jsx React.DOM */
"use strict";

var React = require("react"),
    
    dispatcher = require("dispatcher"),
    emitter = require("emitter"),
    constants = require("constants").todo;

module.exports = React.createClass({displayName: 'exports',
    getInitialState: function() {
        return {
            visible: false,
            value: ""
        };
    },
    
    componentDidMount: function () {
        this.$el = $(this.getDOMNode());
        this.$el.on("hidden.bs.modal", this.reset);
        
        emitter.on(constants.changed, function() {
            this.$el.modal("hide");
        }.bind(this));
    },
    
    componentWillUnmount: function() {
        emitter.off(constants.changed);
    },

    show: function () {
        this.$el.modal("show");
    },

    reset: function() {
        this.setState({ value: "" });
    },
    
    save: function() {
        dispatcher.dispatch({ type: constants.create, content: { name: this.state.value, isComplete: false }});
    },
    
    onChange: function(e) {
        this.setState({ value: e.target.value });
    },
    
    render: function() {
		return React.createElement("div", {className: "modal fade", tabIndex: "-1", role: "dialog", 'aria-hidden': "true"}, 
            React.createElement("div", {className: "modal-dialog modal-sm"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        React.createElement("button", {type: "button", className: "close", 'data-dismiss': "modal"}, 
                            React.createElement("span", {'aria-hidden': "true"}, "×"), 
                            React.createElement("span", {className: "sr-only"}, "Close")
                        ), 
                        React.createElement("h3", {className: "modal-title"}, "New Task")
                    ), 
                    React.createElement("div", {className: "modal-body"}, 
                        React.createElement("input", {placeholder: "Task name...", type: "text", value: this.state.value, onChange: this.onChange})
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col col-md-12"}, 
								React.createElement("button", {type: "button", className: "btn btn-primary pull-right", onClick: this.save}, "Save"), 
                                React.createElement("button", {type: "button", className: "btn btn-default pull-right spacing-right", onClick: this.reset, 'data-dismiss': "modal"}, "Close")
							)
						)
                    )
                )
            )
        );
    }
});
});

require.register("stores/base", function(exports, require, module) {
"use strict";

var _ = require("underscore"),
    emitter = require("emitter"),
    dispatcher = require("dispatcher"),
    constants = require("constants");

module.exports = function(url, constants) {
    this._url = url;
    this._collection = [];
    
    $.get(this._url).then(function(data) {
        this._collection = data;
        _notify.call(this);
    }.bind(this));
    
    dispatcher.register(function(payload) {
        switch (payload.type) {
            case constants.all:
                this._all();
                break;
                
            case constants.update:
                this._update(payload.content);
                break;
                
            case constants.create:
                this._create(payload.content);
                break;
        }
    }.bind(this));
    
    this._all = function() {
        _notify.call(this);
    }.bind(this);
    
    this._update = function(content) {
        var found = _.find(this._collection, function(x) { return x.id === content.id; });
        for (var name in found)
            found[name] = content[name];
        _notify.call(this);
    };
    
    this._create = function(content) {
        content.id = _.max(this._collection, function(x) { return x.id; }).id + 1;
        this._collection.push(content);
        _notify.call(this);
    }
    
    function _notify() {
        emitter.emit(constants.changed, this._collection);
    }
};
});

require.register("stores/index", function(exports, require, module) {
module.exports = {
    todo: require("stores/todo")
};
});

require.register("stores/todo", function(exports, require, module) {
var Base = require("./base"),
    constants = require("constants").todo;

module.exports = new Base("fixtures/todos.json", constants);
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