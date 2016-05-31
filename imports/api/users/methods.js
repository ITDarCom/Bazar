import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
	'accounts.update'(modifier, documentId){
		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		modifier.$set.emails = [ {address: modifier.$set.email} ]
		Meteor.users.update({ _id: documentId }, modifier, documentId);
	},		
})
