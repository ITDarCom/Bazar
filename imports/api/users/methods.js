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
    makeFavorite : function (itemId){
        check(itemId, String);
        if (this.userId){
            if(!Meteor.users.findOne({_id: this.userId, favorites: {$in: [itemId]}})) {

                Meteor.users.upsert({_id: this.userId}, {$addToSet: {favorites: itemId}});

            }
            else {

                Meteor.users.update({_id: this.userId}, {$pull: {favorites: itemId}});

            }
        }
    }
})
