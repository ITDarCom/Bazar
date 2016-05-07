Feature: Managing purchases

	As a shop owner
	So that I can manage my shop
	I want create and manage my shop info, in addition to creating and managing new items

	Scenario: User creating a shop for the first time
		When I click 'create a shop' in the side menu
		Then I should be redirected to the 'settings - shop info' page
		And I should see the shop form

	Scenario: Shop owner editing his shop info
	Scenario: Shop owner deleting his shop 
	Scenario: Shop owner de-activiting his shop 


	Scenario: Shop owner creating a new item
		Given I have a shop

	Scenario: Shop owner editing an item 
		Given I have a shop		
		Given I have created an item

	Scenario: Shop owner hiding an item 		