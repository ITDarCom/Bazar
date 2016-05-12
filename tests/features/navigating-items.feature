Feature: Navigating items

	As a visitor to the site,
	So that I can find the item the best suits my needs
	I want to explore, search items on the website.
	
	Background:
		Given I am on the app (not in settings area)

	Scenario: Visitor views all categories
		Then I should see all categories in navigation bar

	Scenario: Visitor navigates into a list of items
		Scenario: Visitor navigates into the home page
		Scenario: Visitor navigates into a category page

		When I click "home"
		Then I should see a spinner 
		Then I should see items 
		And I should see items ordered by last added

	Scenario: Visitor explores a specific item

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
