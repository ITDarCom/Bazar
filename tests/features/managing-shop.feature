Feature: Managing shop

	As a shop owner
	So that I can manage my shop
	I want create and manage my shop info, in addition to creating and managing new items

	Scenario: New user being able to create a shop 
		Given I am a registered user with no shop	
		And I am logged in
		And I am on the "home" page
		Then I "should" see "create-shop" in the app menu
		And I "should" see "create-shop" button in the shop settings

	Scenario: User can only create one shop
		Given I am a registered user with a shop
		And I am logged in
		And I am on the "home" page
		Then I "should not" see "create-shop" in the app menu
		And I should see shop edit form in the shop settings

	Scenario: User creating a shop for the first time
		Given I am a registered user with no shop
		And I am logged in
		And I am on the "shops.new" page
		When I enter "Coolest shop" in the "title" field
		And I enter "The best shop in the world" in the "description" textarea
		And I select an option in the "city" field
		And I submit the form
		Then I should be redirected to a shop page titled "Coolest shop"
		And the shop page should have no items

	Scenario: Shop owner editing his shop info
	Scenario: Shop owner deleting his shop 
	Scenario: Shop owner de-activiting his shop 

	Scenario: Shop owner creating a new item
	Scenario: Shop owner editing an item
	Scenario: Shop owner hiding an item		

