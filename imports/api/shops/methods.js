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

		var profile = Meteor.users.findOne(this.userId).profile

		if (!profile || !profile.hasShop){

			return Shops.insert({
				title: doc.title,
				description: doc.description,
				city: doc.city,
				createdAt: new Date()
			}, (err, shopId) => {
				if (!err) {
					Meteor.users.update({ _id: this.userId}, 
						{ $set: { 'profile.hasShop': true, 'profile.shop': shopId } 
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

		var profile = Meteor.users.findOne(this.userId).profile

		if (profile && profile.hasShop){

			Items.remove({ shop: profile.shop})
			Shops.remove({ _id: profile.shop })
			//Purchases.remove({ _id: profile.shop })

			Meteor.users.update({ _id: this.userId}, 
				{ $set: { 'profile.hasShop': false, 'profile.shop': null } 
			})	

		}



	},
	'shops.hide'(status){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var profile = Meteor.users.findOne(this.userId).profile

		if (profile && profile.hasShop) {

			Shops.update({_id: profile.shop},{$set: {isHidden: status}})

		}

	}
});