module.exports = function(){


	this.Given(/^I have "([^"]*)" new unprocessed orders$/, function (count) {
		
		count = parseInt(count)

		if (count > 0){
			server.execute(function(userId, count){
				return Meteor.call('generateOrderItems', userId, count);			
			}, this.currentUser.userId, count)
		}

	});

	this.Then(/^I should see a list of "([^"]*)" order items$/, function (count) {
		count = parseInt(count)		
		
		var doesExist = browser.waitForExist(".purchase-items-list");
		expect(doesExist).toBe(true);

		const elements = browser.elements(".purchase-items-list > .order-item");
		expect(elements.value.length).toEqual(count);	
	});

	this.Given(/^I have "([^"]*)" past unprocessed orders$/, function (arg1) {
		pending();
	});

	this.Then(/^I should be redirected to "([^"]*)"$/, function (arg1) {
		pending();
	});

	this.Then(/^I should see "([^"]*)" success alert$/, function (arg1) {
		pending();
	});

	this.Given(/^I click "([^"]*)" in the confirmation box$/, function (confirmation) {
		var alert = client.alertText();
		expect(alert).not.toBeNull();
		if (confirmation.match(/ok/)){
			client.alertAccept();
		} else {
			client.alertDismiss();
		}
	});

	this.Given(/^I have "([^"]*)" processed orders$/, function (arg1) {
		pending();
	});

}