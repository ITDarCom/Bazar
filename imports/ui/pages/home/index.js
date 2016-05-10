import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection.js'
import { Shops } from './../../../api/shops/collection.js'

Template.mainNav.helpers({
	categories(){
		return Categories.find({})
	}
})

Template.settingsNav.helpers({
	unprocessedOrders(){
		var shop = Shops.findOne({ user: Meteor.userId() })
		if (shop) return shop.unprocessedOrders;
		return false
	}
})