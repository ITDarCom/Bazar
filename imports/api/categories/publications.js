import {Categories} from './collection'

Meteor.publish('categories', function categoriesPublication() {
	Meteor._sleepForMs(200);
	return Categories.find();
});