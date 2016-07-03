function getRecipient(currentUser, thread){

	const author = thread.participants.find(p => {
		return ((p.id == currentUser._id) && (p.type == 'user')) ||
			((p.id == currentUser.shop) && (p.type == 'shop'))
	})

	const index = thread.participants.indexOf(author)
	const recipientIndex = index ? 0:1;
	return thread.participants[recipientIndex]
}

module.exports = function(){
	
	this.Given(/^I have "([^"]*)" messages in my "([^"]*)" inbox$/, function (count, inbox) {

		count = parseInt(count, 10)

		server.execute(function(currentUser, count, options){
			return Meteor.call('generateThreads', currentUser, count, options);         
		}, this.currentUser._id, count, {inbox: inbox});		

	});		

	this.Given(/^I have "([^"]*)" unread messages in my "([^"]*)" inbox$/, function (count, inbox) {
		count = parseInt(count, 10)

		server.execute(function(currentUser, count, options){
			return Meteor.call('generateThreads', currentUser, count, options);         
		}, this.currentUser._id, count, {inbox: inbox, unread: true });

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


	this.Then(/^the recipient of the current thread should be notified$/, function(){
		const threadId = client.execute(function(){
            return Router.current().params.thread
        }).value;

		const inboxType = client.execute(function(){
            return Router.current().params.inbox
        }).value;

        var thread = server.execute(function(threadId){
        	return Meteor.call('getThread', threadId)
        }, threadId);

		const currentUser = client.execute(function(){
            return Meteor.user()
        }).value;        

        const other = getRecipient(currentUser, thread)

        if (other.type == 'user'){

	        const otherUser = server.execute(function(other){
	        	return Meteor.call('getOriginalUser', other)
	        }, other);

        	expect(other.unread).toBe(true);
	        expect(otherUser.unreadInbox).toEqual(1)

        } else {

			const shopId = client.execute(function(){
	            return Meteor.user().shop
	        }).value;

	        const otherUser = server.execute(function(other){
	        	return Meteor.call('getOriginalUser', other)
	        }, other);

        	expect(other.unread).toBe(true);
	        expect(otherUser.unreadInbox).toEqual(1)
        }

	});

}