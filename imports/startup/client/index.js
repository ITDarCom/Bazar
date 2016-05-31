
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import "./routes"

import "./../../ui/layouts/global"

import "./../../ui/pages/home"
import "./../../ui/pages/shops-index"
import "./../../ui/pages/categories-show"

import "./../../ui/pages/settings-shop"
import "./../../ui/pages/settings-purchases"
import "./../../ui/pages/settings-orders"
import "./../../ui/pages/settings-sales"
import "./../../ui/pages/cart"

import "./../../ui/pages/shops-new"
import "./../../ui/pages/shops-show"
import "./../../ui/pages/items-new"
import "./../../ui/pages/items-edit"
import "./../../ui/pages/items-show"
import "./../../ui/pages/favorites-show"

import "./../../ui/pages/admin-categories"
import "./../../ui/pages/admin-users"

import "./../../ui/components/item-thumbnail"
import "./../../ui/components/endless-list"
import "./../../ui/components/purchases-list"
import "./../../ui/components/city-filter"


Template.defaultPage.helpers({
	currentRoute() {
		return Router.current().route.getName()
	},
});