Feature: Managing orders

	As a shop owner
	So that I can manage ordres
	I want be notified about new orders, accepting and rejecting them, and accessing my history of sales

	Background:
		Given I am a registered user with a shop
		And I am logged in
		And I am on the "home" page

	Scenario: Shop owner notified about a new order
		Given I have "1" new unprocessed orders	
		And I have "3" past unprocessed orders	
		Then I should see an unread mark on side menu 
		And I should see "4" in the unread counter of "my-orders" in the side menu

	Scenario: Shop owner remains notified about unprocessed orders
		Given I have "4" past unprocessed orders	
		Then I should see an unread mark on side menu 
		And I should see "4" in the unread counter of "my-orders" in the side menu		

	Scenario: Shop owner reviewing his unprocessed orders
		Given I have "4" past unprocessed orders	
		When I click 'my-orders' in the side menu
		Then I should be redirected to "settings.orders"
		And I should see a list of "4" purchase items
		And I should see "4" in the unread counter of "my-orders" in the side menu

	Scenario: Shop owner accepting an order
		Given I have "4" past unprocessed orders	
		And I am on "settings.orders" page
		When I click the "accept-order" button
		Then I should see "order-processed" success alert
		And I should see "3" in the unread counter of "my-orders" in the side menu

	Scenario: Shop owner confirming an order reject
		Given I have "4" past unprocessed orders	
		And I am on "settings.orders" page
		And I click the "accept-order" button
		And I click "ok" in the confirmation box
		Then I should see "order-processed" success alert	
		And I should see "3" in the unread counter of "my-orders" in the side menu	

	Scenario: Shop owner canceling an order reject
		Given I have "4" past unprocessed orders	
		And I am on "settings.orders" page
		And I click the "accept-order" button
		And I click "cancel" in the confirmation box
		And I should see "4" in the unread counter of "my-orders" in the side menu				

	Scenario: Shop owner reviewing his history of sales
		Given I have "4" processed orders	
		And I am on "settings.sales" page
		Then I should see a list of "4" purchase items
