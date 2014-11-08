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

var Routes = require("routes");

$(function () {
    React.renderComponent(new Routes(), document.body);
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

require.register("pages/test", function(exports, require, module) {
/** @jsx React.DOM */
/* jshint node: true */
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: 'exports',
    render: function() {
        return React.DOM.div(null, 
            React.DOM.span(null, "blah")
        );
    }
});
});

require.register("routes", function(exports, require, module) {
/** @jsx React.DOM */
var React = require("react"),
    Routes = require("react-router").Routes,
    Route = require("react-router").Route,
    
    Test = require("pages/test");

module.exports = React.createClass({displayName: 'exports',
    render: function() {
        return Routes({location: "hash"}, 
            Route({name: "test", handler: Test})
        );
    }
});
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