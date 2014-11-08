var BaseAction = require("actions/base");

describe("actions - base", function() {
	describe("all", function() {
		it("should return 'all' constant for type", function() {
			var all = "the all constant";
			expect(new BaseAction({ "ALL": all }).all().type).toEqual(all);
		});
		
		it("should have no content", function() {
			expect(new BaseAction({ "ALL": "the all constant" }).all().content).toBe(undefined);
		});
	});
	
	describe("create", function() {
		it("should return 'create' constant for type", function() {
			var create = "the create constant";
			expect(new BaseAction({ "CREATE": create }).create().type).toEqual(create);
		});
		
		it("should have passed content as 'content'", function() {
			var constant = "the create constant", content = "the create content";
			expect(new BaseAction({ "CREATE": constant }).create(content).content).toBe(content);
		});
	});
	
	describe("update", function() {
		it("should return 'update' constant for type", function() {
			var update = "the update constant";
			expect(new BaseAction({ "UPDATE": update }).update().type).toEqual(update);
		});
		
		it("should have passed content as 'content'", function() {
			var constant = "the update constant", content = "the update content";
			expect(new BaseAction({ "UPDATE": constant }).update(content).content).toBe(content);
		});
	});
});