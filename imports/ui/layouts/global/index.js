import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {moment} from 'meteor/momentjs:moment';
import {TAPi18n} from "meteor/tap:i18n";


import './template.html'

import { Shops } from './../../../api/shops/collection.js'

Template.applicationLayout.onRendered(function(){

	//a small handler to hide menu when any menu link is clicked

	$(document).on('click', '.navmenu li', function(){
		$('.navmenu').offcanvas('toggle')
	})

	$.material.init()

})

Template.registerHelper('hasShop', function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.hasShop;
})

Template.registerHelper('currentShop', function(){
    return Meteor.user().profile.shop;
})

Template.registerHelper('isShopOwner', function(){
	//returns if currentUser is shop owner of this shop
	if (Meteor.user() && Meteor.user().profile.hasShop){
		if (Router.current().params.shop == Meteor.user().profile.shop){
			return true
		} else {
			return false
		}
	} else {
		return false
	}
})

Template.registerHelper('unreadPurchases', function(){
    return Meteor.user() && Meteor.user().profile && Meteor.user().profile.unreadPurchases;
})

Template.registerHelper('unreadOrders', function(){
	var shop = Shops.findOne({ user: Meteor.userId() })
	return shop ? shop.unreadOrders : false ;    
})

Template.registerHelper('unreadItems', function(){
	if (!Meteor.user() || !Meteor.user().profile){
		return false
	}
	var shop = Shops.findOne({ user: Meteor.userId() })
	var unreadOrders = shop ? shop.unreadOrders : false
	return unreadOrders || Meteor.user().profile.unreadPurchases
})


Template.registerHelper('moment', function(string, format){
	return moment((new Date(string)).getTime()).format("dddd, DD-MM-YYYY");
})

Template.registerHelper('i18n', function(key){
	return TAPi18n.__(key)
})

Template.registerHelper('cityLabel', function(identifier){
	const cities = [
		{label: "جدة", value: "jeddah"},
		{label: "مكة", value: "mecca"},
	]

	const city = cities.find(x => x.value == identifier)

	if (city) return city.label; else return false;
})
