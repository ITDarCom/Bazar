import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Categories } from './../../../api/categories/collection.js'

import './template.html'

Template.categoriesShow.helpers({
	categoryName(){
		const identifier = Router.current().params.category
		return Categories.findOne({identifier: identifier})
	}
})
