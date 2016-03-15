describe("Hello", function() {
    it("says hello to receiver", function() {
        expect(sayHello('Jane')).toBe("Hello, Jane!");
    });

    it("$ should be equal with jQuery", function(){
    	expect($).toBe(jQuery);
    })

    it("_ should be equal with window._", function(){
    	expect(window._).toBe(_);
    });
});
