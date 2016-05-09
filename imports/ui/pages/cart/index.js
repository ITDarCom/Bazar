import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Router } from 'meteor/iron:router';
import { Purchases } from './../../../api/purchases/collection'


import './template.html'

Template.cart.helpers({
	empty(){
		return (Purchases.find().count() == 0)
	},
	purchases(){
		return Purchases.find({ status: 'cart' })
	}	
})

Template.cart.events({
	'click .submit-cart-btn': function (event, instance){
		Meteor.call('cart.submit')
		Router.go('settings.purchases')
	}
})

Template.cartItem.events({
	'click .remove-cart-item-btn': function (event, instance){
		Meteor.call('cart.removePurchase', instance.data._id)
	}	
})