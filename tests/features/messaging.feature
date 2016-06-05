Feature: Messaging

	As a user or shop owner
	In order to communicate any necessary info
	I should be able to contact other users and shop owners
	
	Scenario: User with no shop viewing his personal inbox
		Given I am a registered user with no shop	
		And I am logged in
		And I am on "home" page
		Then I "should" see "personal-inbox" in the app menu
		Then I "should not" see "shop-inbox" in the app menu

	Scenario: Shop owner viewing his personal and shop inboxes
		Given I am a registered user with a shop
		And I am logged in
		And I am on "home" page
		Then I "should" see "personal-inbox" in the app menu
		Then I "should" see "shop-inbox" in the app menu

	Scenario: User checking his personal inbox
		Given I am a registered user with no shop
		And I am logged in		
		And I have "3" messages in my "personal" inbox
		And I am on "inbox.personal" page
		Then I should see a list of "3" threads

	Scenario: Shop owner checking his shop inbox
		Given I am a registered user with a shop
		And I am logged in		
		And I have "4" messages in my "shop" inbox
		And I have "3" messages in my "personal" inbox		
		And I am on "inbox.personal" page
		Then I should see a list of "3" threads
		And I am on "inbox.shop" page
		Then I should see a list of "4" threads


	Scenario: User notified about a new message as an ordinary user
		Given I am a registered user with no shop
		And I have "3" messages in my "personal" inbox				
		And I have "3" unread messages in my "personal" inbox
		And I am logged in
		Then I should see an unread mark on app menu
		When I click app menu button
		Then I should see "3" in the unread counter of "personal-inbox" in the app menu
		When I am on "inbox.personal" page
		Then I should see a list of "6" threads
		And I should see a list of "3" unread threads
		When I click on an unread thread 
		And I go back
		And I click app menu button
		Then I should see a list of "2" unread threads
		Then I should see "2" in the unread counter of "personal-inbox" in the app menu

	Scenario: User notified about a new message as a shop owner
		Given I am a registered user with a shop
		And I have "3" messages in my "shop" inbox				
		And I have "3" unread messages in my "shop" inbox
		And I am logged in
		Then I should see an unread mark on app menu
		When I click app menu button
		Then I should see "3" in the unread counter of "shop-inbox" in the app menu
		When I am on "inbox.shop" page
		Then I should see a list of "6" threads
		And I should see a list of "3" unread threads
		When I click on an unread thread 
		And I go back
		And I click app menu button
		Then I should see a list of "2" unread threads
		Then I should see "2" in the unread counter of "shop-inbox" in the app menu

	Scenario: User replying to an existing thread (personal inbox)
		Given I am a registered user with no shop
		And I have "3" messages in my "personal" inbox				
		And I am logged in
		When I am on "inbox.personal" page
		When I click on a thread 
		When I enter "hi there you!" in the "message" textarea
		And I press enter
		Then I should see "" in the "message" field
		And the last message in the thread should be "hi there you!"

@watch
	Scenario: User replying to an existing thread (shop inbox)
		Given I am a registered user with a shop
		And I have "3" messages in my "shop" inbox				
		And I am logged in
		When I am on "inbox.shop" page
		When I click on a thread 
		When I enter "hi there you!" in the "message" textarea
		And I press enter
		Then I should see "" in the "message" field
		And the last message in the thread should be "hi there you!"		

	Scenario: User initiating a thread with a shop owner
		Given I am a registered user with no shop	
		And I am logged in
		And there is a shop titled "McDoos"
		And I am on "McDoos" shop page
		When I click ".message" button
		Then I should be redirected to the "threads.new" page
		And I should see "McDoos" as a recipient
		When I enter "hello" in the "message" textarea
		And I press enter
		Then I should see "" in the "message" field
		And I should see "hello"
		Then I should see a list of "1" messages

	Scenario: Shop owner initiating a thread with a user
		Given I am a registered user with a shop
		And I have "1" new unprocessed orders from "Ahmad"
		And I am logged in
		And I am on "settings.orders" page
		Then I should be redirected to the "threads.new" page
		And I should see "Ahmad" as a recipient
		When I enter "hello" in the "message" textarea
		And I press enter
		Then I should see "" in the "message" field
		And I should see "hello"

	Scenario: User replying to a new message as an ordinary user
	Scenario: User replying to a new message as a shop owner