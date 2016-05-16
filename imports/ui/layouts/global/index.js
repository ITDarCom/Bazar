import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Shops } from './../../../api/shops/collection.js'


Template.applicationLayout.onRendered(function(){

	//a small handler to hide menu when any menu link is clicked

	$(document).on('click', '.navmenu li', function(){
		$('.navmenu').offcanvas('toggle')
	})
})

Template.registerHelper('hasShop', function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.hasShop;
})

Template.registerHelper('unreadPurchases', function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.unreadPurchases;
})

Template.registerHelper('unreadOrders', function(){
	var shop = Shops.findOne({ user: Meteor.userId() })
	return shop.unreadOrders;    
})

Template.registerHelper('unreadItems', function(){
	if (!Meteor.user() || !Meteor.user().profile){
		return false
	}
	var shop = Shops.findOne({ user: Meteor.userId() })
	var unreadOrders = shop ? shop.unreadOrders : false
	return unreadOrders || Meteor.user().profile.unreadPurchases
})
