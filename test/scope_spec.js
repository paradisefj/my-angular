'use strict';
describe("Scope", function(){
	it("can be constructed and used as an object", function(){
		var scope = new Scope();
		scope.aProperty = 1;
		expect(scope.aProperty).toBe(1);
		
	});

});

describe('digest', function(){

	var scope;

	scope = new Scope();
	
})