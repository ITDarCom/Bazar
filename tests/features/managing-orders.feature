Feature: Managing orders

	As a shop owner
	So that I can manage ordres
	I want be notified about new orders, accepting and rejecting them, and accessing my history of sales

	Background:
		Given I am a registered user with a shop
		And I am logged in
		And I am on "home" page

	Scenario: Shop owner with no order items yet
		Given I have "0" new unprocessed orders	
		When I click app menu button			
		Then I should see "0" in the unread counter of "my-orders" in the app menu
		Then I should not see an unread mark on app menu

	Scenario: Shop owner with no order items yet
		Given I have "0" new unprocessed orders	
		When I click app menu button			
		When I click "my-orders" in the app menu
		Then I should see "no-items" message

	Scenario: Shop owner notified about a new order
		Given I have "2" new unprocessed orders	
		Then I should see an unread mark on app menu 
		Then I click app menu button
		Then I should see "2" in the unread counter of "my-orders" in the app menu

@watch

	Scenario: Shop owner reviewing his unprocessed orders
		Given I have "4" new unprocessed orders	
		When I click app menu button			
		When I click "my-orders" in the app menu
		Then I should be redirected to the "settings.orders" page
		And I should see a list of "4" order items
		And I should see "4" in the unread counter of "my-orders" in the app menu

	Scenario: Shop owner accepting an order
		Given I have "4" new unprocessed orders	
		And I am on "settings.orders" page
		When I click ".accept-order" button
		And I click app menu button
		Then I should see "3" in the unread counter of "my-orders" in the app menu
		Then I should see "order-processed" success alert

	Scenario: Shop owner confirming an order reject
		Given I have "4" new unprocessed orders	
		And I am on "settings.orders" page
		And I click ".reject-order" button
		And I click "ok" in the confirmation box
		And I click app menu button
		Then I should see "3" in the unread counter of "my-orders" in the app menu	
		Then I should see "order-processed" success alert	

	Scenario: Shop owner canceling an order reject
		Given I have "4" new unprocessed orders	
		And I am on "settings.orders" page
		And I click ".reject-order" button
		And I click "cancel" in the confirmation box
		And I click app menu button
		And I should see "4" in the unread counter of "my-orders" in the app menu				

	Scenario: Shop owner with no sold items yet
		Given I have "4" new unprocessed orders	
		And I am on "settings.sales" page
		Then I should see "no-items" message	
