import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router'
import { Shops } from './../../../api/shops/collection'

import './template.html'

Template.shopsShowPage.onCreated(function(){
	this.subscribe('singleShop', Router.current().params.shop)
})

Template.shopsShowPage.helpers({
	shop(){

		const shop = Shops.findOne(Router.current().params.shop)
		if (!shop){
			Router.go('shops.index'); return;
		}
		
		return Shops.findOne(Router.current().params.shop)
	}
})

Template.shopsShowPage.events({
	'click .back-btn'(event, instance){
		event.preventDefault()
		//Session.set('elementToScrollBack', null)		
		if (!Session.get('lastShoppingContext')){
			Router.go('shops.index')
		} else if (Session.get('lastShoppingContext') == Router.current().url){
			Router.go('shops.index')
		} else {
			Router.go(Session.get('lastShoppingContext'))			
		}
	},		
})