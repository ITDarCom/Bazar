Feature: Managing cart

	As a user of the site,
	So that I can specify my order
	I want to add and delete items into the cart, specify any necessary info about my order and then finally submit my cart

	Background:
		Given I am a registered user

	Scenario: User adding an item into the cart
		Given I am on an item page
		And I have "0" items in cart
		When I click the "add-to-cart" button
		Then I should be redirected to the "cart" page
		Then I should see a list of "1" cart items

	Scenario: User removing an item from the cart
		Given I am on "cart" page
		And I have "2" items in cart		
		When I click the "remove-cart-item" button
		Then I should see a list of "1" cart items

	Scnario: User viewing an empty cart
		Given I have "0" items in cart		
		And I am on "cart" page
		Then I should see a list of "0" cart items

	Scenario: User adding notes about an item
		Given I am on "cart" page
		And I have "1" items in cart
		When I enter "fresh please" in the "notes" textarea
		And I go to "cart" page
		Then I should see "fresh please" in the "notes" textarea

	Scenario: User specifying quantity of an item
		Given I am on "cart" page
		And I have "1" items in cart
		When I choose "4" in the "quantity" select
		And I go to "cart" page
		Then I should see "4" in the "quantity" select
	
	Scenario: User deciding to submit a cart 
		Given I am on "cart" page
		And I have "2" items in cart		
		When I click "submit"
		Then I should see delivery-information form

	Scenario: User submitting a cart after specifying delivery information
		Given I am on "cart" page
		And I have "2" items in cart		
		And I click "submit"
		And I entered delivery date 
		And I entered delivery address
		And I click "submit"
		Then I should see "cart-submitted" success alert
		And I should be redirected to the "settings.purchases" page

	Scenario: User submitting a cart without specifying delivery information
		Given I am on "cart" page
		And I have "2" items in cart		
		And I click "submit"
		And I entered delivery date 
		And I entered delivery address
		And I click "submit"
		Then I should see "cart-not-submitted" danger alert