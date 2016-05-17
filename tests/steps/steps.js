module.exports = function () {  
	'use strict';

	this.Before(function() {
		server.execute(function(){
			Meteor.call('generateFixtures');			
		})
	});	

	this.Then(/^I "([^"]*)" see "([^"]*)" in the app menu$/, function (should, menuItem) {

		should = (should == "should")? true : false

		if (should){
			var doesExist = browser.waitForExist(`#${menuItem}`);
			expect(doesExist).toBe(true)			
		} else {
			var doesNotExist = browser.waitForExist(`#${menuItem}`, undefined, true)
			expect(doesNotExist).toBe(true);
		}

	});	

	this.Then(/^I "([^"]*)" see "([^"]*)" button$/, function (should, button) {
		should = (should == "should")? true : false
		var doesExist = browser.waitForExist(`${button}-btn`);
		expect(doesExist).toBe(should)
	});

	this.Then(/^I should see all categories in navigation bar$/, function () {

		browser.waitForExist("#main-nav");

		var categories = server.execute(function(){
			return Meteor.call('getCategories');			
		})

		const elements = browser.elements("#main-nav > li.category");
		expect(elements.value.length).toEqual(categories.length);

	});

	this.Then(/^I should see a list of items$/, function () {

		var doesExist = browser.waitForExist(".endless-list");
		expect(doesExist).toBe(true);

		const elements = browser.elements(".endless-list > li.item-thumbnail");
		expect(elements.value.length).toBeGreaterThan(6);

	});


	this.Then(/^I should see a list of shops$/, function () {

		var doesExist = browser.waitForExist(".endless-list");
		expect(doesExist).toBe(true);

		const elements = browser.elements(".endless-list > li.shop-thumbnail");
		expect(elements.value.length).toBeGreaterThan(0);

	});	

	this.When(/^I click on a category from the main navbar$/, function () {
		browser.click("#main-nav > li.category:last-child");
	});


	this.When(/^I click on an item thumbnail$/, function () {

		var doesExist = browser.waitForExist(".endless-list");
		browser.click(".endless-list > li.item-thumbnail a");

	});

	this.When(/^I click on a shop thumbnail$/, function () {

		var doesExist = browser.waitForExist(".endless-list");
		browser.click(".endless-list > li.shop-thumbnail a");

	});	

	this.Then(/^I should be redirected to a shop page titled "([^"]*)"$/, function (title) {

		var doesExist = browser.waitForExist(".shop-title");
		expect(doesExist).toBe(true);

		var actualText = browser.getText(".shop-title");
		expect(actualText).toEqual(title);		

	});

	this.Then(/^I should see the "([^"]*)" category in the "([^"]*)" page$/, function (category, page) {

		browser.waitForExist("#categories-list");
		var actualText = browser.getText("#categories-list > li:last-child");
		expect(actualText).toContain(category);

	});


	this.Then(/^I should see the "([^"]*)" category in the main app navbar$/, function (category) {

		browser.url('http://localhost:3000');
		browser.waitForExist("#main-nav");

		var actualText = browser.getText("#main-nav > li:last-child");
		expect(actualText).toContain(category);
	});

};