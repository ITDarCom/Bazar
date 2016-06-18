import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Items } from './collection'

Meteor.methods({
	'items.insert'(doc) {

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const hasShop = Meteor.users.findOne(this.userId).hasShop

		if (hasShop){

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
})
