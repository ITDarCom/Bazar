import {Items} from './collection'

Meteor.publish('items', function itemsPublication(query, limit) {
	console.log(query, limit)
	Meteor._sleepForMs(2000);
	return Items.find();
});