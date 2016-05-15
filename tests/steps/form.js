module.exports = function(){
	'use strict';


	this.When(/^I enter "([^"]*)" in the "([^"]*)" field$/,function (value, key) {

		var doesExist = browser.waitForExist(`input[name='${key}']`);
		expect(doesExist).toBe(true);

 		browser.setValue(`input[name='${key}']`, value);

	});

	this.When(/^I enter "([^"]*)" in the "([^"]*)" textarea$/,function (value, key) {

		var doesExist = browser.waitForExist(`textarea[name='${key}']`);
		expect(doesExist).toBe(true);

 		browser.setValue(`textarea[name='${key}']`, value);

	});


	this.When(/^I select an option in the "([^"]*)" field$/,function (key) {

		var doesExist = browser.waitForExist(`select[name='${key}']`);
		expect(doesExist).toBe(true);

		browser.click(`select[name='${key}']`)
		browser.click(`select[name='${key}'] option:last-child`)

		browser.pause(200);

	});			

	this.When(/^I submit the form$/, function () {
		var doesExist = browser.waitForExist(`button[type='submit']`);
		expect(doesExist).toBe(true);

		browser.click(`button[type='submit']`)

	});

	this.When(/^I click "([^"]*)" button$/, function (button) {
		var doesExist = browser.waitForExist(`${button}-btn`);
		browser.click(`${button}-btn`);
	});	

}