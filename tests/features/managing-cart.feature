@watch

Feature: Managing cart

	As a user of the site,
	So that I can specify my order
	I want to add and delete items into the cart, specify any necessary info about my order and then finally submit my cart

	Background:
		Given I am a registered user with no shop	
		And I am logged in		

	Scenario: User adding an item into the cart
		Given I have "0" items in cart
		And I am on an item page
		When I click ".add-to-cart" button
		Then I should be redirected to the "cart" page
		Then I should see a list of "1" cart items

	Scenario: User removing an item from the cart
		Given I have "3" items in cart		
		And I am on the "cart" page
		When I click ".remove-cart-item" button
		Then I should see a list of "2" cart items

	Scenario: User viewing an empty cart
		Given I have "0" items in cart		
		And I am on the "cart" page
		Then I should see "no-cart-items" message
	
	Scenario: User adding notes and quantity about an item
		Given I am on the "cart" page
		And I have "1" items in cart
		When I enter "fresh please" in the "notes" field
		And I enter "5" in the "quantity" field		
		And I wait for "1" second
		And I go to "cart" page
		Then I should see "fresh please" in the "notes" field
		And I should see "5" in the "quantity" field
	
	Scenario: User deciding to submit a cart 
		Given I am on the "cart" page
		And I have "2" items in cart		
		And I click ".submit-cart" button
		Then I should see "deliveryInformation" form
		And I should see "defaultEmail@gmail.com" in the "email" field
		And I should see "4545484686" in the "phone" field
		And I should see "deliveryAddress" input field
		And I should see "deliveryDate" input field

	Scenario: User submitting a cart after specifying delivery information
		Given I have "1" items in cart		
		And I am on the "cart" page
		And I click ".submit-cart" button
		And I enter "email@gmail.com" in the "email" field
		And I enter "541254785" in the "phone" field
		And I enter "Near the city center" in the "deliveryAddress" field
		And I click ".submit-cart-final" button
		Then I should be redirected to the "settings.purchases" page
		And I should see a list of "1" purchase items
		And I should see "Near the city center" in "deliveryAddress"
		And I should see "pending" in "status"

	Scenario: User submitting a cart without specifying delivery information

