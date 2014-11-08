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