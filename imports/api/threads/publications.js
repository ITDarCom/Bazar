import {Threads} from './collection'
import {Shops} from './../shops/collection'

const children = [
	{
		find(thread){
			const user = thread.participants.find(p => p.type == 'user')
			if (user){
				return Meteor.users.find({ _id: user.id })
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

Meteor.publishComposite('inbox', function inboxPublication(opts, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);
			if (opts.inboxType.match(/personal/)){
				return Threads.find({
					'participants.type': "user",
					'participants.id': this.userId
				}, { limit: limit, sort: { createdAt: -1 } });
			} else if (opts.inboxType.match(/shop/)){
				const shopId = Meteor.users.findOne(this.userId).profile.shop
				return Threads.find({
					'participants.type': "shop",
					'participants.id': shopId
				}, { limit: limit, sort: { createdAt: -1 } });
			}
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