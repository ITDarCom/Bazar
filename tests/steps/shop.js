module.exports = function(){

	this.Then(/^I should see "([^"]*)"$/, function (text) {
		var doesExist = browser.waitForExist(".container");
		var actualText = browser.getText(".container");
		expect(actualText[0].indexOf(text)).not.toEqual(-1);
	});

	this.Then(/^I should see "([^"]*)" div$/, function (div) {
		var doesExist = browser.waitForExist(div);
		expect(doesExist).toBe(true);
	});	

	this.Then(/^I should not see "([^"]*)" div$/, function (div) {
		var doesNotExist = browser.waitForExist(div, undefined, true);
		expect(doesNotExist).toBe(true);
	});		

	this.Given(/^I on an item page I have created$/, function () {
		this.currentItem = server.execute(function(userId){
			return Meteor.call('createItemFromMyShop', userId);			
		}, this.currentUser.userId)

		client.execute(function(item){
  			Router.go('items.show', { itemId: item._id, shop: item.shop })
  		}, this.currentItem)
	});
}