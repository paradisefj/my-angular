describe("Scope", function(){
	it("can be constructed and used as an object", function(){
		var scope = new Scope();
		scope.aProperty = 1;
		expect(scope.aProperty).toBe(1);
		
	});

	describe('digest', function(){

		var scope;

		scope = new Scope();
		
		beforeEach(function(){
			scope = new Scope();
		});

		it("calls the listener function of a watch on first $digest", function(){//在第一次调用$digest时调用listener函数
			var watchFn = function(){
				return 'wat';
			};
			var listenerFn = jasmine.createSpy();
			scope.$watch(watchFn, listenerFn);

			scope.$digest();

			expect(listenerFn).toHaveBeenCalled();

		});

		it("calls the watch function with the scope as the argument", function(){//调用watch函数应该讲scope作为参数
			var watchFn = jasmine.createSpy();
			var listenerFn = function(){};
			scope.$watch(watchFn, listenerFn);

			scope.$digest();

			expect(watchFn).toHaveBeenCalledWith(scope);
		});

		it("calls the listener function when the watched value changes", function(){//当watch值发生变化的时候应该调用listener
			scope.someValue = 'a';
			scope.counter = 0;

			scope.$watch(
				function(scope){ return scope.someValue; },
				function(newValue, oldValue, scope){ scope.counter++; }
			);

			expect(scope.counter).toBe(0);

			scope.$digest();
			expect(scope.counter).toBe(1);

			scope.$digest();
			expect(scope.counter).toBe(1);

			scope.someValue = 'b';
			expect(scope.counter).toBe(1);

			scope.$digest();
			expect(scope.counter).toBe(2);

		});

		it("calls the listener when watch value is first undefined", function(){
			scope.counter = 0;

			scope.$watch(
				function(scope){ return scope.someValue;},
				function(newValue, oldValue, scope){ scope.counter++; }
				);

			scope.$digest();
			expect(scope.counter).toBe(1);
		});

		it("calls listener with new value as old value the first time", function(){
			scope.someValue = 123;
			var oldValueGiven;

			scope.$watch(
				function(scope) { return scope.someValue;},
				function(newValue, oldValue, scope) { oldValueGiven = oldValue; }
				);

			scope.$digest();
			expect(oldValueGiven).toBe(123);
		});

		it("may have watchers that omit the listener function", function(){//watch函数省略listener函数
			var watchFn = jasmine.createSpy().and.returnValue('something');
			scope.$watch(watchFn);

			scope.$digest();

			expect(watchFn).toHaveBeenCalled();

		});

		it("triggers chained watchers in the same digest", function(){
			scope.name = 'Jane';

			scope.$watch(
				function (scope){ return scope.nameUpper; },
				function(newValue, oldValue, scope){
					if(newValue){
						scope.initial = newValue.substring(0, 1) + ".";
					}
				});

			scope.$watch(
				function(scope) { return scope.name; },
				function(newValue, oldValue, scope){
					if(newValue){
						scope.nameUpper = newValue.toUpperCase();
					}
				});

			scope.$digest();
			expect(scope.initial).toBe('J.');

			scope.name = 'Bob';
			scope.$digest();
			expect(scope.initial).toBe('B.');
		});

		it("gives up on the watchers after 10 iterations", function(){
			scope.counterA = 0;
			scope.counterB = 0;

			scope.$watch(
				function(scope) { return scope.counterA; },
				function(newValue, oldValue, scope){
					scope.counterB ++;
					console.log(scope.counterB);
				});
			scope.$watch(
				function(scope) { return scope.counterB; },
				function(newValue, oldValue, scope){
					scope.counterA ++;
					console.log(scope.counterA);
				});

			expect(function() { scope.$digest(); }).toThrow();

		});
	});
});
