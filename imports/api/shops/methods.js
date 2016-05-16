import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Shops } from './collection'

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
				createdAt: new Date(),
				owner: this.userId,
				username: Meteor.users.findOne(this.userId).username,
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
	'shops.remove'(){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var profile = Meteor.users.findOne(this.userId).profile

		if (profile && profile.hasShop){

			Shops.remove({ _id: profile.shop })

			//TODO: remove all items!

			Meteor.users.update({ _id: this.userId}, 
				{ $set: { 'profile.hasShop': false, 'profile.shop': null } 
			})	

		}



	}
});