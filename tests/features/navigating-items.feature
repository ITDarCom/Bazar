Feature: Navigating items

	As a visitor to the site,
	So that I can find the item the best suits my needs
	I want to explore, search items on the website.

	
	Background:
		Given I am a visitor

	Scenario: Visitor views all categories
		Given I am on "home" page
		Then I should see all categories in navigation bar

	Scenario: Visitor explores home page
		Given I am on "home" page
		Then I should see a list of items 
		And items should be ordered by date

	Scenario: Visitor explores a category page
		Given I am on "home" page	
		When I click on a category from the main navbar
		Then I should see a list of items 
		And items should be ordered by date

	Scenario: Visitor explores a specific item
		Given I am on "home" page	
		When I click on an item thumbnail
		Then I should see full item description

	Scenario: Visitor explores a specific item and view its photos

	Scenario: Visitor explores a specific item and then returns back 
		Given I am on a list page
		And I clicked on an item
		When I click back
		And I should return to the same position instantly
		
	Scenario: Visitor explores more items of a list 
		Given I am on a list of items page
		When I scroll to the end of the page
		Then I should see a loading more spinner
		And I should see new items

	Scenario: Visitor explores items of a list and filters it by specific keywords
		Given I am on a list page
		When I type in the search box
		Then I should see a spinner
		Then I should see items 

	Scenario: Visitor explores items of a list and filters it by a specific city
		Given I am on a list page
		When I choose a city 
		Then I should see a spinner
		Then should see items

	Scenario: Visitor adding an item to favourites
	Scenario: Visitor sharing an item on social media
