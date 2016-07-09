import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {Router} from 'meteor/iron:router'

import './template.html'

import { Shops } from './../../../api/shops/collection'
import { Cities } from './../../../api/cities/collection.js'

AutoForm.addHooks('insertShopForm', {
	onSuccess: function(formType, result){
		if (formType == 'method'){
			console.log(result)
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
		var route = Router.current().route.getName()
		if (route.match(/settings/)){
			return Shops.findOne(Meteor.user().shop)			
		}
	},
	isHidden(){
		return Shops.findOne(Meteor.user().shop).isHidden;
	},
	cities: function () {
		return Cities.find().fetch().map(function(city){
			return {label:city.label, value:city.identifier}
		})
	}
})

Template.insertShopForm.events({
    'click .cancel-btn'(){
        Router.go('shops.mine')
    }    
})