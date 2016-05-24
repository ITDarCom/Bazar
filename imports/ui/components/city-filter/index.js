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

Template.cityFilter.onDestroyed(function(){
	Session.set('selectedCity',null)
})

Template.search.events({
	"input input[name='search']": function(target){
		const searchText = target.target.value
	    Session.set('searchText', searchText)
	}
})

Template.search.onDestroyed(function(){
    Session.set('searchText', null)
})