import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Threads } from './collection'
import { Shops } from './../shops/collection'

import {getRecipient} from './../../ui/pages/inbox-thread/helpers'
import {bothAreUsers} from './../../ui/pages/inbox-thread/helpers'
import {recipientHelper} from './../../ui/pages/inbox-thread/helpers'
import {recipientIsShopOwner} from './../../ui/pages/inbox-thread/helpers'

Meteor.methods({

	'pushNotifications.newMessage'(userId){

		const user = Meteor.users.findOne(userId)
		const shop = Shops.findOne({ user: userId })
		const unreadOrders = shop ? shop.unreadOrders : 0
		const unreadInbox = user.unreadInbox

		Push.send({
            from: 'push',
            title: 'رسالة جديدة لك في بازار الالكتروني',
            text: 'اضغط لتفقد بريدك',
            badge: unreadOrders + unreadInbox,
            //sound: 'airhorn.caf',
            payload: {
            	route: 'inbox'
            },
            query: {
                userId: userId //this will send to a specific Meteor.user()._id
            }
        });
	},

	'pushNotifications.newOrder'(userId){

		const user = Meteor.users.findOne(userId)
		const shop = Shops.findOne({ user: userId })
		const unreadOrders = shop ? shop.unreadOrders : 0
		const unreadInbox = user.unreadInbox

		Push.send({
            from: 'push',
            title: 'طلب جديد على متجرك في بازار الالكتروني',
            text: 'اضغط لتفقد طلباتك',
            badge: unreadOrders + unreadInbox,
            //sound: 'airhorn.caf',
            payload: {
            	route: 'settings.orders'
            },
            query: {
                userId: userId //this will send to a specific Meteor.user()._id
            }
        });
	},	


	'pushNotifications.orderProcessed'(userId){

		const user = Meteor.users.findOne(userId)
		const shop = Shops.findOne({ user: userId })
		const unreadOrders = shop ? shop.unreadOrders : 0
		const unreadInbox = user.unreadInbox

		Push.send({
            from: 'push',
            title: 'تم معالجة طلبك على بازار الالكتروني',
            text: 'اضغط لتفقد مشترياتك',
            badge: unreadOrders + unreadInbox,
            //sound: 'airhorn.caf',
            payload: {
            	route: 'settings.purchases'
            },
            query: {
                userId: userId //this will send to a specific Meteor.user()._id
            }
        });
	},	

	'pushNotifications.orderDelivered'(userId){

		const user = Meteor.users.findOne(userId)
		const shop = Shops.findOne({ user: userId })
		const unreadOrders = shop ? shop.unreadOrders : 0
		const unreadInbox = user.unreadInbox
				
		Push.send({
            from: 'push',
            title: 'تم توصيل طلبك على بازار الالكتروني',
            text: 'اضغط لتفقد مشترياتك',
            badge: unreadOrders + unreadInbox,
            //sound: 'airhorn.caf',
            payload: {
            	route: 'settings.purchases'
            },
            query: {
                userId: userId //this will send to a specific Meteor.user()._id
            }
        });
	},			

	'threads.markAsUnread'(unread, threadId, forRecipient){	

		check(unread, Boolean);
		check(threadId, String);
		check(forRecipient, Boolean); //true if we want to change recipient status

		const increment = unread? 1: -1; //we inc +1 if unread, -1 if read
		const thread = Threads.findOne(threadId)
		const recipient = getRecipient(thread)
		
		if (forRecipient){

			//we only update the value if it is different
			if (unread != recipient.unread){

				if (recipient.type == 'user'){

					const userId = recipient.id

					Threads.update({ 
						_id: threadId, 
						'participants.id': userId }, 
						{ $set: { 'participants.$.unread': unread }
					}, false, false);

					Meteor.users.update(userId, { $inc: { 'unreadInbox': increment }})
					if (unread){
						Meteor.call('pushNotifications.newMessage', userId)
					}

				} else if (recipient.type == 'shop'){

					//finding the user who owns this shop inbox
					const shopId = recipient.id
					console.log(recipient)
					const userId = Meteor.users.findOne({ 'shop': shopId })._id

					Threads.update({ 
						_id: threadId, 
						'participants.id': shopId }, 
						{ $set: { 'participants.$.unread': unread }
					}, false, false)

					Meteor.users.update(userId, { $inc: { 'unreadInbox': increment }})
					if (unread){
						Meteor.call('pushNotifications.newMessage', userId)
					}
				}				
			}

		} else {

			const recipientIndex = thread.participants.indexOf(recipient);

			const index = (recipientIndex == 0)? 1 : 0
			const currentUser = thread.participants[index]

			//we only update the value if it is different
			if (unread != currentUser.unread){

				if (currentUser.type == 'user'){

					const userId = this.userId
			        
			        var count = Threads.update({ 
			        	_id: threadId, 
			        	'participants.id': userId }, 
			        	{ $set: { 'participants.$.unread': unread }
			        }, false, false);
		        	
		        	Meteor.users.update(userId, { $inc: { 'unreadInbox': increment }})
		        	if (unread){
						Meteor.call('pushNotifications.newMessage', userId)
					}

				} else if (currentUser.type == 'shop'){

					const userId = this.userId
					const shopId = Meteor.users.findOne(this.userId).shop

					Threads.update({ 
						_id: threadId, 
						'participants.id': shopId }, 
						{ $set: { 'participants.$.unread': unread }
					}, false, false)

					Meteor.users.update(userId, { $inc: { 'unreadInbox': increment }})
					if (unread){
						Meteor.call('pushNotifications.newMessage', userId)
					}
				}

			}

		}

	},

	'threads.addMessage'(threadId, body){

		check(threadId, String);
		check(body, String);

		const thread = Threads.findOne(threadId)

		var author
		if (bothAreUsers(thread) || recipientIsShopOwner(thread)){
            author = {
                type: 'user', id: this.userId
            }
		} else {
			author = {
                type: 'shop', id: Meteor.users.findOne(this.userId).shop
            }
		}

		var message = {
			author: author,
            body: body
		}

		Threads.update({_id:threadId}, { 
			$push: { messages: message }
		})

		/*
		--> marking thread as unread for recipient
		we only mark thread unread
		if recipient is not online 
		and the thread is is not already an unread for him
		*/

		Meteor.call('threads.markAsUnread', true, threadId, true);

	},


	'threads.sendMessage'(recepientType, recepientId, inboxType, body){

		check(recepientType, String);
		check(inboxType, String);
		check(recepientId, String);
		check(body, String);

		//TODO, check no previous thread exists...

		var senderSelector
		if (inboxType.match(/personal|flag/)){
			senderSelector = { $elemMatch: { type:"user", id: this.userId } }
		} else if (inboxType == 'shop') {
			const shopId = Meteor.users.findOne(this.userId).shop
			senderSelector = { $elemMatch: { type:"shop", id: shopId} }
		} 

		const existingThread = Threads.findOne({
			$and: [
				{ 'participants': senderSelector },
				{ 'participants': { $elemMatch: { type:recepientType, id:recepientId}} }  
			]
		})


		if (existingThread){

			Meteor.call('threads.addMessage', existingThread._id, body)

		} else {

			var author
			if (inboxType.match(/personal|flag/)){
	            author = {
	                type: 'user', id: this.userId
	            }
			} else {
				author = {
	                type: 'shop', id: Meteor.users.findOne(this.userId).shop
	            }
			}

			var message = {
				author: author,
	            body: body
			}

			var recepient = {
				type: recepientType,
				id: recepientId,
				unread: false,
			}

	        const thread = { 
	            messages: [message], 
	            participants: [
	                _.extend(_.clone(author), { unread: false }), 
	                recepient
	            ],
	            updatedAt: new Date(),
	        }

	        const threadId = Threads.insert(thread)	

    		Meteor.call('threads.markAsUnread', true, threadId, true);

		}
	},

	'threads.sendAnnouncement'(announcementType, body){

		// Make sure the user is logged in before inserting a task
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const admin = Meteor.users.findOne(this.userId);
		if (!admin.isAdmin) {
			throw new Meteor.Error('not-authorized');
		}		

		check(announcementType, String);
		check(body, String);

		var author = {
            type: 'user', id: this.userId, isAnnouncer: true, unread: false
        }

		var message = {
			author: author,
            body: body
		}

		const announcementId = Date.now().toString()

		if (announcementType.match(/shop/)){

			const shops = Shops.find({}).fetch()
			shops.forEach(function(shop){

				var recepient = {
					type: 'shop',
					id: shop._id,
					unread: false,
				}

			    const thread = { 
			        messages: [message], 
			        participants: [
			            _.extend(_.clone(author), { unread: false }), 
			            recepient
			        ],
			        updatedAt: new Date(),
			        isAnnouncement: true,
			        announcementId : announcementId,
			        announcementType: announcementType
			    }

			    const threadId = Threads.insert(thread)	

				Meteor.call('threads.markAsUnread', true, threadId, true);	

			})

		} else {

			const users = Meteor.users.find({}).fetch()
			users.forEach(function(user){

				if (user._id == admin._id) return;

				var recepient = {
					type: 'user',
					id: user._id,
					unread: false,
				}

			    const thread = { 
			        messages: [message], 
			        participants: [
			            _.extend(_.clone(author), { unread: false }), 
			            recepient
			        ],
			        updatedAt: new Date(),
			        isAnnouncement: true,
			        announcementId : announcementId,
			        announcementType: announcementType
			    }

			    const threadId = Threads.insert(thread)	

				Meteor.call('threads.markAsUnread', true, threadId, true);	

			})
		}
		

	    const thread = { 
	        messages: [message], 
	        participants: [
	            _.extend(_.clone(author), { unread: false }), 
	            _.extend(_.clone(author), { unread: false })
	        ],
	        updatedAt: new Date(),
	        isAnnouncement: true,
	        isRootAnnouncement: true,
	        announcementId : announcementId,
	        announcementType: announcementType
	    }

	    const threadId = Threads.insert(thread)	






	}

	/*'threads.isActive'(userId, threadId){

        const index = MyApp.activeThreads.findIndex(r => {
            return (r.userId == userId) && (r.threadId == threadId)
        })		

        if (index == -1) {return false;} else { return true; } 

	},

    'threads.setInactive'(userId, threadId){

        const index = MyApp.activeThreads.findIndex(r => {
            return (r.userId == userId) && (r.threadId == threadId)
        })

        if (index != -1){
            MyApp.activeThreads.splice(index, 1);
        }

        console.log('setInactive', index, MyApp)
    },

    'threads.setActive'(userId, threadId){

        var record = { userId: userId, threadId: threadId }

        const index = MyApp.activeThreads.findIndex(r => {
            return (r.userId == userId) && (r.threadId == threadId)
        })        

        if (index == -1){
            MyApp.activeThreads.push(record)            
        }

        console.log('setActive', MyApp)
    }*/

});