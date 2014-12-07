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