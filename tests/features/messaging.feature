Feature: Messaging

	As a user or shop owner
	In order to communicate any necessary info
	I should be able to contact other users and shop owners

	Scenario: User with no shop viewing his personal inbox
		Given I am a registered user with no shop	
		And I am logged in
		And I am on "home" page
		Then I "should" see "personal-inbox" in the side menu
		Then I "should not" see "shop-inbox" in the side menu

	Scenario: Shop owner viewing his personal and shop inboxes
		Given I am a registered user with a shop
		And I am logged in
		And I am on "home" page
		Then I "should" see "personal-inbox" in the side menu
		Then I "should" see "shop-inbox" in the side menu

	Scenario: User initiating a thread with a shop owner
		Given I am a user 
		And I am logged in
		And I am on "McDoos" shop page
		When I click "message" button
		Then I should be redirected to a new message thread with "McDoos" shop owner

	Scenario: Shop owner initiating a thread with a user
		Given I am a shop owner
		And I am logged in
		And I receied an order from a user named "Ahmad"
		And I am on "settings.order" page
		When I click "message" button next to an item ordered by "Ahmad"
		Then I should be redirected to a new message thread with "Ahmad" user

	Scenario: User notified about a new message as an ordinary user
		Given I am a registered user with no shop
		And I have been sent a message from "Ahmad"
		And I am on "home" page
		Then I should see a red mark on menu toggle
		And I should see a a notification next to "personal-inbox" in the side menu

	Scenario: User notified about a new message as a shop owner
		Given I am a registered user with a shop
		And I have been sent a message from "Ahmad"
		And I am on "home" page
		Then I should see a red mark on menu toggle
		And I should see a a notification next to "shop-inbox" in the side menu

	Scenario: User replying to a new message as an ordinary user
	Scenario: User replying to a new message as a shop owner