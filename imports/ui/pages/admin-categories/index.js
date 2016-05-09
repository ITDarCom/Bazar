import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './template.html'

import { Categories } from './../../../api/categories/collection'

Template.adminCategories.helpers({
	formCollection(){
		return Categories;
	},
	categories(){
		return Categories.find({})
	}
})