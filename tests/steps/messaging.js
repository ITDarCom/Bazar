module.exports = function(){
	
	this.Given(/^I have "([^"]*)" messages in my "([^"]*)" inbox$/, function (count, inbox) {

		count = parseInt(count, 10)

		server.execute(function(currentUser, count, options){
			return Meteor.call('generateThreads', currentUser, count, options);         
		}, this.currentUser, count, {inbox: inbox});		

	});		

	this.Given(/^I have "([^"]*)" unread messages in my "([^"]*)" inbox$/, function (count, inbox) {
		count = parseInt(count, 10)

		server.execute(function(currentUser, count, options){
			return Meteor.call('generateThreads', currentUser, count, options);         
		}, this.currentUser, count, {inbox: inbox, unread: true });

	});
	
	this.Then(/^I should see a list of "([^"]*)" threads$/, function (count) {
		    
        count = parseInt(count)     
        
        var doesExist = browser.waitForExist(".threads-list");
        expect(doesExist).toBe(true);

        const elements = browser.elements(".threads-list > .thread-preview");
        expect(elements.value.length).toEqual(count);
    
	});

	this.Then(/^I should see a list of "([^"]*)" unread threads$/, function (count) {
        count = parseInt(count)     
        
        var doesExist = browser.waitForExist(".threads-list");
        expect(doesExist).toBe(true);

        const elements = browser.elements(".threads-list > .thread-preview.unread-thread");
        expect(elements.value.length).toEqual(count);		
	});

	this.When(/^I click on an unread thread$/, function () {
		var doesExist = browser.waitForExist(".threads-list");
		browser.click(".threads-list > .thread-preview.unread-thread a");
	});

	this.When(/^I click on a thread$/, function () {
		var doesExist = browser.waitForExist(".threads-list");
		browser.click(".threads-list > .thread-preview a");
	});	

	this.When(/^I press enter$/, function () {

		client.execute(function(){
			var e = jQuery.Event("keypress");
			e.which = 13; //choose the one you want
			e.keyCode = 13;
			$("textarea").trigger(e);
		})
	});

	this.Then(/^the last message in the thread should be "([^"]*)"$/, function (text) {
		browser.waitForExist(".messages-list");
		var actualText = browser.getText(".messages-list > .message-container:last-child  .message-body");
		expect(actualText).toEqual(text);		
	});

	this.Then(/^I should see "([^"]*)" as a recipient$/, function (recipient) {
		browser.waitForExist(".thread-nav");
		var actualText = browser.getText(".recipient");
		expect(actualText).toEqual(recipient);
	});




}
