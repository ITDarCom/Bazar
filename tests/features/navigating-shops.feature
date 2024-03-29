Feature: Navigating shops

	As a visitor to the site,
	So that I can find the item the best suits my needs
	I want to explore, search items on the website.
	
	Background:
		Given I am on "home" page

	Scenario: Visitor explores shops
		Given I am on "shops" page
		Then I should see a list of shops 
		And shops should be ordered alphabetically
	
	Scenario: Visitor explores more shops
		Given I am on shops list
		When I scroll to the end of the page
		Then I should see a loading more spinner
		And I should see new items

	Scenario: Visitor explores shops and filters them by specific keywords
		Given I am on a list page
		When I type in the search box
		Then I should see a spinner
		Then I should see items 

	Scenario: Visitor explores shops and filters them by a specific city
		Given I am on a list page
		When I choose a city 
		Then I should see a spinner
		Then should see items

	Scenario: Visitor explores a specific shop and returns back
		
		Given I am on shops list
		And I clicked on a shop
		When I click back
		And I should return to the same position instantly

	Scenario: Visitor explores items of a specific shop 
		Given I am on "shops" page
		When I click on a shop thumbnail
		Then I should see a list of items 
		And items should be ordered by date

	Scenario: Visitor explores more items of a specific shop 
		
		Given I am on a shop page
		When I scroll to the end of the page
		Then I should see a loading more spinner
		And I should see new items

	Scenario: User trying to access a shop that does not exist
