module.exports = function(){
	'use strict';


	this.Given(/^I am on an item page$/, function () {

		var items = server.execute(function(count, options){
            return Meteor.call('generateItems', count, options);         
        }, 1, {})

		client.execute(function(item){
			Router.go('items.show', { itemId: item._id, shop: item.shop })
		}, items[0])

		var doesExist = browser.waitForExist(".item-title");
		expect(doesExist).toBe(true);

	});


	this.Given(/^I have "([^"]*)" items in cart$/, function(count){
		count = parseInt(count)

		if (count > 0){

			var items = server.execute(function(count, options){
	            return Meteor.call('generateItems', count, options);         
	        }, count, {})

			server.execute(function(userId, count){
				return Meteor.call('generateCartItems', userId, count);			
			}, this.currentUser._id, count)
		}

		var cartItems = server.execute(function(){
			return Meteor.call('getCartItems');			
		})
		expect(cartItems.length).toEqual(count)
	});


	this.Then(/^I should see a list of "([^"]*)" cart items$/, function (count) {

		count = parseInt(count)		
		
		var doesExist = browser.waitForExist(".cart-items-list");
		expect(doesExist).toBe(true);

		const elements = browser.elements(".cart-items-list > .cart-item");
		expect(elements.value.length).toEqual(count);
	});


	this.Then(/^I should see a list of "([^"]*)" purchase items$/, function (count) {

		count = parseInt(count)		
		
		var doesExist = browser.waitForExist(".purchase-items-list");
		expect(doesExist).toBe(true);

		const elements = browser.elements(".purchase-items-list > .purchase-item");
		expect(elements.value.length).toEqual(count);
	});	


	this.Then(/^I should see "([^"]*)" message$/, function (message) {
		const selector = `.${message}-message`
		var doesExist = browser.waitForExist(selector);
		expect(doesExist).toBe(true);
	});

	this.Then(/^I should see "([^"]*)" form$/, function (form) {
		var doesExist = browser.waitForExist(`#${form}Form`);
		expect(doesExist).toBe(true);
	});

	this.Then(/^I should see "([^"]*)" input field$/, function (key) {
		var doesExist = browser.waitForExist(`input[name='${key}']`);
		expect(doesExist).toBe(true);
	});

	this.Then(/^I should see "([^"]*)" in the "([^"]*)" field$/, function (value, key) {
		var doesExist = browser.waitForExist(`body [name='${key}']`);
		expect(doesExist).toBe(true);

		var actualText = browser.getValue(`body [name='${key}']`);
		expect(actualText).toEqual(value);	

	});

	this.When(/^I wait for "([^"]*)" seconds$/, function (seconds) {
		seconds = parseInt(seconds)
		browser.pause(seconds * 1000);
	});


}