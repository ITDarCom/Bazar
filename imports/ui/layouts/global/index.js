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
	});

	const navbarOffset = 80;
	//we scroll to the active focused input when window is resized
	//this also happens when soft keyboard appears
	window.addEventListener("resize", function(){
		setTimeout(function(){			
			const target = $(':focus').get(0)
			if (target){
				const rect = target.getBoundingClientRect()
				if (rect.top < 0 || rect.top < navbarOffset){
					scrollBy(0, rect.top - navbarOffset)
				}
			}
		}, 0)
	});

	//this is a fix for the problem of window resize on mobile 
	//the problem occures when address bar shows/hides
	//causing the scroll position to change
	window.addEventListener("resize", function(){
		const prevScrollPosition = window.scrollY
		setTimeout(function(){
			window.scrollTo(0, prevScrollPosition)			
		},0);
	});

	$.material.init()

})

Template.registerHelper('hasShop', function(){
    return Meteor.user() && Meteor.user().hasShop;
})

Template.registerHelper('currentShop', function(){
    return Meteor.user().shop;
})

Template.registerHelper('isShopOwner', function(){
	//returns if currentUser is shop owner of this shop
	if (Meteor.user() && Meteor.user().hasShop){
		if (Router.current().params.shop == Meteor.user().shop){
			return true
		} else {
			return false
		}
	} else {
		return false
	}
})

Template.registerHelper('unreadOrders', function(){
	var shop = Shops.findOne({ user: Meteor.userId() })
	return shop ? shop.unreadOrders : false ;    
})

Template.registerHelper('unreadItems', function(){
	if (!Meteor.user()){
		return false
	}
	var shop = Shops.findOne({ user: Meteor.userId() })
	var unreadOrders = shop ? shop.unreadOrders : false

	var unreadPersonalInbox = Meteor.user().unreadPersonalInbox
	var unreadShopInbox = Meteor.user().unreadShopInbox

	return unreadOrders || Meteor.user().unreadPurchases || unreadPersonalInbox || unreadShopInbox
})


Template.registerHelper('moment', function(string, format){
	if(!format) format = "dddd, DD-MM-YYYY"
	return moment((new Date(string)).getTime()).format(format);
})

Template.registerHelper('fromNow', function(string){
	return moment((new Date(string)).getTime()).fromNow();
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
