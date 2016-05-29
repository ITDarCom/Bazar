import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import "./template.html";
import "./non-responsive-inline.css";

SelectCity = new SimpleSchema({
	selectedCity: {
		type: String
	}
});

Template.itemsFilter.helpers({
	schema(){
		return SelectCity
	},
	cityi18n(){
		return TAPi18n.__('city')
	},
	options: function () {
		return [
			{label: "جدة", value: "jeddah"},
			{label: "مكة", value: "mecca"},
		]
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