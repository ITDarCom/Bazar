import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {moment} from 'meteor/momentjs:moment';
import {TAPi18n} from "meteor/tap:i18n";


import './template.html'

import { Shops } from './../../../api/shops/collection.js'
import { Cities } from './../../../api/cities/collection.js'


Template.login.onRendered(function(){
	$('.btn').addClass('btn-raised btn-warning')
})

Template.signup.onRendered(function(){
	$('.btn').addClass('btn-raised btn-warning')
})

Template.changePwd.onRendered(function(){
	$('.btn').addClass('btn-raised btn-warning')
	$('fieldset').append(`<div class="btn btn-block cancel-btn">${TAPi18n.__('cancel')}</div>`)
})

Template.forgotPwd.onRendered(function(){
	$('.btn').addClass('btn-raised btn-warning')
	$('fieldset').append(`<div class="btn btn-block cancel-btn">${TAPi18n.__('cancel')}</div>`)
})

Template.resetPwd.onRendered(function(){
	$('.btn').addClass('btn-raised btn-warning')
})

Template.changePwd.events({
	'click .cancel-btn'(){
		Router.go('settings.account')
	}
})

Template.changePwd.events({
	'click .cancel-btn'(){
		Router.go('home')
	}
})

var menuOpen = false

Template.applicationLayout.onRendered(function(){

	function toggleMenu(){
		menuOpen = !menuOpen
	    $('.row-offcanvas').toggleClass('active')
	    $('.navbar.navbar-fixed-top').toggleClass('active')
    	$('.navmenu-fixed-right').toggleClass('inactive')
	    $('.navmenu').toggleClass('offcanvas')
	}

	function hideMenu(){
	    $('.row-offcanvas').removeClass('active')
	    $('.navmenu').addClass('offcanvas')
	    $('.navmenu-fixed-right').css('display', '')	
	}

	$(document).ready(function () {

		//a small handler to hide menu when any menu link is clicked
		$(window).click(function(e){
			//if user is not clicking on app menu toggle button
			if (e.target && !e.target.className.match(/icon-bar|navbar-toggle/)){
				//if user is not clicking on menu area
				if (!e.target.className.match(/navmenu/)){
					hideMenu()					
				}
			}
		});	

		$('[data-toggle="offcanvas"]').click(function () {
			toggleMenu()
		});

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
    return Shops.findOne(Meteor.user().shop);
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
	const shop = Shops.findOne({ user: Meteor.userId() })
	const unreadOrders = shop ? shop.unreadOrders : false

	const unreadInbox = Meteor.user().unreadInbox

	return unreadOrders || Meteor.user().unreadPurchases || unreadInbox
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
	var city = Cities.findOne({identifier:identifier});
	return city.label;
})
Template.registerHelper('isAdmin', function(){

	return (Meteor.user() && Meteor.user().isAdmin);

})
