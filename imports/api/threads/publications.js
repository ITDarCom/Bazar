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
			const shopId = Meteor.users.findOne(this.userId).shop

			return Threads.find({
				$and: [
					{
						$or : [
							{'participants.type': "user",'participants.id': this.userId},
							{'participants.type': "shop",'participants.id': shopId}
						]
					},
					{ isRemoved: false}
				]				
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
