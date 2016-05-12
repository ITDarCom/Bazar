const routes = [
	{ name: 'home', path: '/'},
	{ name: 'categories.show', path: '/categories/:category'},
	{ name: 'shops.index', path: '/shops'},
	{ name: 'shops.new', path: '/shops/new'},
	{ name: 'shops.show', path: '/shops/:shop'},
	{ name: 'items.new', path: '/shops/:shop/items/new'},
	{ name: 'items.show', path: '/shops/:shop/items/:itemId'},
	{ name: 'items.edit', path: '/shops/:shop/items/:itemId/edit'},
	{ name: 'settings.account', path: '/settings/account'},
	{ name: 'settings.purchases', path: '/settings/purchases'},
	{ name: 'settings.shop', path: '/settings/shop'},
	{ name: 'settings.orders', path: '/settings/orders'},
	{ name: 'settings.sales', path: '/settings/sales'},
	{ name: 'messages.index', path: '/messages'},
	{ name: 'messages.thread', path: '/messages/:thread'},
	{ name: 'cart', path: '/cart'},
	{ name: 'about', path: '/about'},
	{ name: 'contact', path: '/contact'},
	{ name: 'admin.categories', path: '/admin/categories'},
	{ name: 'admin.users', path: '/admin/users'},
]

module.exports = function () {  
	'use strict';

	this.Before(function() {
		server.execute(function(){
			Meteor.call('generateFixtures');			
		})
	});	

	this.Given(/^I am logged in as "([^"]*)"$/, function (arg1) {
		browser.url('http://localhost:3000');
		client.execute(function(){
			Meteor.loginWithPassword('user@gmail.com', 'password')
		})
		browser.pause(500);
	});


	this.Given(/^I am on the "([^"]*)" page$/, function (route) {
		var path = routes.find(x => x.name == route).path;
		browser.url('http://localhost:3000' + path);
		
	});

	this.When(/^I enter "([^"]*)" in the "([^"]*)" field$/, {timeout: 60 * 1000},function (value, key) {

		var doesExist = browser.waitForExist(`input[name='${key}']`);
		expect(doesExist).toBe(true);

 		browser.setValue(`input[name='${key}']`, value);

	});

	this.When(/^I submit the form$/, {timeout: 60 * 1000}, function () {
		var doesExist = browser.waitForExist(`button[type='submit']`);
		expect(doesExist).toBe(true);

		browser.click(`button[type='submit']`)

	});

	this.Then(/^I should see the "([^"]*)" category in the "([^"]*)" page$/, function (category, page) {

		browser.waitForExist("#categories-list");
		var actualText = browser.getText("#categories-list > li:last-child");
		expect(actualText).toContain(category);

	});


	this.Then(/^I should see the "([^"]*)" category in the main app navbar$/, function (category) {
		// Write the automation code here

		browser.url('http://localhost:3000');
		browser.waitForExist("#main-nav");

		var actualText = browser.getText("#main-nav > li:last-child");
		expect(actualText).toContain(category);
	});

};