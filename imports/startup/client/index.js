
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import {TAPi18n} from "meteor/tap:i18n";
import {moment} from 'meteor/momentjs:moment';

import {Push} from "meteor/raix:push"

import "./simple-schema-messages"
import "./accounts-config"

import "./../../ui/layouts/global"

import "./../../ui/pages/home"
import "./../../ui/pages/shops-index"
import "./../../ui/pages/categories-show"

import "./../../ui/pages/settings-account"
import "./../../ui/pages/settings-shop"
import "./../../ui/pages/settings-purchases"
import "./../../ui/pages/settings-orders"
import "./../../ui/pages/settings-orders-rejected"
import "./../../ui/pages/settings-sales"
import "./../../ui/pages/cart"

import "./../../ui/pages/shops-new"
import "./../../ui/pages/shops-show"
import "./../../ui/pages/items-new"
import "./../../ui/pages/items-edit"
import "./../../ui/pages/items-edit-images"
import "./../../ui/pages/items-show"
import "./../../ui/pages/favorites-show"

import "./../../ui/pages/inbox"
import "./../../ui/pages/inbox-thread"

import "./../../ui/pages/admin-announcements"
import "./../../ui/pages/admin-categories"
import "./../../ui/pages/admin-categories-edit"
import "./../../ui/pages/admin-cities"
import "./../../ui/pages/admin-users"
import "./../../ui/pages/admin-warning"

import "./../../ui/pages/about"

import "./../../ui/components/item-thumbnail"
import "./../../ui/components/endless-list"
import "./../../ui/components/purchases-list"
import "./../../ui/components/threads-list"
import "./../../ui/components/city-filter"
import "./../../ui/components/admin-tables"
import "./../../ui/components/file-input"

import "./routes"

Template.defaultPage.helpers({
	currentRoute() {
		return Router.current().route.getName()
	},
});


Meteor.startup(function () {

    TAPi18n.setLanguage("ar")
		.done(function () {
			Session.set("showLoadingIndicator", false);
		})
		.fail(function (error_message) {
			// Handle the situation
			console.log(error_message);
		});

	T9n.setLanguage("ar")

	moment.locale("ar")

	T9n.map('ar', {
  		email: 'بريد إلكتروني',
  		emailResetLink: "أرسل",
  		error: {
  			pwdsDontMatch: "كلمتي السر لا تتطابقان",
  			accounts: {
				'User not found': 'خطأ في اسم المستخدم أو كلمة السر!',
				'Incorrect password': 'خطأ في اسم المستخدم أو كلمة السر!',
				"Login forbidden": "خطأ في اسم المستخدم أو كلمة السر!"
  			}
  		}	
	});


	Push.Configure({
	  android: {
	    senderID: 238678216707,
	    alert: true,
	    badge: true,
	    sound: true,
	    vibrate: true,
	    clearNotifications: true
	    // icon: '',
	    // iconColor: ''
	  },
	  ios: {
	    alert: true,
	    badge: true,
	    sound: true
	  }
	});

	Push.debug = true;

	if (Push.push){
		
	    Push.push.on('notification', function(notification){

	    	if (!notification.foreground){
				if (notification.payload.route){
		        	const route = notification.payload.route
		        	const params = notification.payload.params || {}

		        	setTimeout(function(){
		        		Router.go(route)        		
		        	},0)
	        	}      		

	    	}

	    })
	}

        
})
