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
	defaultValue(){
		return Session.get('selectedCity')
	},
	selectedCityStyle(){
		const city = Cities.findOne({identifier: Session.get('selectedCity')})
		if (city && city.label.length > 8)
		return "width:80px; font-size:10px;"
		else 
			return "width:80px;"
	},
	searchText(){
		return Session.get('searchText')
	},
	schema(){
		return SelectCity
	},
	options: function () {
		return Cities.find({}, { sort: {order:1}}).fetch().map(function(city){
			return {label:city.label, value:city.identifier}
		})
	}
});

Template.itemsFilter.events({
	'change #itemsFilterForm': function(){
		Session.set('selectedCity', AutoForm.getFormValues('itemsFilterForm').insertDoc.selectedCity)
	}
})

Template.itemsFilter.onCreated(function(){

    //we reset our stored state whenever the route changes
    this.autorun(function () {
        var route = Router.current().route.getName()
        var params = Router.current().params        
        Session.set('searchText', null)
    })
	Session.set('searchText', null)

})

Template.itemsFilter.onDestroyed(function(){
	//WE KEEP SELECTED CITY
	//Session.set('selectedCity',null)
    Session.set('searchText', null)
})

Template.itemsFilter.events({
	"input input[name='search']": function(target){
		const searchText = target.target.value
	    Session.set('searchText', searchText)
	}
})