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