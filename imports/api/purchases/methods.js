import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Purchases } from './collection'
import { Items } from './../items/collection'
import { Shops } from './../shops/collection'

Meteor.methods({

	'cart.addItem'(itemId) {

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

	'cart.removePurchase'(purchaseId){

		check(purchaseId, String);

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Purchases.remove({_id: purchaseId, status: 'cart' })

	},

	'cart.updatePurchase'(modifier, documentId){
		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		Purchases.update({ _id: documentId }, modifier, documentId);
	},	

	'cart.submit'(deliveryInfo){

		check(deliveryInfo.email, String);
		check(deliveryInfo.phone, String);
		check(deliveryInfo.deliveryAddress, String);
		check(deliveryInfo.deliveryDate, Date);

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var cartItems = Purchases.find({user: this.userId, status: 'cart'})

		cartItems.forEach(function(item){
			//notify shop owner
			var shopId = Shops.update(item.shop, { $inc: { unreadOrders: 1 }})			
		})

		Purchases.update({user: this.userId, status: 'cart'}, 
			{ $set: { status: 'pending', deliveryInfo: deliveryInfo }},
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
		Shops.update(shopId, { $inc: { unreadOrders: -1 }})	

		//TODO: notify purchase owner

	},

	'purchases.setReadStatus'(status){
		if (status) {
	        Meteor.users.update(this.userId, { $set: { 'profile.unreadPurchases': 0 }})
		}
	}
});