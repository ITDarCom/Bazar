import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import "./template.html";

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