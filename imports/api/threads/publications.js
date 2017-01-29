import {Threads} from './collection'
import {Shops} from './../shops/collection'

const children = [
	{
		find(thread){
			const users = thread.participants.filter(p => p.type == 'user')
			if (users){
				const userIds = users.map(u => u.id)
				return Meteor.users.find({ _id: {$in: userIds } })
			}
		}
	},
	{
		find(thread){
			const shop = thread.participants.find(p => p.type == 'shop')
			if (shop){
				return Shops.find({_id: shop.id})
			}
		}
	}
]



Meteor.publish('announcements', function singleShopPublication(shopId) {
	//Meteor._sleepForMs(200);
	return Threads.find({
		isRootAnnouncement: true
	});	
});


Meteor.publishComposite('inbox', function inboxPublication(opts, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);

			const current = Meteor.users.findOne(this.userId)
			const shopId = current.shop

			const isAdmin = current.isAdmin

			const adminConditions = !isAdmin? {} : { isAnnouncement: false }

			return Threads.find({
				$and: [
					{
						$or : [
							{'participants.type': "user",'participants.id': this.userId},
							{'participants.type': "shop",'participants.id': shopId}
						]
					},
					{ isRemoved: false }, adminConditions
				], 
			}, { limit: limit, sort: { createdAt: -1 } });
			
		}, 
		children : children
	}
});


Meteor.publishComposite('singleThread', function singleThreadPublication(threadId){
	return {
		find(){
			//Meteor._sleepForMs(200);
			check(threadId, String);
			return Threads.find({_id: threadId})

		}, 
		children : children
	}
});
