import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection'

Template.adminCategoriesPage.helpers({
	formCollection(){
		return Categories;
	},
	categories(){
		return Categories.find({},{$sort: {createdAt: -1}})
	}

});

Template.adminCategoriesPage.events({
	"click .btn-delete": function (){

var identifier = this.identifier;
		$("#" + identifier).remove();
		Meteor.call("deleteCity",this._id);


	}
});
