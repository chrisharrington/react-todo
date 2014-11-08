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