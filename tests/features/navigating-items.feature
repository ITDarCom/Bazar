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
		And there are "3" items
		Then I should see a list of "3" items 
		And items should be ordered by date

	Scenario: Visitor explores a category page
		Given there are "3" items under "desserts" category
		And I am on "desserts" category page
		Then I should see a list of "3" items 
		And items should be ordered by date

	Scenario: Visitor explores a specific item
		Given I am on "home" page	
		And there are "3" items		
		When I click on an item thumbnail
		Then I should be redirected to the "items.show" page

	Scenario: Visitor explores a specific item and view its photos
	Scenario: Visitor explores a specific item and then returns back 

	Scenario: Visitor explores more items of a list 
		Given I am on "home" page
		And there are "12" items
		Then I should see a list of "6" items 
		And I should see "#loading-more-items" div
		When I scroll to the end of the page and wait a bit
		Then I should see a list of "12" items 
		When I scroll to the end of the page and wait a bit		
		Then I should not see "#loading-more-items" div		

@watch
	Scenario: Visitor explores items of a list and filters it by specific keywords
		Given I am on "home" page
		When I enter "cookie" in the "keyword" field
		Then I should see items 

	Scenario: Visitor explores items of a list and filters it by a specific city
		Given there are "3" items in "jeddah" city
		And there are "3" items in "mecca" city
		And I am on "home" page
		Then I should see a list of "6" items		
		When I select "jeddah" in the "selectedCity" field
		Then I should see a list of "3" items

	Scenario: Visitor adding an item to favourites
	Scenario: Visitor sharing an item on social media
