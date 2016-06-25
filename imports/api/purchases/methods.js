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

		const cartItems = Purchases.find({user: this.userId, status: 'cart'}).fetch()
		var currentUser = Meteor.users.findOne(this.userId)

		cartItems.forEach(function(item){
			//notify shop owner
			var shopId = Shops.update(item.shop, { $inc: { unreadOrders: 1 }})			
		})
		Meteor.users.update(this.userId, { $inc: { 'pendingPurchases': cartItems.length }})

		Purchases.update({user: this.userId, status: 'cart'}, 
			{ $set: { status: 'pending', deliveryInfo: deliveryInfo }},
			{ multi: true })

		if (!currentUser.phone){
			Meteor.users.update(this.userId, { $set: { 'phone': deliveryInfo.phone }})
		}


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
		const purchase = Purchases.findOne(purchaseId)
		const shopId = purchase.shop
		const userId = purchase.user

		Shops.update(shopId, { $inc: { unreadOrders: -1 }})	

		//notifying purchase owner
        Meteor.users.update(userId, { $inc: { 'unreadPurchases': 1 }});
		Meteor.users.update(userId, { $inc: { 'pendingPurchases': -1 }});

	},

	'purchases.setReadStatus'(status){
		if (status) {
	        Meteor.users.update(this.userId, { $set: { 'unreadPurchases': 0 }})
		}
	}
});