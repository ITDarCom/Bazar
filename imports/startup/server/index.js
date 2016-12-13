import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Items } from './../../api/items/collection.js'
import { Shops } from './../../api/shops/collection.js'
import { Purchases } from './../../api/purchases/collection.js'
import { Categories } from './../../api/categories/collection.js'
import { Threads } from './../../api/threads/collection.js'
import {TAPi18n} from "meteor/tap:i18n";

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
	*/
	Items.update({}, { $set: { isRemoved: false } }, {multi:true})
	Shops.update({}, { $set: { isRemoved: false, unreadOrders:0, totalOrders:0, totalSales:0 } }, {multi:true})
	Meteor.users.update({}, {$set: { unreadInbox:0, pendingPurchases:0, unreadInbox:0, totalPurchases:0, cartItems:0}}, {multi:true})
	Purchases.remove({})
	Meteor.users.remove({})
	Items.remove({})
	Shops.remove({})
	Threads.update({}, { $set: { isRemoved: false } }, {multi:true})
	Threads.remove({})

	Accounts.emailTemplates.siteName = "ebazaar.online";

	Accounts.emailTemplates.resetPassword.from = function () {
	   // Overrides value set in Accounts.emailTemplates.from when resetting passwords
	   return "eBazaar Reset <no-reply@ebazaar.online>";
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

		if (options.profile)
			user.profile = options.profile;

		return user;
	});

	 if (Meteor.users.find().count() == 0){
		Meteor.call('generateFixtures')
	}
});