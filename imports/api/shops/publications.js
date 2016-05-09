import {Shops} from './collection'

Meteor.publish('shops', function shopsPublication(query, limit) {
	console.log('shops', query, limit)
	Meteor._sleepForMs(2000);
	return Shops.find();
});

Meteor.publish('singleShop', function singleShopPublication(shopId) {
	console.log('shop', shopId)
	Meteor._sleepForMs(2000);
	return Shops.find({_id: shopId});
});

Meteor.publish('shopData', function shopDataPublication() {
	console.log('shopData')
	Meteor._sleepForMs(2000);

	if (this.userId){
		return Shops.find({user: this.userId});		
	} else {
		return this.ready()
	}
});