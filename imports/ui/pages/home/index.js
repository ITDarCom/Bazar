import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

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

SelectCity = new SimpleSchema({
	selectedCity: {
		type: String
	}
});

Template.cityFilter.helpers({
	schema(){
		return SelectCity
	},
	options: function () {
	return [
		{
			optgroup: "East coast",
			options: [
				{label: "jeddah", value: "jeddah"},
				{label: "mecca", value: "mecca"},
			]
		},
		{
			optgroup: "Middle",
			options: [
				{label: "riyad", value: "riyad"}
			]
		}
	];
	}
});

Template.cityFilter.events({
	'change #cityFilterForm': function(){
		Session.set('selectedCity', AutoForm.getFormValues('cityFilterForm').insertDoc.selectedCity)
	}
})