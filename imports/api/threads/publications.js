import {Threads} from './collection'

Meteor.publishComposite('inbox', function inboxPublication(opts, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);
			if (opts.inboxType.match(/personal/)){
				return Threads.find({
					'participants.type': "user",
					'participants.id': this.userId
				}, { limit: limit, sort: { createdAt: -1 } });
			} else {
				const shopId = Meteor.users.findOne(this.userId).profile.shop
				return Threads.find({
					'participants.type': "shop",
					'participants.id': shopId
				}, { limit: limit, sort: { createdAt: -1 } });
			}
		}, 
		/*children : [
			{
				find(item){
					//return Shops.find({ _id: item.shop})
				}
			}

		]*/
	}
});


Meteor.publishComposite('singleThread', function singleThreadPublication(threadId){
	return {
		find(){
			//Meteor._sleepForMs(200);
			check(threadId, String);
			return Threads.find({_id: threadId})

		}, 
		/*children : [
			{
				find(item){
					//return Shops.find({ _id: item.shop})
				}
			}

		]*/
	}
});
