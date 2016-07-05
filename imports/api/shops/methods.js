import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Shops } from './collection'
import { Items } from './../items/collection'

Meteor.methods({
	'shops.insert'(doc) {

		check(doc.title, String);
		check(doc.description, String);
		check(doc.city, String);

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const hasShop = Meteor.users.findOne(this.userId).hasShop

		if (!hasShop){

			return Shops.insert({
				title: doc.title,
				description: doc.description,
				city: doc.city,
				createdAt: new Date()
			}, (err, shopId) => {
				if (!err) {
					Meteor.users.update({ _id: this.userId}, 
						{ $set: { 'hasShop': true, 'shop': shopId } 
					})			
				} else {
					throw err
				}
			});
		}
	},

	'shops.update'(modifier, documentId){
		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		Shops.update({ _id: documentId }, modifier, documentId);
	},

	'shops.remove'(){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const hasShop = Meteor.users.findOne(this.userId).hasShop
		const shop = Meteor.users.findOne(this.userId).shop

		if (hasShop){

			Items.remove({ shop: shop})
			Shops.remove({ _id: shop })
			//Purchases.remove({ _id: shop })

			Meteor.users.update({ _id: this.userId}, 
				{ $set: { 'hasShop': false, 'shop': null } 
			})	

		}


	},
	'shop.hide'(status){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var user = Meteor.users.findOne(this.userId)

		if (user.hasShop) {
			Shops.update({_id: user.shop},{$set: {isHidden: status}});
			Items.update({shop: user.shop},{$set: {isHidden: status}},{multi: true},function(err,res){
				if(!err){
					//console.log(res)
				}else{
					console.log("error is happened")
				}
			});

		}
	}
});