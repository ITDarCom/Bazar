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

	},


	'threads.sendMessage'(recepientType, recepientId, inboxType, body){

		check(recepientType, String);
		check(recepientId, String);
		check(inboxType, String);
		check(body, String);

		//TODO, check no previous thread exists...

		var senderSelector
		if (inboxType.match(/personal/)){
			selector = { $elemMatch: { type:"user", id: this.userId } }
		} else {
			const shopId = Meteor.users.findOne(this.userId).profile.shop
			selector = { $elemMatch: { type:"shop", id: shopId} }
		}

		const existingThread = Threads.findOne({
			$and: [
				{ 'participants': senderSelector },
				{ 'participants': { $elemMatch: { type:recepientType, id:recepientId}} }  
			]
		})

		if (existingThread){

			Meteor.call('threads.addMessage', existingThread._id, inboxType, body)

		} else {

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

			var recepient = {
				type: recepientType,
				id: recepientId,
				unread: true,
			}

	        var thread = { 
	            messages: [message], 
	            participants: [
	                _.extend(_.clone(author), { unread: false }), 
	                recepient
	            ],
	            updatedAt: new Date(),
	        }

	        Threads.insert(thread)	

		}
	}

});