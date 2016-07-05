Feature: Managing shop

	As a shop owner
	So that I can manage my shop
	I want create and manage my shop info, in addition to creating and managing new items

	Background:

	Scenario: New user being able to create a shop 
		Given I am a registered user with no shop	
		And I am on "home" page
		And I am logged in
		Then I "should" see "create-shop" in the app menu
		Given I am on "settings.shop" page
		Then I "should" see ".create-shop" button

	Scenario: User can only create one shop
		Given I am a registered user with a shop
		And I am on "home" page
		And I am logged in
		When I click app menu button
		Then I "should not" see "create-shop" in the app menu

	Scenario: User creating a shop for the first time
		Given I am a registered user with no shop
		And I am logged in
		And I am on "shops.new" page
		When I enter "Coolest shop" in the "title" field
		And I enter "The best shop in the world" in the "description" textarea
		And I select "jeddah" in the "city" field
		And I submit the form
		Then I should be redirected to the "shops.show" page
		Then I should see "Coolest shop"
		And I should see "The best shop in the world"
		And I should see "no-items" message	

	Scenario: Shop owner editing his shop info
		Given I am a registered user with a shop
		And I am logged in		
		And I am on "settings.shop" page
		When I enter "New title" in the "title" field
		And I enter "New description" in the "description" textarea
		And I select "mecca" in the "city" field
		And I submit the form
		Given I am on "settings.shop" page
		Then I should see "New title" in the "title" field
		And I should see "New description" in the "description" field
		And I should see "mecca" in the "city" field
		Given I am on "my-shop" page
		Then I should see "New title"
		And I should see "New description"

	Scenario: Shop owner deleting his shop 
		Given I am a registered user with a shop
		And I am logged in		
		And I am on "settings.shop" page
		When I click ".delete-shop" button
		And I click "ok" in the confirmation box
		Then I "should" see ".create-shop" button 
		When I click app menu button
		Then I "should" see "create-shop" in the app menu

	Scenario: Shop owner clicking new item button from his shop page
		Given I am a registered user with a shop
		And I am logged in
		And I am on "my-shop" page
		And I click ".add-item" button
		Then I should be redirected to the "items.new" page
	
	Scenario: Shop owner adding a new item
		Given I am a registered user with a shop
		And I am logged in
		And I am on "my-shop" page
		And I click ".add-item" button
		Then I should be redirected to the "items.new" page
		When I enter "Delicious item" in the "title" field
		And I enter "The best thing to eat" in the "description" textarea
		And I enter "60" in the "price" field
		And I select "deserts" in the "category" field
		And I submit the form
		Then I should be redirected to the "items.show" page
		And I should see "Delicious item"
		And I should see "The best thing to eat"
		And I should see "60"

	Scenario: Shop owner editing an item from an item page
		Given I am a registered user with a shop
		And I am logged in
		And I on an item page I have created
		When I click ".edit-item" button
		Then I should be redirected to the "items.edit" page
		When I enter "New title" in the "title" field
		And I enter "New description" in the "description" textarea
		And I select "mashawee" in the "category" field
		And I submit the form
		Then I should be redirected to the "items.show" page
		Then I should see "New title" 
		And I should see "New description" 

	Scenario: Shop owner hiding an item		
		Given I am a registered user with a shop
		And there are "8" items in my shop
		And I am logged in
		And I am on "my-shop" page
		When I click ".hide-item" button
		Then I should see a list of "1" hidden items
		And I should see a list of "8" items
		When I am on "home" page
		Then I should see a list of "7" items

	Scenario: Shop owner hiding his shop
		Given I am a registered user with a shop
		And I am logged in
		And there are "8" items in my shop
		And I am on "settings.shop" page
		When I click ".hide-shop" button
		Given I am on "home" page
		Then I should see a list of "0" items		
		Given I am on "my-shop" page
		Then I should see a list of "8" hidden items		

	Scenario: User trying to edit an item he does not own
	Scenario: User trying to access new shop page while he already has a shop
	Scenario: User trying to access new item page for another shop
	Scenario: User trying to edit an item in his shop that does not exist		