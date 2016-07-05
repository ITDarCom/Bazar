import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import "./template.html";
import "./non-responsive-inline.css";
import { Cities } from './../../../api/cities/collection.js'

SelectCity = new SimpleSchema({
	selectedCity: {
		type: String
	}
});

Template.itemsFilter.helpers({
	schema(){
		return SelectCity
	},
	options: function () {
		return Cities.find().fetch().map(function(city){
			return {label:city.label, value:city.identifier}
		})
	}
});

Template.itemsFilter.events({
	'change #itemsFilterForm': function(){
		Session.set('selectedCity', AutoForm.getFormValues('itemsFilterForm').insertDoc.selectedCity)
	}
})

Template.itemsFilter.onDestroyed(function(){
	Session.set('selectedCity',null)
    Session.set('searchText', null)
})

Template.itemsFilter.events({
	"input input[name='search']": function(target){
		const searchText = target.target.value
	    Session.set('searchText', searchText)
	}
})