import {Categories} from './collection'

Meteor.publish('categories', function categoriesPublication() {
	Meteor._sleepForMs(2000);
	return Categories.find();
});