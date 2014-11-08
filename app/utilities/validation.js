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