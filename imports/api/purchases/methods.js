import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Purchases } from './collection'
import { Items } from './../items/collection'
import { Shops } from './../shops/collection'

Meteor.methods({

	'purchases.addToCart'(itemId) {

		check(itemId, String);

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var item = Items.findOne(itemId)

		if (item){

			Purchases.insert({
				item: itemId,
				user: this.userId,
				shop: item.shop,
				status: 'cart',
				createdAt: new Date()
			})

		}
	},

	'purchases.submitCart'(){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var cartItems = Purchases.find({user: this.userId, status: 'cart'})

		cartItems.forEach(function(item){
			//notify shop owner
			var shopId = Shops.update(item.shop, { $inc: { unprocessedOrders: 1 }})			
		})

		Purchases.update({user: this.userId, status: 'cart'}, 
			{ $set: { status: 'pending' }},
			{ multi: true })

	},

	'orders.process'(purchaseId, status){

		check(purchaseId, String);
		check(status, String);

		if (!status.match(/accepted|rejected/)){
			throw new Meteor.Error(`processed order status should be 'accepted' or 'rejected', found ${status}`);
		}

		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Purchases.update({_id: purchaseId }, 
			{ $set: { status: status }},
			{ multi: false })


		//marking order as processed for shop owner
		var shopId = Purchases.findOne(purchaseId).shop
		Shops.update(shopId, { $inc: { unprocessedOrders: -1 }})	

		//TODO: notify purchase owner

	}
});