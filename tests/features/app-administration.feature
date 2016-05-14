Feature: App administration

	As an admin of the app
	In order to manage the app,
	I want manage users, cities and categories

	Background:
		Given I am logged in as "admin"

	Scenario: Admin adding a category
		Given I am on the "admin.categories" page
		When I enter "Deserts" in the "label" field
		And I enter "desert" in the "identifier" field
		And I submit the form
		Then I should see the "Deserts" category in the "admin.categories" page
		And I should see the "Deserts" category in the main app navbar

	Scenario: Admin editing a category
	Scenario: Admin removing a category

	Scenario: Admin viewing users list
	Scenario: Admin logging in on behalf of a user
	Scenario: Admin blocking a user
