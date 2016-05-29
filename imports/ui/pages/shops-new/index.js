import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Shops } from './../../../api/shops/collection'

AutoForm.addHooks('insertShopForm', {
	onSuccess: function(formType, result){
		if (formType == 'method'){
			Router.go('shops.show', { shop: result })			
		}
	}

}, true);

Template.insertShopForm.helpers({
	formCollection(){
		return Shops;
	},
	formType(){
		var route = Router.current().route.getName()
		if (route.match(/settings/)) return 'method-update'
		return 'method'
	},
	method(){
		var route = Router.current().route.getName()
		if (route.match(/settings/)) return 'shops.update'
		return 'shops.insert';
	},
	doc(){
		return Shops.findOne(Meteor.user().profile.shop)
	},
	cities: function () {
		return [
			{label: "جدة", value: "jeddah"},
			{label: "مكة", value: "mecca"},
		]
	}
})