String.prototype.endsWith = function(value) {
	if (value.length > this.length)
		return false;
	return value.length <= this.length && this.substr(this.length - value.length, value.length) === value;
};