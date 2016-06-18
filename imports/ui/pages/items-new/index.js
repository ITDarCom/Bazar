import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Items } from './../../../api/items/collection'
import { Shops } from './../../../api/shops/collection'
import { Categories } from './../../../api/categories/collection'

Template.itemsNewPage.helpers({
	shop(){
		return Shops.findOne(Meteor.user().shop)
	}	
})

AutoForm.addHooks('insertItemForm', {
	onSuccess: function(formType, result){
		if (!result) result = Router.current().params.itemId
		Router.go('items.show', { shop: Router.current().params.shop, itemId: result })			
	}
}, true);


Template.insertItemForm.helpers({
	formCollection(){
		return Items;
	},
	formType(){
		var route = Router.current().route.getName()
		if (route.match(/edit/)) return 'method-update'
		return 'method'
	},
	method(){
		var route = Router.current().route.getName()
		if (route.match(/edit/)) return 'items.update'
		return 'items.insert'
	},
	doc(){
		return Items.findOne(Router.current().params.itemId)
	},	
	categories: function () {
		return Categories.find().fetch().map(function(category){
			return {
				label: category.label,
				value: category.identifier
			}
		});
	}
})