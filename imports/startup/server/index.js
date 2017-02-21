import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'
import { Categories } from './../../api/categories/collection.js'
import { Threads } from './../../api/threads/collection.js'
import {TAPi18n} from "meteor/tap:i18n";

import {Push} from "meteor/raix:push"

import './../../api/images'

//SimpleSchema.debug = true

import './../../api/shops/methods.js'
import './../../api/items/methods.js'
import './../../api/purchases/methods.js'
import './../../api/users/methods.js'
import './../../api/threads/methods.js'

import './../../api/users/publications.js'
import './../../api/users/methods.js'
import './../../api/categories/publications.js'
import './../../api/categories/methods.js'
import './../../api/cities/publications.js'
import './../../api/cities/methods.js'

import './../../api/items/publications.js'
import './../../api/shops/publications.js'
import './../../api/purchases/publications.js'
import './../../api/threads/publications.js'

import './../../api/generate-data.js'
import './../../ui/pages/admin-users/users-table.js'

Meteor.startup(() => {

	/* MIGRATION CODE  */
	/*
	Items.update({}, { $set: { isRemoved: false } }, {multi:true})
	Meteor.users.remove({})
	Items.remove({})
	Shops.remove({})
	Threads.update({}, { $set: { isRemoved: false } }, {multi:true})

	const shops = Shops.find({}).fetch()
	shops.forEach(function(shop){
		Meteor.users.update({shop:shop._id}, {$set: {shopTitle: shop.title }})
	})
	Shops.update({}, { $set: { isRemoved: false, unreadOrders:0, totalOrders:0, totalSales:0 } }, {multi:true})
	Purchases.remove({})
	Meteor.users.update({}, {$set: { unreadInbox:0, pendingPurchases:0, unreadInbox:0, totalPurchases:0, cartItems:0}}, {multi:true})
	Threads.remove({})
	*/

	Accounts.emailTemplates.siteName = "ebazaar.online";

	Accounts.emailTemplates.resetPassword.from = function () {
	   // Overrides value set in Accounts.emailTemplates.from when resetting passwords
	   return "support@ebazaar.online";
	};	

	Accounts.emailTemplates.resetPassword.text = function(user, url) {
		url = url.replace('#\/', '')
		console.log(url)
		return "Click this link to reset your password: \n" + url;
	}  	

	Accounts.onLogin(function(){
	    var userId = Meteor.userId();
	    Meteor.users.upsert({_id: userId}, {$set: {lastSignIn: new Date()}});
	});
	
	Accounts.onCreateUser(function(options, user) {

		user.avatar = '/default-avatar.png';
		user.hasShop = false;
    	user.registerdAt = new Date();

    	user.phone = options.profile.phone

		if (options.profile)
			user.profile = options.profile;

		return user;
	});

	 if (Meteor.users.find().count() == 0){
		Meteor.call('generateFixtures')
	}

	Push.Configure({
	  apn: {
	    certData: Assets.getText('Push.pem'),
	    keyData: Assets.getText('PushKey.pem'),
	    passphrase: 'Kebazaar2016',
	    production: true,
	    //gateway: 'gateway.push.apple.com',
	  },
	  gcm: {
	    apiKey: 'AAAAN5JUkAM:APA91bHKe49nfXkKlWzBhoAzSJetlgbrSCShY78OxjUYEe5M4JsggU39tIXsUeYr4flHd-wCz4_1eISSCZM9I-ZBiGR4GXasKUNmDXyFnW5B-AwJcccOgevWkvolzCGwUgIE8jcp5s7C',
	    projectNumber: 238678216707
	  },
	  production: true,
	  'sound': true,
	  'badge': true,
	  'alert': true,
	  'vibrate': true,
	  // 'sendInterval': 15000, Configurable interval between sending
	  // 'sendBatchSize': 1, Configurable number of notifications to send per batch
	  // 'keepNotifications': false,
	//
	});

});