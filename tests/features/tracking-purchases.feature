Feature: Tracking purchases

	As a user of the site,
	So that I can track my orders
	I want to be notified and know about the status of my orders

	Background:
		Given I am on the app
		And I am a registered user
		And I have submitted a cart

	Scenario: User reviewing his past purchases
		When I click 'my purchases' in the side menu
		Then I should be on the purchases page
		and I should see all my pending, accepted and rejected purchases

	Scenario: User notified real-time about a newly processed purchase order
		When the shop owner accepts or rejects any of my orders
		Then I should see a notification on the purchases with the number of processed orders
		And the notification should be removed after I visit the purchases page


	Scenario: User notified offline about a processed purchase order
		Receive message




