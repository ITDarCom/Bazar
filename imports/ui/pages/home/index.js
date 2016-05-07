import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection.js'

SelectCity = new SimpleSchema({
	selectedCity: {
		type: String
	}
});

Template.mainNav.helpers({
	categories(){
		return Categories.find({})
	}
})

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
		console.log('city change')
	}
})