@watch
Feature: Managing purchases

	As a user of the site,
	So that I can track my purchases
	I want to be notified and know about the status of my purchases

	Background:
		Given I am a registered user with no shop
		And I am logged in
		And I am on "home" page

	Scenario: User notified about a new processed purchases
		Given I have "1" new processed purchases	
		Then I should see an unread mark on app menu 
		Then I click app menu button	
		Then I should see "1" in the unread counter of "my-purchases" in the app menu

	Scenario: User with no purchase items yet
		Given I have "0" new processed purchases
		Then I should not see an unread mark on app menu 
		Then I click app menu button				
		Then I should see "0" in the unread counter of "my-purchases" in the app menu

	Scenario: User with no purchase items yet
		Given I have "0" new processed purchases
		When I click app menu button	
		When I click "my-purchases" in the app menu
		Then I should see "no-items" message

	Scenario: User viewing a newly processed purchase
		Given I have "3" new processed purchases
		When I click app menu button					
		And I click "my-purchases" in the app menu
		Then I should be redirected to the "settings.purchases" page
		And I should see a list of "3" purchase items
		And I should see "0" in the unread counter of "my-purchases" in the app menu

