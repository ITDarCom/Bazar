import {Shops} from './collection'

import './search'

Meteor.publish('shops', function shopsPublication(query, limit) {
	//Meteor._sleepForMs(200);
	return Shops.find({isHidden: false}, { limit: limit, sort: {title:1}});
});

Meteor.publish('singleShop', function singleShopPublication(shopId) {
	//Meteor._sleepForMs(200);
	return Shops.find({_id: shopId});
});

Meteor.publish('shopData', function shopDataPublication() {
	//Meteor._sleepForMs(200);

	if (this.userId){
		return Shops.find({user: this.userId});
	} else {
		return this.ready()
	}
});