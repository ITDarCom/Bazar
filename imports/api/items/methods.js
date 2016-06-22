import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Items } from './collection'

Meteor.methods({
	'items.insert'(doc) {

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		var profile = Meteor.users.findOne(this.userId).profile

		if (profile && profile.hasShop){

			return Items.insert({
				title: doc.title,
				description: doc.description,
				price: doc.price,
				category: doc.category,
				thumbnails: [{ url: '/cookie.jpg'}]
			}, (err, shopId) => {
				if (err) {
					throw err
				}
			});
		} 
	},
	'items.update'(modifier, documentId){
		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		Items.update({ _id: documentId }, modifier, documentId);
	},
	'item.hide'(itemId,status){
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		var item = Items.findOne(itemId)
		if(item){
			Items.update({_id: itemId},{isHidden: status});
		}

	}
})
