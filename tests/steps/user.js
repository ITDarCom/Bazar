const routes = [
	{ name: 'home', path: '/'},
	{ name: 'categories.show', path: '/categories/:category'},
	{ name: 'shops', path: '/shops'},
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

module.exports = function(){
	'use strict';

	this.Given(/^I am a visitor$/, function () {
		browser.url('http://localhost:3000');
		client.execute(function(){
			Accounts.logout()
		})
		browser.pause(500);
	});	

	this.Given(/^I am a registered user with no shop$/, function () {
		var userOptions = {
			email:'new.user@gmail.com', 
			password:'password'
		}

		var userId = server.execute(function(userOptions){
			return Accounts.createUser(userOptions)
		}, userOptions)

		userOptions.userId = userId
		
		this.currentUser = userOptions
	});

	this.Given(/^I am a registered user with a shop$/, function () {
		var userOptions = {
			email:'new.user@gmail.com', 
			password:'password'
		}

		var shopOptions = {
			title: 'PizzaHot', 
			description: 'blah blah blah', 
			city: 'jeddah'
		}

		var userId = server.execute(function(userOptions, shopOptions){
			return Meteor.call('createUserWithShop', userOptions, shopOptions);			
		}, userOptions, shopOptions)

		userOptions.userId = userId
		this.currentUser = userOptions
	});		

	this.Given(/^I am logged in$/, function () {
		browser.url('http://localhost:3000');
		client.execute(function(currentUser){
			Meteor.loginWithPassword(currentUser.email, currentUser.password)
		}, this.currentUser)
		browser.pause(500);
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

	this.When(/^I go to "([^"]*)" page$/, function (route) {
		browser.pause(100);
		var path = routes.find(x => x.name == route).path;
		browser.url('http://localhost:3000' + path);
	});

	this.Then(/^I should be redirected to the "([^"]*)" page$/, function (page) {
		browser.pause(100);		
		var route = client.execute(function(){
			return Router.current().route.getName()
		});
		expect(route.value).toEqual(page);
	});	




}