import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection.js'
import { Shops } from './../../../api/shops/collection.js'

Template.mainNav.helpers({
	categories(){
		return Categories.find({}).fetch().map(function(category){
			return _.extend(category, { 
				path: Router.path('categories.show', { category: category.identifier })})
		})
	}
})