import {Threads} from './collection'

Meteor.publishComposite('inbox', function inboxPublication(opts, limit){
	return {
		find(){
			//Meteor._sleepForMs(200);
			console.log('inbox', opts.inboxType)

			if (opts.inboxType.match(/personal/)){
				return Threads.find({
					'participants': { type: 'user', id: this.userId }
				}, { limit: limit, sort: { createdAt: -1 } });
			} else {
				const shopId = Meteor.users.findOne(this.userId).profile.shop
				return Threads.find({
					'participants': { type: 'shop', id: shopId }
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
