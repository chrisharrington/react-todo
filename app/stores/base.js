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
		switch (payload.type || payload) {
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