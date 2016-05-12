Feature: Managing cart

	As a user of the site,
	So that I can specify my order
	I want to add and delete items into the cart, specify any necessary info about my order and then finally submit my cart

	Background:
		Given I am on the app
		And I am a registered user

	Scenario: User adding an item into the cart
		Given I am on an item page
		When I click the 'add to cart' button
		Then I should be redirected to the cart
		And should see the item added to the cart

	Scenario: User removing an item from the cart
		Given I am on the cart page
		When I click the 'remove' button next to an item
		Then I should be see the item removed from the cart

	Scenario: User adding notes about an item
	Scenario: User specifying quantity of an item

	Scenario: User specifying delivery address
	Scenario: User specifying delivery date

	Scenario: User submitting cart without specifying all necessary info
		Given I am on the cart page
		And I have not specified any of the order info
		When I click 'submit'
		Then I should see validation error messages
	
	Scenario: User submitting cart successfully
		Given I am on the cart page
		And I have specified all order info
		When I click 'submit'
		Then I should be redirected to my purchased page



