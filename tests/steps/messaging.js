module.exports = function(){
	
	this.Given(/^I have "([^"]*)" messages in my "([^"]*)" inbox$/, function (count, inbox) {

		count = parseInt(count, 10)

		server.execute(function(currentUser, count, options){
			return Meteor.call('generateThreads', currentUser, count, options);         
		}, this.currentUser, count, {inbox: inbox});
		

	});		
	
	this.Then(/^I should see a list of "([^"]*)" threads$/, function (count) {
		    
        count = parseInt(count)     
        
        var doesExist = browser.waitForExist(".threads-list");
        expect(doesExist).toBe(true);

        const elements = browser.elements(".threads-list > .thread-preview");
        expect(elements.value.length).toEqual(count);
    
	});
}
