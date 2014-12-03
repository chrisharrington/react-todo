var Base = require("./base");

module.exports = new Base(
    require("models/todo"),
    require("constants").stores.todo,
    "fixtures/todos.json"
);