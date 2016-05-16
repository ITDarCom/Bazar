module.exports = function(){
	
	this.Given(/^I have "([^"]*)" new processed purchases$/, function (count) {

		count = parseInt(count)

		if (count > 0){
			server.execute(function(userId, count){
				return Meteor.call('generatePurchaseItems', userId, count);			
			}, this.currentUser.userId, count)
		}

	});
	
	this.Then(/^I should see an unread mark on side menu$/, function () {		
		pending();
	});
	
	this.Then(/^I should see "([^"]*)" in the unread counter of "([^"]*)" in the side menu$/, function (count, menuItem) {		
		const selector = `#${menuItem} .counter`
		var doesExist = browser.waitForExist(selector);
		expect(doesExist).toBe(true);

		var actualText = browser.getText(selector);
		expect(actualText).toEqual(count);			
	});
	
	
	this.When(/^I click "([^"]*)" in the side menu$/, function (menuItem) {	
		const selector = `#${menuItem}`
		var doesExist = browser.waitForExist(selector);
		expect(doesExist).toBe(true);

		browser.click(selector);
	});
	
	this.Then(/^I should see a list of "([^"]*)" purchased items$/, function (arg1) {		
		pending();
	});
}