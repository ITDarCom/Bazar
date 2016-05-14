Feature: Managing purchases

	As a user of the site,
	So that I can track my purchases
	I want to be notified and know about the status of my purchases

	Background:
		Given I am a registered user 
		And I am logged in
		And I am on the "home" page

	Scenario: User notified about a new processed purchases
		Given I have "1" new processed purchases	
		Then I should see an unread mark on side menu 
		And I should see "1" in the unread counter of "my-purchases" in the side menu

	Scenario: User viewing a newly processed purchase
		Given I have "1" new processed purchases	
		And I have "3" past processed purchases
		When I click 'my-purchases' in the side menu
		Then I should be redirected to "settings.purchases"
		And I should see a list of "4" purchased items
		And I should see "0" in the unread counter of "my-purchases" in the side menu

	Scenario: User viewing a collection of newly processed purchases
		Given I have "3" new processed purchases
		And I have "3" past processed purchases		
		When I click 'my-purchases' in the side menu
		Then I should be redirected to "settings.purchases"
		And I should see a list of "6" purchased items
		And I should see "0" in the unread counter of "my-purchases" in the side menu