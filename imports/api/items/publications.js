import {Items} from './collection'

Meteor.publish('items', function itemsPublication(query, limit) {
	console.log('items', query, limit)
	//Meteor._sleepForMs(2000);
	return Items.find(query);
});

Meteor.publish('singleItem', function itemsPublication(itemId) {
	console.log('item', itemId)
	//Meteor._sleepForMs(2000);
	return Items.find({_id: itemId});
});