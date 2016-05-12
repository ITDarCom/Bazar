import {Categories} from './collection'

Meteor.publish('categories', function categoriesPublication() {
	return Categories.find();
});