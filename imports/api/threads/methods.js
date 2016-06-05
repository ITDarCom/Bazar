import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Threads } from './collection'

Meteor.methods({

	'threads.markAsRead'(threadId, inboxType){		

		check(threadId, String);
		check(inboxType, String);

		if (inboxType.match(/personal/)){
	        var count = Threads.update({ _id: threadId, 'participants.id': this.userId }, { $set: { 'participants.$.unread': false }}, false, false)
        	Meteor.users.update(this.userId, { $inc: { 'unreadPersonalInbox': -1 }})
		} else {
			const shopId = Meteor.users.findOne(this.userId).profile.shop
			Threads.update({ _id: threadId, 'participants.id': shopId }, { $set: { 'participants.$.unread': false }}, false, false)
			Meteor.users.update(this.userId, { $inc: { 'unreadShopInbox': -1 }})
		}

	},

	'threads.addMessage'(threadId, inboxType, body){

		check(threadId, String);
		check(inboxType, String);
		check(body, String);

		var author
		if (inboxType.match(/personal/)){
            author = {
                type: 'user', id: this.userId
            }
		} else {
			author = {
                type: 'shop', id: Meteor.users.findOne(this.userId).profile.shop
            }
		}

		var message = {
			author: author,
            body: body
		}

		Threads.update({_id:threadId}, { $push: { messages: message }})

	}
});