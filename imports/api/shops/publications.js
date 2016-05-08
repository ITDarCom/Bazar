import {Shops} from './collection'

Meteor.publish('shops', function itemsPublication(query, limit) {
	console.log('shops', query, limit)
	Meteor._sleepForMs(2000);
	return Shops.find();
});